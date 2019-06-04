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
			}" @show="()=>{

				$refs.inputSearch.focus()
			}">
				<q-card style="width: 700px; max-width: 80vw;">
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
							         <q-icon name="cancel" @click.stop="searchText = null" class="cursor-pointer" />
							       </template>
							</q-input>
						</q-form>
						
						<div class="padding">
							<p class="caption q-mt-md">15 resultados(elije uno):</p>
							<q-card v-for="n in 15" :key="n" class="q-mt-xs">
								<q-card-section>
									<a href="#" >Titulo n</a>
								</q-card-section>	
							</q-card>

						</div>
							
					</q-card-section>

					<q-separator />

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
		export default {
			data () {
				return {
					loadingState:false,
					dialogSearch:false,
					searchText:null,
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