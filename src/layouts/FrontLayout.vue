<template>
	<!--  lHh full header-->
	<q-layout view="lHr Lpr lFf" class="MyLayout">
		<q-header elevated>
			<q-toolbar>
				<q-toolbar-title>
					<q-icon name="local_movies"/> MovieTorrent
				</q-toolbar-title>
				<q-btn
					flat
					dense
					round
					@click="drawerRight = !drawerRight"
					aria-label="Menu"
				>
					<q-icon name="menu" />
				</q-btn>

			</q-toolbar>
		</q-header>

		<q-drawer
			side="right"
			v-model="drawerRight"
			bordered
			:width="290"
			:breakpoint="1024"
			content-class="bg-grey-3 overflow-hidden"
			
		>
		<!-- <q-scroll-area  style="height:calc(100% - 110px);margin-top:110px;"> -->

		<q-scroll-area  style="height:calc(100% - 50px);margin-top:50px;">
			<q-separator/>
			<q-list dense>

			<!-- header-class="bg-primary text-white" -->
			<!-- 	expand-icon-class="text-primary" -->
				<q-expansion-item
					icon="bluetooth"
					label="Categorias"
					header-class="text-primary"
				
					default-opened
				>
				<!--  class="bg-orange-2" -->
					<q-card>
						<q-card-section>
				<!-- 			<q-btn class="full-width q-mb-xs" color="white" text label="Peliculas" />
							<q-btn class="full-width q-mb-xs" color="white" text label="Series" /> -->
							<div v-for="categoria in $store.state.movie.categorias" :key="categoria.label">
								<q-btn class="full-width q-mt-xs" :color="$store.state.movie.filtro.categoria==categoria.label?'primary':'white'" :text-color="$store.state.movie.filtro.categoria==categoria.label?'white':'black'" :label="categoria.label" @click="$store.commit('movie/actualizarFiltro', {categoria:categoria.label})"/>
							</div>
							

						</q-card-section>
					</q-card>
				</q-expansion-item>

				<q-separator />
					
			<!-- <q-separator/> -->


					
						<q-expansion-item
							icon="explore"
							label="Género	"
							default-opened
							header-class="text-primary"
						>
