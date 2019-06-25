<template>

	<q-page padding  class="q-mt-none q-pt-none" :style="form.backdrop_path? `background-image: linear-gradient(rgba(255,255,255,.3), rgba(255,255,255,.3)),url(${$store.state.movie.baseTmdbImages}original/${form.backdrop_path});
				background-size: cover;
				background-position: 50% 50%;`:'background-color:white;'">

			<q-breadcrumbs class="q-pa-xs text-grey-8" >
				<q-breadcrumbs-el label="Series" to="/admin/series" />
				<q-breadcrumbs-el class="active-breadcrumb" :label="$route.params.serie?'Editar Serie':'Nueva Serie'" />
			</q-breadcrumbs>
			<q-separator color="primary"/>	
			
			<q-form
				@submit="onSave"
				@reset="onReset"
				class="q-mt-sm row"
			>
		
			<div class="col-xs-12 col-sm-12 col-md-3" align="center">

				<q-img class="q-card" :src="`${$store.state.movie.baseTmdbImages}w342/${form.poster_path}`" style="width: 250px" v-if="form.poster_path">
					<div class="absolute-bottom text-body1 text-center">
						 <q-rating
							v-show="form.vote_average"
							v-model="form.vote_average*1"
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

			<div class="col-xs-12 col-sm-12 col-md-9 text-white q-pa-md q-card" style="background-color: rgba(0, 0, 0, 0.5);">
				<div class="q-mt-md">
					<q-input
						dark 
						bg-color="transparent"
						dense
						filled
						v-for="el, key in form"
						:key="key"
						v-model="form[key]"
						:label="`${key} *`"
						lazy-rules
						v-if="key !== 'estado' && key !== 'detalles_tecnicos'"
						:type="key!=='overview'?'text':'textarea'"
						:rules="[ val => val && val.length > 0 || `${key} es campo requerido`]"
					/>
			

					<q-toggle v-model="form.estado" label="Habilitada" color="primary" class="q-mb-md"/>
					<br>
					<label for="qeditor">Detalles Tecnicos</label>
					<q-editor
						id="qeditor"
						flat
						dark
						content-class="bg-black"
						toolbar-text-color="white"
						toolbar-toggle-color="yellow-8"
						toolbar-flat
						toolbar-bg="primary"
						v-model="form.detalles_tecnicos"
						:dense="$q.screen.lt.md"
						:toolbar="[
							[
								{
									label: $q.lang.editor.align,
									icon: $q.iconSet.editor.align,
									fixedLabel: true,
									list: 'only-icons',
									options: ['left', 'center', 'right', 'justify']
								},
								{
									label: $q.lang.editor.align,
									icon: $q.iconSet.editor.align,
									fixedLabel: true,
									options: ['left', 'center', 'right', 'justify']
								}
							],
							['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
							['token', 'hr', 'link', 'custom_btn'],
							['print', 'fullscreen'],
							[
								{
									label: $q.lang.editor.formatting,
									icon: $q.iconSet.editor.formatting,
									list: 'no-icons',
									options: [
										'p',
										'h1',
										'h2',
										'h3',
										'h4',
										'h5',
										'h6',
										'code'
									]
								},
								{
									label: $q.lang.editor.fontSize,
									icon: $q.iconSet.editor.fontSize,
									fixedLabel: true,
									fixedIcon: true,
									list: 'no-icons',
									options: [
										'size-1',
										'size-2',
										'size-3',
										'size-4',
										'size-5',
										'size-6',
										'size-7'
									]
								},
								{
									label: $q.lang.editor.defaultFont,
									icon: $q.iconSet.editor.font,
									fixedIcon: true,
									list: 'no-icons',
									options: [
										'default_font',
										'arial',
										'arial_black',
										'comic_sans',
										'courier_new',
										'impact',
										'lucida_grande',
										'times_new_roman',
										'verdana'
									]
								},
								'removeFormat'
							],
							['quote', 'unordered', 'ordered', 'outdent', 'indent'],

							['undo', 'redo']
						]"
						:fonts="{
							arial: 'Arial',
							arial_black: 'Arial Black',
							comic_sans: 'Comic Sans MS',
							courier_new: 'Courier New',
							impact: 'Impact',
							lucida_grande: 'Lucida Grande',
							times_new_roman: 'Times New Roman',
							verdana: 'Verdana'
						}"
					/>
					<div class="q-mt-xl">
						<q-btn label="Guardar" type="submit" color="primary"/>
						<q-btn label="Reset" type="reset" color="white" flat class="q-ml-sm" />
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
						class="q-gutter-md q-mb-xs"
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
						<!-- 		<q-item-section left avatar class="q-ma-none q-pa-none">
										<div align="center" style="font-size:16px;">{{index}}</div>
								</q-item-section>
								<q-item-section top avatar>
									<q-avatar class="q-ma-none q-pa-none" size="92px" square>
										<img  :src="`${$store.state.movie.baseTmdbImages}w342/${resultado.poster_path}`" v-if="resultado.poster_path">
									</q-avatar>
								</q-item-section> -->

								<q-item-section top avatar>
									<q-img
											:src="`${$store.state.movie.baseTmdbImages}w342/${resultado.poster_path}`"
											style="height: 100px; width: 70px;"
											:ratio="1"
											basic
											spinner-color="black"
											>
											<div class="absolute-bottom text-center text-body">
												{{index+1}}
											</div>
											</q-img>

								</q-item-section>
								<q-item-section>
									<q-item-label>
										<span class="cursor-pointer text-indigo" style="text-decoration: underline;" v-html="`${resultado.name} (${resultado.first_air_date.slice(0,4)})`" @click="()=>{
											//para que salga ordenadito y solo los campos de form.
											// let temp = {}
											onReset()

											for(let key in form) {
												if(resultado[key]){
													form[key] = resultado[key]+''	
												}
											}

											form.estado = true
											form.detalles_tecnicos = ''
											// form = temp

											dialogSearch = false
										}"></span>
									
									</q-item-label>
									<q-item-label  v-html="resultado.overview.length>100?resultado.overview.slice(0,99)+'...':resultado.overview" caption>
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
			dialogSearch:false,
			searchText:null,
			loadingState:false,
			resultados:[], 
			totalPages:0,
			totalResults:0,

			generos:[],

			form:{//solo los datos que se muestran en la lista de peliculas.
				id: null,
				name: null,
				original_name: null,
				first_air_date: null,
				temporadas_disponibles:null,
				original_language: null,
				origin_country:null,//['US']
				genre_ids:null,//  [14,36,etc].
				overview: null,
				vote_average: null,
				vote_count: null,
				popularity: null,
				poster_path: null,
				backdrop_path: null,
				estado:1,
				url:null,
				detalles_tecnicos:''
			}
		}
	},
	created(){
		const self =  this
		this.$axios.get(`${self.$store.state.movie.baseTmdb}genre/tv/list?api_key=${self.$store.state.movie.keyTmdb}&language=es-ES`)
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

		console.log(this.$route.params.serie)
		if(this.$route.params.serie){
			this.dialogSearch=false
			for(let key in this.form){
				this.form[key] = this.$route.params.serie[key]
			}
			this.form.estado = this.form.estado == '1'?true:false
		}else{
			this.dialogSearch=true

		}
		
	},
	computed:{
		sortResults(){
			return this.resultados.sort(function(a, b){
				var keyA = new Date(a.first_air_date),
						keyB = new Date(b.first_air_date);
				// Compare the 2 dates
				if(keyA > keyB) return -1
				if(keyA < keyB) return 1
				return 0
			});
		}
	},
	methods: {
		onSave(){
			// if (this.accept !== true){
			// 	this.$q.notify({
			// 		message: 'Revisa todos los campos.',
			// 		position: 'top',
			// 		icon:'warning',
			// 		color:'red-5'
			// 	})
			// }
			// else {
				const self = this
				this.$q.loading.show()
				let sendFormData = new FormData()
				for(let key in this.form){
					if(key == 'estado'){
						sendFormData.append(key, this.form[key]*1)
					}else{
						sendFormData.append(key, this.form[key])
					}
				}
				self.$axios({
					method: 'post',
					url:`${self.$store.state.movie.baseUrl}savemv/serie`,
					data:sendFormData,
					config: { headers: {'Content-Type': 'multipart/form-data' }}
				}).then(r =>{
					self.$q.loading.hide()
					if(r.data.status === 'ok'){
						self.onReset()
						this.$q.notify({
							position: 'bottom',
							color: 'green-4',
							textColor:'white',
							icon: 'thumb_up',
							message: r.data.msg
						})
					}else{
						this.$q.notify({
							position: 'bottom',
							color:'red-5',
							textColor:'white',
							icon:'warning',
							message: r.data.msg
						})
					}
				}).catch(r =>{
					self.loadingState = false
					this.$q.notify({
						message: 'Error En El Servidor.',
						position: 'bottom',
						icon:'warning',
						color:'red-5'
					})
				})
			// }
		},

		onReset () {
			this.form ={
				id: null,
				name: null,
				original_name: null,
				first_air_date: null,
				temporadas_disponibles:null,
				original_language: null,
				origin_country:null,//['US']
				genre_ids:null,//  [14,36,etc].
				overview: null,
				vote_average: null,
				vote_count: null,
				popularity: null,
				poster_path: null,
				backdrop_path: null,
				estado:1,
				url:null,
				detalles_tecnicos:''
			}
		},
		onLoad(index, done){
			// console.log(index+1)
			// console.log(this.totalPages)
			const self = this
			if(index+1 <= this.totalPages){
				this.$axios.get(`${self.$store.state.movie.baseTmdb}search/tv?api_key=${self.$store.state.movie.keyTmdb}&language=es-ES&query=${self.searchText}&page=${index+1}&include_adult=false`)
				.then(r=>{
					for(let i=0;i<r.data.results.length;i++){
						self.resultados[i].vote_average =  Math.round(self.resultados[i].vote_average*1)
						self.resultados[i].estado = 1
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
			// 			first_air_date:'1980-10-11'
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
				this.$axios.get(`${self.$store.state.movie.baseTmdb}search/tv?api_key=${self.$store.state.movie.keyTmdb}&language=es-ES&query=${self.searchText}&page=1&include_adult=false`)
				.then(r=>{
					self.resultados = r.data.results
					for (let i=0;i<r.data.results.length;i++) {
						self.resultados[i].vote_average =  Math.round(self.resultados[i].vote_average*1)
						self.resultados[i].estado = 1
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