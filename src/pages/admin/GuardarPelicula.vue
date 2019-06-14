<template>
	<q-page padding  class="q-mt-none q-pt-none" :style="`background-image: linear-gradient(rgba(255,255,255,.6), rgba(255,255,255,.6)),url(${$store.state.movie.baseTmdbImages}original/${form.backdrop_path});
			background-size: cover;
			background-position: 50% 50%;`">
			<q-breadcrumbs class="q-mt-xs q-mb-lg">
				<q-breadcrumbs-el label="Peliculas" to="/admin/peliculas" />
				<q-breadcrumbs-el class="active-breadcrumb" :label="$route.params.pelicula?'Nueva Pelicula':'Editar Pelicula'" />
			</q-breadcrumbs>

			<q-form
				@submit="onSubmit"
				@reset="onReset"
				class="row"
			>
		
			<div class="col-xs-12 col-sm-12 col-md-5" align="center">

				<q-img class="q-card" :src="`${$store.state.movie.baseTmdbImages}w342/${form.poster_path}`" style="width: 250px" v-if="form.poster_path">
					<div class="absolute-bottom text-body1 text-center">
						 <q-rating
							v-show="form.vote_average"
							v-model="form.vote_average"
							size="1.2em"
							color="orange"
							:max="10"
							readonly
							/>
					</div>
				</q-img>

				<!-- <q-uploader
					dense
					hide-upload-btn
					url="http://localhost:4444/upload"
					label="Imagenes"
					multiple
					accept=".jpg, image/*"
					style="max-width: 300px"
				/> -->
			</div>

			<div class="col-xs-12 col-sm-12 col-md-7" >
				<div class="q-mt-md">
					<q-input
						dense
						filled
						v-for="el, key in form"
						:key="key"
						v-model="form[key]"
						:label="`${key} *`"
						lazy-rules
						v-if="key !== 'estado'"

						:rules="[ val => val && val.length > 0 || `${key} es obligatorio`]"
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
			resultados = []
			// swfilm = false
		}" @show="()=>{

			$refs.inputSearch.focus()
			if(searchText!== ''){
				onSearch()
			}
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
										<span class="cursor-pointer text-indigo" style="text-decoration: underline;" v-html="`${resultado.title} (${resultado.release_date.slice(0,4)})`" @click="()=>{
											//para que salga ordenadito y solo los campos de form.
											let temp = {}
											for(var key in form) {
												temp[key] = resultado[key]
											}
											form = temp

											dialogSearch = false
										}"></span>
									
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

				generos:[],

				form:{//solo los datos que se muestran en la lista de peliculas.
					id: null,
					title: null,
					original_title: null,
					release_date: null,
					original_language: null,
					genre_ids:null,//  [14,36,etc].
					overview: null,
					vote_average: null,
					vote_count: null,
					popularity: null,
					poster_path: null,
					backdrop_path: null,
					estado:true,
				}
			}
		},
		created(){
			const self =  this
			this.$axios.get(`${self.$store.state.movie.baseTmdb}genre/movie/list?api_key=${self.$store.state.movie.keyTmdb}&language=es-ES`)
			.then(r=>{
				self.generos = r.data.genres.map(g=>{
					let gObj = {}
					gObj[g.id] = g
					return gObj
				})
			})
			.catch(r => {
				self.$q.notify({
				message: 'Error En El Servidor.',
				position: 'bottom',
				icon:'warning',
				color:'negative'
				})
			})
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

		onReset () {
			this.form = {
				id: null,
				title: null,
				original_title: null,
				release_date: null,
				original_language: null,
				genre_ids:null,//  [14,36,etc].
				overview: null,
				vote_average: null,
				vote_count: null,
				popularity: null,
				poster_path: null,
				backdrop_path: null,
				estado:true,
			}
		},

		onSubmit () {
			if (this.accept !== true) {
				this.$q.notify({
					color: 'red-5',
					textColor: 'white',
					icon: 'warning',
					message: 'You need to accept the license and terms first'
				})
			}
			else {
				this.$q.notify({
					color: 'green-4',
					textColor: 'white',
					icon: 'fas fa-check-circle',
					message: 'Submitted'
				})
			}
		},

			onLoad(index, done){

				console.log(index+1)
				console.log(this.totalPages)

				const self = this
				if(index+1 <= this.totalPages){
					this.$axios.get(`${self.$store.state.movie.baseTmdb}search/movie?api_key=${self.$store.state.movie.keyTmdb}&language=es-ES&query=${self.searchText}&page=${index+1}&include_adult=false`)
					.then(r=>{
						for(let i=0;i<r.data.results.length;i++){
							self.resultados[i].vote_average =  Math.round(self.resultados[i].vote_average*1)
							self.resultados[i].estado = true
							self.resultados.push(r.data.results[i])
						}
						done()
					})
					.catch(r => {
						self.$q.notify({
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
					const self = this

					this.$axios.get(`${self.$store.state.movie.baseTmdb}search/movie?api_key=${self.$store.state.movie.keyTmdb}&language=es-ES&query=${self.searchText}&page=1&include_adult=false`)
					.then(r=>{
						self.resultados = r.data.results
						for (let i=0;i<r.data.results.length;i++) {
							self.resultados[i].vote_average =  Math.round(self.resultados[i].vote_average*1)
							self.resultados[i].estado = true
						}
						self.totalResults = r.data.total_results
						self.totalPages = r.data.total_pages
						self.loadingState = false
					})
					.catch(r => {
						this.resultados = []
						self.$q.notify({
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