<!-- 							<q-card>
								<q-card-section>
									<q-list dense>

									

												 <q-item tag="label" v-ripple  v-for="genero in $store.state.movie.generos" :key="genero.id">
													<q-item-section avatar>
														<q-icon :name="`img:statics/generos/svg/${genero.imagen}`"/>
													</q-item-section>
													 <q-item-section>
														 <q-item-label>{{genero.nombre_es}}</q-item-label>
													 </q-item-section>
													 <q-item-section side >
														
														 <q-radio v-model="$store.state.movie.filtro.idGenero" :val="genero.id" color="teal" @input="(value)=>{
																$store.commit('movie/actualizarFiltro', {idGenero:value})
														 }"/>
													 </q-item-section>
												 </q-item>
									</q-list>
								</q-card-section>
							</q-card> -->

							<q-card>
								<q-card-section>
									<div class="col full-height row items-center">
										<div class="q-date__years-item flex flex-center q-mt-xs" v-for="genero in $store.state.movie.generos" :key="genero.id">
											<q-btn :color="$store.state.movie.filtro.idGenero==genero.id?'primary':'white'" size="sm" :text-color="$store.state.movie.filtro.idGenero==genero.id?'white':'black'" :label="genero.nombre_es" @click="$store.commit('movie/actualizarFiltro', {idGenero:genero.id})"/>
										</div>
									</div>
								</q-card-section>
							</q-card>
						</q-expansion-item>

						<q-separator />

						<q-expansion-item icon="calendar_today" default-opened label="Año" header-class="text-teal">
							<q-card>
								<q-card-section>
									<div class="col full-height row items-center">
										<div class="q-date__years-item flex flex-center q-mt-xs" v-for="index in 20" :key="index">
											<q-btn :color="$store.state.movie.filtro.year==1999+index?'primary':'white'" size="sm" :text-color="$store.state.movie.filtro.year==1999+index?'white':'black'" :label="1999+index" @click="$store.commit('movie/actualizarFiltro', {year:1999+index})"/>
										</div>
									</div>
								</q-card-section>
							</q-card>
						</q-expansion-item>

						<q-separator />

						<q-expansion-item  icon="format_align_center" default-opened label="Inicial" header-class="text-purple">
							<q-card>
								<q-card-section>
									<div class="col full-height row items-center">
										<div class="q-date__years-item flex flex-center q-mt-xs" v-for="index in 26" :key="index">
											<q-btn :color="$store.state.movie.filtro.letra==String.fromCharCode(64+index)?'primary':'white'" size="sm" :text-color="$store.state.movie.filtro.letra==String.fromCharCode(64+index)?'white':'black'" :label="String.fromCharCode(64+index)" @click="$store.commit('movie/actualizarFiltro', {letra:String.fromCharCode(64+index)})"/>
										</div>
									</div>
								</q-card-section>
							</q-card>
						</q-expansion-item>
					</q-list>
					</q-scroll-area>
					<div class="absolute-top bg-white layout-drawer-toolbar">
						<form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">

						<q-input standout="bg-primary text-white" square  class="q-py-none q-my-none" v-model="search" placeholder="Buscar titulo..." style="height: 50px;">	
							<template v-slot:append>
								<q-icon name="search" />
							</template>
						</q-input>
			<q-separator/>

					<!-- 	<div class="row justify-left q-py-sm q-pl-md bg-grey-3">
							<strong>Filtro:</strong> <q-chip removable v-show="txtChip" @remove="$store.commit('movie/actualizarFiltro', {})" color="primary" text-color="white" icon="movie_filter">    {{txtChip}}
							</q-chip>
						</div> -->



		<!-- 				<q-item-label header ><strong>Filtro:</strong> <q-chip removable v-show="txtChip" @remove="resetFilter" color="primary" text-color="white" icon="movie_filter">
				{{txtChip}}
			</q-chip></q-item-label> -->
						
				
					</form></div>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
	name: 'FrontLayout',
	data () {
		return {
			drawerRight: this.$q.platform.is.desktop,
			// estados:[],
			year:2019,
			search:'',
			// radioValue:this.$store.state.movie.filtro.idGenero,
			// indexElegido:null,
			// txtChip:null,
		}
	},
	created(){
		// let keys = Object.keys(this.$store.state.movie.filtro)
		// keys.forEach(key=>{
		// 	let value =  this.$store.state.movie.filtro[key]
		// 	if(value){//la primre valor q no es null
		// 		switch(key){
		// 			case 'idGenero':
		// 				// this.radioValue = value
		// 				this.txtChip = this.$store.state.movie.generos[value].nombre_es
		// 			break;
		// 			case 'year':
		// 				// this.indexElegido = value-1999
		// 				this.txtChip = value
		// 			break;
		// 		}
		// 	 // break
		// 	}
		// })
		
	},
		computed:{
		txtChip(){
			let valReturn =  null
			let keys = Object.keys(this.$store.state.movie.filtro)
			keys.forEach(key=>{
				let value = this.$store.state.movie.filtro[key]
				if(value){//la primre valor q no es null
					switch(key){
						case 'idGenero':
							valReturn =  this.$store.state.movie.generos[value].nombre_es
						break;

						case 'year':
							valReturn = value
						break;

						case 'letra':
							valReturn = value
						break;
					}
				}
			})
			return valReturn	
			
		}
		},
	
	methods: {
		openURL,
		// resetFilter(){
		// 	this.$store.commit('movie/actualizarFiltro', {})
		// 	// this.txtChip = null
		// 	// this.radioValue = null
		// 	// this.indexElegido = null
		// },
	
		// displayStatus(){
		// 	console.log(this.estados)
		// },
		// changeToggle(val){
		// 	this.$store.commit('movie/actualizarGeneros', val)
		// },


		// filterGenero(value){
		// 	this.$store.commit('movie/actualizarFiltro', {idGenero:value})
		// 	// this.indexElegido = null
		// 	// this.txtChip = this.$store.state.movie.generos[value].nombre_es
			
		// },
		// filterYear(index){
		// 	// this.indexElegido = index
		// 	// this.radioValue = null
		// 	this.$store.commit('movie/actualizarFiltro', {year:2000+index-1})
		// 	// this.txtChip = 2000+index-1

		// },
		// filterLetter(index){
		// 	// this.indexElegido = index
		// 	// this.radioValue = null
		// 	this.$store.commit('movie/actualizarFiltro', {letra:String.fromCharCode(64+index)})
		// 	// this.txtChip = 2000+index-1

		// },

		
	}
}
</script>

<style lang="stylus">

.MyLayout
	// .mydrawer
	// 	overflow hidden!important
		
	.q-field__control
		height 50px!important

	
</style>











