<template>
	<q-page padding  class="q-mt-none q-pt-none">
		<q-breadcrumbs class="q-mt-xs q-mb-lg">
			<q-breadcrumbs-el label="Peliculas" to="/admin/peliculas" />
			<q-breadcrumbs-el class="active-breadcrumb" :label="$route.params.pelicula?'Nueva Pelicula':'Editar Pelicula'" />
		</q-breadcrumbs>
		
		<!-- <div class="col-6"> -->
			<!-- 	<q-img
					src="statics/captain_marvel.jpg"
					style="width:300px;"
					:ratio="1"
				>
					<div class="absolute-bottom text-body1 text-center">
						Capitana Marvel
					</div>
				</q-img> -->
				<!-- </div> -->

				<div class="row">
					<div class="col-sm-12 col-md-6 ">
						<q-form
						@submit="onSubmit"
						@reset="onReset"
						class="full-width q-gutter-sm"
						>
						<q-uploader
						dense
						hide-upload-btn
						url="http://localhost:4444/upload"
						label="Imagenes"
						multiple
						accept=".jpg, image/*"
						style="max-width: 300px"
						/>
						<q-input
						dense
						filled
						v-model="form.nombre"
						label="Titulo *"
						lazy-rules
						:rules="[ val => val && val.length > 0 || 'El titulo es obligatorio']"
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

						<q-input
						dense
						filled
						v-model="form.traileruri"
						label="Trailer url"
						lazy-rules

						/>

						<q-input
						dense
						filled
						v-model="form.idfilmafinitty"
						label="Codigo FilmAfinitty"
						lazy-rules

						/>
						<q-input
						dense
						filled
						v-model="form.idimdb"
						label="Codigo IMDb"
						lazy-rules

						/>



						<div>
							<q-btn label="Guardar" type="submit" color="primary"/>
							<q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
						</div>
					</q-form>
				</div>

			</div>
			<!-- full-width -->
			<q-dialog v-model="dialogSearch"  class="scroll-none" @hide="()=>{
				loadingState=false
				searchText = null
				resultados = null
				swfilm = false
			}" @show="()=>{

				$refs.inputSearch.focus()
			}">
				<q-card style="width: 800px; max-width: 90vw;" v-if="!swfilm">
					<q-card-section>
						<div class="text-h6" align="center">Buscar en Filmafinitty</div>
					</q-card-section>

					<q-separator />

					<q-card-section style="height:calc(100vh - 170px);" class="scroll">
					
						<q-form
							@submit="onSearch"
							
							class="q-gutter-md"
							>
							<q-input
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
												resultados=null
											 }" class="cursor-pointer" />
										 </template>
							</q-input>
						</q-form>
						
						<div v-if="resultados">
							<!-- <p class="caption q-mt-md">{{resultados.length}} resultados (elije uno):</p> -->
			<!-- 				<q-card v-for="resultado, index in resultados" :key="index" class="q-mt-xs">
								<q-card-section>
									<a :href="`https://www.filmaffinity.com/es/film${resultado.id}.html`" target="_blank"><q-icon :name="`img:https://www.filmaffinity.com/images/com/categories/FA_1000x1000.jpg`"/>{{resultado.titulo}}</a>
									<p>{{resultado.desc}}</p>
								</q-card-section>	
							</q-card> -->


							<q-list bordered separator>
								<q-item-label header>{{resultados.length}} resultados (elije uno):</q-item-label>
								<q-item v-for="resultado, index in resultados" :key="index">
									<q-item-section top avatar>
														<q-avatar rounded>
															<img src="statics/FA.png">
														</q-avatar>
													</q-item-section>
									<q-item-section>
										<q-item-label>
											<!-- <a :href="`https://www.filmaffinity.com/es/film${resultado.id}.html`" target="_blank">{{resultado.titulo}}</a> -->
											<span class="cursor-pointer text-indigo" style="text-decoration: underline;" @click="getMovieRawHtml(resultado)">{{resultado.titulo}}</span>
										</q-item-label>
										<q-item-label caption>
											{{resultado.desc}}
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
						<div v-else>
							<p class="caption q-mt-md">Ningun resultado</p>
						</div>
							
					</q-card-section>

					<q-separator />

					<q-card-actions align="right">
						<q-btn flat label="Cerrar" icon="close" color="primary" v-close-popup />
						<!-- <q-btn flat label="Accept" color="primary" v-close-popup /> -->
					</q-card-actions>
				</q-card>

				<q-card style="width: 100%; max-width: 100vw;" v-else>
					<q-card-section class="text-h6 q-my-xs q-py-xs">
						<div  align="center">{{filmVer.titulo}}</div>

					</q-card-section>
					<q-separator />

					<q-card-section style="height:calc(100vh - 150px);" class="scroll">
						<div class="row ">
							<div class="col-sm-12 col-md-6 q-mt-sm q-pl-md" align="center">
								<!-- <img :src="`${$store.state.movie.baseUrl}getImagen/${rawHtml.imagen}`" :alt="rawHtml.imagen">  -->


								<q-img class="q-card" :src="`${$store.state.movie.baseUrl}getImagen/${rawHtml.imagen}`" style="width: 250px" v-if="rawHtml.imagen">
									<div class="absolute-bottom text-body1 text-center">
										 <q-rating
											v-show="rawHtml.ratingn"
											v-model="rawHtml.ratingn"
											size="1.2em"
											color="orange"
											:max="10"
											readonly
											/>
									</div>
								</q-img>
								
								<!-- <q-img
									 src="https://cdn.quasar.dev/img/non-existent-image-src.png"
									style="width: 350px"
									v-else>
								 <template v-slot:error>
									 <div class="absolute-full flex flex-center bg-negative text-white">
										 Cannot load image
									 </div>
								 </template>
							 </q-img> -->

								<div v-html="rawHtml.rating" class="flex justify-center q-mt-sm"></div>
							</div>

							<div class="col-sm-12 col-md-6" v-html="rawHtml.movieInfo" align="left"></div>
							
						</div>
				

						<!-- <iframe style="width: 100%; height:100%;overflow: hidden;" :src="`${$store.state.movie.baseUrl}view_movie/${filmVer.id}`"  frameborder="0"></iframe> -->
						<!-- <img src="http://apimovie.corprotec.com/getImagen" alt="imagen"> ok good bien-->
					</q-card-section>
						<q-separator />
					<q-card-actions align="right">
						<q-btn  size="sm"  label="Elegir otra	" color="primary" class="q-mr-xs" @click="()=>{
							swfilm = false
							rawHtml = {}
						}" />
						<q-btn  size="sm"  label="Elgir Esta pelicula" icon="done" color="primary" @click="" />
					</q-card-actions>
				</q-card>
			</q-dialog>
			


			<q-page-sticky position="bottom-right" :offset="[18, 18]">
				<q-btn fab icon="search" color="accent"  @click="dialogSearch = true"/>
			</q-page-sticky>
		</q-page>
	</template>
	<script>
		export default {
			data () {
				return {

					rawHtml:{},
					loadingState:false,
					dialogSearch:false,
					searchText:null,
					resultados:null,
					swfilm:false,
					filmElegido:{},
					filmVer:{},
					form:{
						nombre: null,
						anio: null,
						estado:true,
						sinopsis:null,
						detallestecnicos:null,
						idfilmafinitty:null,
						idimdb:null,
						traileruri:null
					}

				}
			},

			methods: {
				getMovieRawHtml(filmSelec){
					const this_ = this
					this.filmVer = filmSelec
					this.swfilm=true
					// this.loading = true
					this_.$axios.get(`${this_.$store.state.movie.baseUrl}view_movie/${this_.filmVer.id}`)
					.then(r=>{
						this_.rawHtml = r.data
						this_.rawHtml.ratingn = Math.round(this_.rawHtml.ratingn*1)
						// console.log(r.data)

						// this_.loading = false
					})
					.catch(r => {
						// this_.loading = false

						this.$q.notify({
							message: 'Error En El Servidor.',
							position: 'bottom',
							icon:'warning',
							color:'negative'
						})
					})
				},
				onSearch(){
					if(!this.searchText){
						this.$q.notify({
							color: 'red-5',
							textColor: 'white',
							icon: 'warning',
							message: 'Debes introducir un titulo'
						})
						this.searchText = null

					}else{
						this.loadingState = true
						const this_ = this
						let sendFormData = new FormData()
						sendFormData.append('param_busqueda', this.searchText)
						this_.$axios({
							method: 'post',
							url:`${this_.$store.state.movie.baseUrl}search_movie`,
							data:sendFormData,
							config: { headers: {'Content-Type': 'multipart/form-data' }}
						}).then(r => {
							this_.loadingState = false

							if(r.data.resultados){
								this_.resultados = r.data.resultados 

							}else{
								this_.resultados = null
							
							}
					
						}).catch(r => {
							this_.loadingState = false
							this.$q.notify({
								message: 'Error En El Servidor.',
								position: 'top',
								icon:'warning',
								color:'negative'
							})
						})

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

				onReset () {
					this.form = {
						nombre: null,
						anio: null,
						estado:true,
						sinopsis:null,
						detallestecnicos:null,
						idfilmafinitty:null,
						idimdb:null,
						traileruri:null

					}
				}

			}
		}
	</script>
	<style lang="stylus">
		.movie-info dd {
				margin: 8px 5px 8px 105px;
				color: #333333;
				font-size: 14px;
				line-height: 18px;
		}

		.movie-info dt {
				position: absolute;
				width: 90px;
				text-align: right;
				color: #777777;
				margin-top: 1px;
		}

		 #rat-avg-container {
				text-align: center;
				padding-bottom: 10px;
		}

		#movie-rat-avg 
			float left
			font-size:184%
			color #fff
			padding 5px
			background #4682B4
		
		#movie-count-rat
			text-align center
			color #326E9C
			font-size 84%
			padding 6px 5px
			float left
			margin-left 8px;
			font-weight bold
			border 1px solid #4682B4
			background #fff
		
		#country-img
			img
				margin-top -3px
				vertical-align middle
		
		.show-akas {
		    margin-left: 10px;
		    font-size: 12px;
		    color: #888;
		    cursor: pointer;
		    border: 1px solid #DDD;
		    background: #F8F8F8;
		    padding: 0 2px;
		}
		
		.akas > ul {
		    list-style-type: none;
		    margin: 0;
		    padding: 0;
		}
	</style>