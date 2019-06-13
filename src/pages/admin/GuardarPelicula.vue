<template>
	<q-page padding>
		<!--  style="height:calc(100vh - 170px);" class="scroll" -->



		form para nuevo anterior
			<q-form
				@submit="onSubmit"
				@reset="onReset"
				class="row"
			>
		
			<div class="col-xs-12 col-sm-12 col-md-5" align="center">

				<q-uploader
					dense
					hide-upload-btn
					url="http://localhost:4444/upload"
					label="Imagenes"
					multiple
					accept=".jpg, image/*"
					style="max-width: 300px"

				/>

			
			
			</div>

			<div class="col-xs-12 col-sm-12 col-md-7" >
				<div class="q-mt-md">


					<q-input
						dense
						filled
						v-for="el, index in form"
						:key="index"
						v-model="form.id"
						:label="el *"
						lazy-rules
						:rules="[ val => val && val.length > 0 || 'El id es obligatorio']"
					/>

					<q-input
					dense
					filled
					v-model="form.title"
					label="Titulo *"
					lazy-rules
					:rules="[ val => val && val.length > 0 || 'El titulo es obligatorio']"
					/>

					<q-input
					dense
					filled
					v-model="form.original_title"
					label="Titulo Original *"
					lazy-rules
					:rules="[ val => val && val.length > 0 || 'El titulo original es obligatorio']"
					/>

					<q-input
					dense
					filled
					type="number"
					v-model="form.anio"
					label="Año *"
					lazy-rules
					:rules="[
					val => val !== null && val !== '' || 'El Año es obligatorio',
					val => val > 1999 && val < 2020 || 'Rango: 2000-2019'
					]"
					/>

					<q-input
					dense
					filled
					type="textarea"
					v-model="form.sinopsis"
					label="Sinopsis *"
					lazy-rules
					:rules="[ val => val && val.length > 0 || 'La sinopsis es obligatoria']"
					/>

					<q-input
					dense
					filled
					type="textarea"
					v-model="form.detallestecnicos"
					label="Detalles Tecnicos Del Ripeado*"
					lazy-rules
					:rules="[ val => val && val.length > 0 || 'Los detalles tecnicos son obligatorios']"
					/>

					<q-toggle v-model="form.estado" label="Habilitada" />

			
					<div class="q-mt-xl">
						<q-btn label="Guardar" type="submit" color="primary"/>
						<q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
					</div>
				</div>
			</div>
		</q-form>

		<q-dialog v-model="dialogSearch"  class="scroll-none" @hide="()=>{
			loadingState=false
			// searchText = null
			// resultados = null
			// swfilm = false
		}" @show="()=>{

			$refs.inputSearch.focus()
		}">
		<q-card style="width: 800px; max-width: 90vw;">
			<q-card-section>
				<div class="text-h6" align="center">Buscar en Tmdb</div>
			</q-card-section>

			<q-separator />
				<q-card-section style="height:calc(100vh - 170px);" class="scroll">
					<q-form
						@submit="onSearch"
						class="q-gutter-md"
						>
						<q-input
							dense
							ref ='inputSearch' 
							standout="bg-primary text-white"
							v-model.trim="searchText"
							label="Presiona enter para buscar"
							:loading="loadingState"
							:disable ="loadingState"
						>
						<template v-if="searchText && !loadingState" v-slot:append>
							 <q-icon name="cancel" @click.stop="()=>{
								searchText = null
								resultados=[]
							 }" class="cursor-pointer" />
						 </template>
						</q-input>
					</q-form>
					<q-infinite-scroll @load="onLoad" :offset="250"  v-if="resultados.length">
					<div>
							<q-list bordered separator>
							<q-item-label header>{{totalResults}} resultados (elije uno):</q-item-label>
							<q-item v-for="resultado, index in sortResults" :key="index">
								<q-item-section top avatar>
									<q-avatar class="q-ma-none q-pa-none" size="92px" square>
										{{index}}
										<img  :src="`${$store.state.movie.baseTmdbImages}w342/${resultado.poster_path}`" v-if="resultado.poster_path">
									</q-avatar>
								</q-item-section>
								<q-item-section>
									<q-item-label>
										<span class="cursor-pointer text-indigo" style="text-decoration: underline;" v-html="`${resultado.title} (${resultado.release_date.slice(0,4)})`"></span>
									
									</q-item-label>
									<q-item-label  v-html="resultado.overview" caption>
									</q-item-label>
								</q-item-section>
								<q-item-section top side>
									<div class="text-blue-8 q-gutter-xs">
										<!-- <q-btn class="gt-xs" size="12px" flat dense round icon="delete" /> -->
										<q-btn class="gt-xs" size="12px" flat  round icon="done" />
										<!-- <q-btn size="12px" flat dense round icon="more_vert" /> -->
									</div>
								</q-item-section>
							</q-item>
						</q-list>
					</div>
					<template v-slot:loading>
						<div class="row justify-center q-my-md">
							<q-spinner-dots color="primary" size="40px" />
						</div>
					</template>
					</q-infinite-scroll>
					<div v-else>
						<p class="caption q-mt-md">Ningun resultado</p>
					</div>
				</q-card-section>
				<!-- <q-separator /> -->
				<q-card-actions align="right">
					<q-btn flat label="Cerrar" icon="close" color="primary" v-close-popup />
					<!-- <q-btn flat label="Accept" color="primary" v-close-popup /> -->
				</q-card-actions>
			</q-card>
		</q-dialog>
		<q-page-sticky position="bottom-right" :offset="[18, 18]">
			<q-btn fab icon="search" color="accent"  @click="dialogSearch = true"/>
		</q-page-sticky>
	</q-page>
