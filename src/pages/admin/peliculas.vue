<template>
	 <q-page padding  class="q-mt-none q-pt-none">

		<!-- <h6 class="q-my-xs q-pt-none">Peliculas</h6> -->
		<!-- <q-btn color="primary" icon="thumb_up" label="test" class="animate-pop"/> -->

				<q-breadcrumbs class="q-my-sm">
					<!-- <q-breadcrumbs-el icon="home" to="/admin" /> -->
					<q-breadcrumbs-el label="Peliculas" to="/admin/peliculas" class="active-breadcrumb"/>
				<!--   <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" to="/vue-components/breadcrumbs" />
					<q-breadcrumbs-el label="Build" icon="build" /> -->
				</q-breadcrumbs>


				<!-- 
					color="primary"
			card-class="bg-primary text-white"
			table-class="text-white"
			table-header-class="text-white"
				 -->

		<q-table
			

			title="Treats"
			:data="data"
			:columns="columns"
			row-key="id"
			dense
			
			class="my-sticky-header-column-table"

			:selected-rows-label="getSelectedString"
			 selection="multiple"
			 :selected.sync="selected"

			:pagination.sync="pagination"
			:loading="loading"
			:filter="filter"
			@request="onRequest"
			binary-state-sort
		
			
		>
	<!-- 		<template v-slot:top-right>
				<q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template> -->

			<template v-slot:top >
				<div>
					<q-btn class=" animate-pop"  size="xs" color="primary" :disable="loading" icon="add" @click="$router.push({ name:'GuardarPelicula' })">
						
					</q-btn>
				</div>
				
				<!-- @click="removeRow" -->
				<div v-if="selected.length">
					<q-btn class="on-right animate-pop" size="xs" color="primary" :disable="loading" icon="edit" @click="$router.push({ name: 'GuardarPelicula', params: { pelicula:selected[0]}})"></q-btn>
					<q-btn class="on-right animate-pop" size="xs" color="red-5" :disable="loading" icon="delete_forever" @click="deletePelicula(selected[0])"></q-btn>
				</div>
				<q-space/>
				<q-input borderless dense debounce="300" color="primary" v-model.trim="filter">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>

<!-- 			<template v-slot:body="props">
			<q-tr :props="props">
				<q-td v-for="column in columns" :key="column.name" :props="props">
					<span v-swich>{{props.row[column.name]}}</span>		
				</q-td>
			</q-tr>
				</template> -->

				<template v-slot:body-cell-genre_ids="props">
					<td>
						<q-chip clickable dense icon="bookmark" v-for="genre_id in props.row.genre_ids.split(',')" :key="genre_id">
							<!-- {{getGenero(genre_id)}} -->
							{{generos[genre_id].name}}
						</q-chip>
					</td>
				</template>


				<template v-slot:body-cell-detalles_tecnicos="props">
					<td>{{props.row.detalles_tecnicos.slice(0,50)+'...'}}</td>
				</template>

				<template v-slot:body-cell-poster_path="props">
					<td >
						<q-img
						class="q-card"
							:src="`${$store.state.movie.baseTmdbImages}w342/${props.row.poster_path}`"
							style=" height:  100%; width:  50%; "
							
							basic
							spinner-color="black"
							>
						<!-- 	<div class="absolute-bottom text-center text-body">
								{{index+1}}
							</div> -->
						</q-img>
					</td>
				</template>
		</q-table>

		<q-page-scroller position="bottom-left" :scroll-offset="150" :offset="[18, 18]">
			<q-btn round glossy icon="keyboard_arrow_up" color="primary" />
		</q-page-scroller>
	</q-page>
</template>

