<template>
	
	<q-page padding class="q-pr-none bg-secondary text-white">
		
		<q-scroll-area  ref="scrollArea" style="height: calc(100vh - 50px);width: 100%;">
		<h6 class="q-ma-none q-pa-none">	{{$store.state.movie.categoria.label}}</h6 class="q-my-none q-py-none">

		<q-card flat bordered class="q-ma-none q-pa-none bg-secondary text-white" v-if="filtro.length">
			<q-card-section class="q-mb-none q-pb-none">
				<div class="row items-center no-wrap">
					<div class="col">
						<!-- <div class="text-h6">Filtros</div> -->
						<div class="text-subtitle3">Filtros</div>
					</div>
					<div class="col-auto">
						<q-btn class="animate-pop" color="grey-7" round flat icon="delete_forever" @click="resetFilter"/>
					</div>
				</div>
			</q-card-section>
			<q-card-section>
				<q-chip v-for="item in filtro" :key="item.txt" class="animate-pop"  outline removable v-show="item.icon" @remove="delFilter(item)" color="primary" text-color="white" >    
					<q-icon :name="item.icon"  class="text-primary" style="font-size: 1.4em;"/>&nbsp;&nbsp;{{item.txt}}
				</q-chip>
			</q-card-section>
		</q-card>
		<q-separator color="primary"/>

		<!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
		<!-- {{$store.state.movie.filtro}} -->
		{{data}}
		<div class="q-pa-lg flex flex-center">
			<q-pagination
				v-model="pagination.page"
				color="primary"
				:max="Math.ceil(pagination.rowsNumber/pagination.rowsPerPage)"
				:max-pages="pagination.rowsPerPage"
				:boundary-numbers="true"
				@input="onPaginate"
			>
			</q-pagination>
		</div>

		</q-scroll-area>

		<q-page-sticky v-show="showFabUp()" position="bottom-right" :offset="[18, 18]">
			<q-btn fab icon="add" color="accent" />
		</q-page-sticky>

	</q-page>
 
</template>
<script>
export default {
	name: 'PageIndex',

		data(){
		return{
			// current: 5,
			data: [],
			filter: '',
			// loading: false,
			pagination: {
				sortBy: 'title',
				descending: false,
				page: 1,
				rowsPerPage:10,//0 all
				rowsNumber: 10
			},

		}
	},

	created(){
		this.onRequest({
			pagination: this.pagination,
			filter: ''
		})
	},

	computed:{

		filtro(){
			let valReturn, arrReturn = []
			let keys = Object.keys(this.$store.state.movie.filtro)
			keys.forEach(key=>{
				let value = this.$store.state.movie.filtro[key]
				if(value){//la primre valor q no es null
					switch(key){
						case 'idGenero':
							// valReturn =  {key:key, txt:this.$store.state.movie.generos[value].nombre_es, icon:`img:statics/generos/svg/${this.$store.state.movie.generos[value].imagen}`}
							valReturn =  {key:key, txt:this.$store.state.movie.generos[value].name, icon:`bookmark`}

						break;
						case 'year':
							valReturn = {key:key, txt:value, icon:'calendar_today'}
						break;
						case 'letra':
							valReturn = {key:key, txt:value, icon:'format_align_center'}
						break;
						// case 'categoria':
						// 	valReturn = {key:key, txt:value, icon:'movie_filter'}
						// break;
					}

					arrReturn.push(valReturn)

				}
			})
			return arrReturn
		}

	},

	methods:{
		showFabUp(){
			if(!this.$refs.scrollArea){
				return false
			}else{
				if(this.$refs.scrollArea.getScrollPosition()>100){
					return true
				}
				return false
			}
			
		},
		onPaginate(value){
			// if(this.pagination.page !== value){
			// 	console.log(value)

			// }

			this.onRequest({
				pagination: this.pagination,
				filter: ''
			})
		},

		onRequest (props) {
			this.$q.loading.show()
			let { page, rowsPerPage, rowsNumber, sortBy, descending } = props.pagination
			let filter
			const self =  this

			if(props.filter == ''){
				filter = undefined
			}else{ 
				filter = props.filter
			}
		

				filter = encodeURIComponent(filter)
				this.$axios.get(`${self.$store.state.movie.baseUrl}getRowsNumberCount/pelicula/${filter}/title__original_title`)
				.then(r=>{
					self.pagination.rowsNumber = r.data.length
					// get all rows if "All" (0) is selected
					let fetchCount = rowsPerPage === 0 ? 	self.pagination.rowsNumber : rowsPerPage//

					// calculate starting row of data
					let startRow = (page - 1) * rowsPerPage

					// fetch data from "server"
				
					// fetchFromServer($tabla, $startRow, $count, $sortBy, $direction, $filter, $fieldsFilter)

					// let returnedData = this.fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

					self.$axios.get(`${self.$store.state.movie.baseUrl}fetchFromServer/pelicula/${startRow}/${fetchCount}/${sortBy}/${descending}/${filter}/title__original_title`)
					.then(r=>{

						let returnedData = r.data.results
						// clear out existing data and add new
						self.data.splice(0, self.data.length, ...returnedData)

						// don't forget to update local pagination object
						self.pagination.page = page
						self.pagination.rowsPerPage = rowsPerPage
						self.pagination.sortBy = sortBy
						self.pagination.descending = descending

						// ...and turn of loading indicator
						self.$q.loading.hide()
						self.$refs.scrollArea.setScrollPosition(0, 200)
		
					})
					.catch(r => {
						self.$q.loading.hide()
						self.$q.notify({
						message: 'Error En El Servidor.',
						position: 'bottom',
						icon:'warning',
						color:'negative'
						})
					})

				})
				.catch(r => {
					self.$q.loading.hide()
					self.$q.notify({
					message: 'Error En El Servidor.',
					position: 'bottom',
					icon:'warning',
					color:'negative'
					})
				})
		},
		delFilter(item){
			let obj = {}
			obj[item.key] = null
			this.$store.commit('movie/actualizarFiltro', obj)
		},
		resetFilter(){
			let keys = Object.keys(this.$store.state.movie.filtro)
			keys.forEach(key=>{
				let obj = {}
				obj[key] = null
				this.$store.commit('movie/actualizarFiltro', obj)
			})
		}

	}
}
</script>
<style lang="stylus" >
	@import 'quasar.variables'
	$primary = $red
</style>