</template>
<script>


	export default{
		data(){
			return{
				dialogSearch:true,
				searchText:null,
				loadingState:false,
				resultados:[], 
				totalPages:0,
				totalResults:0,
				form:{//solo los datos que se muestran en la lista de peliculas.
					id: null,
					vote_count: null,
					vote_average: null,
					title: null,
					popularity: null,
					poster_path: null,
					original_language: null,
					original_title: null,
					backdrop_path: null,
					overview: null,
					release_date: null
				}
			}
		},
		
	computed:{
		sortResults(){
			return this.resultados.sort(function(a, b){
					var keyA = new Date(a.release_date),
							keyB = new Date(b.release_date);
					// Compare the 2 dates
					if(keyA > keyB) return -1;
					if(keyA < keyB) return 1;
					return 0;
			});
		}
	},
	methods: {

			onLoad(index, done){

				console.log(index+1)
				console.log(this.totalPages)

				const this_ = this
				if(index+1 <= this.totalPages){
					this.$axios.get(`${this_.$store.state.movie.baseTmdb}3/search/movie?api_key=${this_.$store.state.movie.keyTmdb}&language=es-ES&query=${this_.searchText}&page=${index+1}&include_adult=false`)
					.then(r=>{
						for(let i=0;i<r.data.results.length;i++){
							this_.resultados.push(r.data.results[i])
						}
						done()
					})
					.catch(r => {
						this_.$q.notify({
						message: 'Error En El Servidor.',
						position: 'bottom',
						icon:'warning',
						color:'negative'
						})
					})
				}
				return false

				// setTimeout(() => {
				// 	if (this.resultados) {
				// 		this.resultados.push({
				// 			title:'Hola',
				// 			overview:'Una revision',
				// 			release_date:'1980-10-11'
				// 		})
				// 		done()
				// 	}
				// }, 2000)

			},

			onSearch(){

				// console.log(this.searchText)
				if(!this.searchText){
					this.$q.notify({
						color: 'red-5',
						textColor: 'white',
						icon: 'warning',
						message: 'Debes introducir un titulo'
					})
					this.searchText = null

				}else{
					this.resultados = []
					this.loadingState = true
					const this_ = this

					this.$axios.get(`${this_.$store.state.movie.baseTmdb}3/search/movie?api_key=${this_.$store.state.movie.keyTmdb}&language=es-ES&query=${this_.searchText}&page=1&include_adult=false`)
					.then(r=>{
						this_.resultados = r.data.results
						this_.totalResults = r.data.total_results
						this_.totalPages = r.data.total_pages
						this_.loadingState = false
					})
					.catch(r => {
						this.resultados = []
						this_.$q.notify({
						message: 'Error En El Servidor.',
						position: 'bottom',
						icon:'warning',
						color:'negative'
						})
					})


				}
				
			},

		}
	}
</script>