<script>
export default {
	data () {
		return {
			generos:{},

			selected: [],
			filter: '',
			loading: false,
			pagination: {
				sortBy: 'title',
				descending: false,
				page: 1,
				rowsPerPage:0,
				rowsNumber: 10
			},
			columns: [
				// {
				// 	name: 'desc',
				// 	required: true,
				// 	label: 'Dessert (100g serving)',
				// 	align: 'left',
				// 	field: row => row.name,
				// 	format: val => `${val}`,
				// 	sortable: true
				// },
				{ name: 'poster_path', align: 'left', label: 'poster_path', field: 'Poster_path', sortable: false },

				{ name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
				{ name: 'title', align: 'left',label: 'Title', field: 'title', sortable: true },
				{ name: 'original_title',align: 'left', label: 'Original_title', field: 'original_title', sortable: true },
				{ name: 'release_date', align: 'left',label: 'Release_date', field: 'release_date', sortable: true },
				

				//  sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
				{ name: 'original_language', align: 'left',label: 'Original_language', field: 'original_language', sortable: true },
				
				{ name: 'genre_ids', align: 'left',label: 'Genre_ids', field: 'genre_ids', sortable: true },
				{ name: 'overview',align: 'left', label: 'Overview', field: row => row.overview.slice(0, 55)+'...', sortable: true },
				{ name: 'vote_average', align: 'left',label: 'Vote_average', field: 'vote_average', sortable: true },
				{ name: 'vote_count', align: 'left',label: 'Vote_count', field: 'vote_count', sortable: true },
				{ name: 'popularity', align: 'left',label: 'popularity', field: 'popularity', sortable: true },
				{ name: 'estado', align: 'left',label: 'Estado', field: 'estado', sortable: true },
		
				{ name: 'url',align: 'left', label: 'Url', field: 'url', sortable: true },
				{ name: 'detalles_tecnicos', align: 'left',label: 'Detalles_tecnicos', field: 'detalles_tecnicos', sortable: true },
			],
			data: [],

		}
	},
	created () {
		const self =  this
		this.$store.state.movie.generos.then((resp)=>{
			// console.log(resp)
			self.generos = resp
			console.log(self.generos)
				self.onRequest({
			pagination: self.pagination,
			filter: ''
		})

		})
		

	
		// get initial data from server (1st page)

/*		const self =  this
		this.$axios.get(`${self.$store.state.movie.baseTmdb}genre/movie/list?api_key=${self.$store.state.movie.keyTmdb}&language=es-ES`)
		.then(r=>{
		
			self.generos = r.data.genres
		
			self.onRequest({
				pagination: this.pagination,
				filter: ''
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
		*/
	},
	methods: {
		// getGenero(id){
		// 	for(let i=0;i<this.generos.length;i++){
		// 		if(this.generos[i].id==id){
		// 			return this.generos[i].name
		// 		}
		// 	}
		// },


		deletePelicula(item){

			this.$q.dialog({
				dark: true,
				title: 'Confirmar Eliminar Pelicula',
				message: `Seguro eliminar ${item.title} ?`,
				cancel: true,
				persistent: true
			}).onOk(() => {
				const self =  this
				self.$axios.get(`${self.$store.state.movie.baseUrl}deletemv/pelicula/${item.id}`)
				.then(r=>{
					self.$q.notify({
						message: r.data.msg,
						position: 'bottom',
						icon:'thumb_up',
						color:'green-5'
					})
					self.onRequest({
						pagination: self.pagination,
						filter: ''
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
			})
			
		},
		getSelectedString () {
			 return this.selected.length === 0 ? '' : `${this.selected.length} registro${this.selected.length > 1 ? 's' : ''} seleccionado${this.selected.length > 1 ? 's' : ''} de ${this.data.length}`
		 },
		onRequest (props) {
			this.loading = true
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
					let fetchCount = rowsPerPage === 0 ? 	self.pagination.rowsNumber : rowsPerPage

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
						self.loading = false
		
					})
					.catch(r => {
						self.loading = false
						self.$q.notify({
						message: 'Error En El Servidor.',
						position: 'bottom',
						icon:'warning',
						color:'negative'
						})
					})

				})
				.catch(r => {
					self.loading = false
					self.$q.notify({
					message: 'Error En El Servidor.',
					position: 'bottom',
					icon:'warning',
					color:'negative'
					})
				})
		},

	}
}
</script>
<style lang="stylus">

</style>