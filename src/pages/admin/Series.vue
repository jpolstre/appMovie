<template>
	 <q-page padding  class="q-mt-none q-pt-none">

		<!-- <h6 class="q-my-xs q-pt-none">Peliculas</h6> -->
		<!-- <q-btn color="primary" icon="thumb_up" label="test" class="animate-pop"/> -->

				<q-breadcrumbs class="q-my-sm">
					<!-- <q-breadcrumbs-el icon="home" to="/admin" /> -->
					<q-breadcrumbs-el label="Series" to="/admin/series" class="active-breadcrumb"/>
				<!--   <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" to="/vue-components/breadcrumbs" />
					<q-breadcrumbs-el label="Build" icon="build" /> -->
				</q-breadcrumbs>

		<q-table
			title="Treats"
			:data="data"
			:columns="columns"
			row-key="id"
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

			<template v-slot:top>
				<q-btn class=" animate-pop" round	 dense color="primary" :disable="loading" icon="add" @click="$router.push({ name:'GuardarSerie' })" />
				<!-- @click="removeRow" -->
				<div v-if="selected.length">
					<q-btn class="on-right animate-pop" round	 dense color="primary" :disable="loading" icon="edit" @click="$router.push({ name: 'GuardarSerie', params: { serie:selected[0]}})"/>
					<q-btn class="on-right animate-pop" round dense color="primary" :disable="loading" icon="delete_forever" />
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

				<template v-slot:body-cell-detalles_tecnicos="props">
					<span v-html="props.row.detalles_tecnicos"></span>
				</template>

				<template v-slot:body-cell-poster_path="props">
					<td >
						<q-img
						class="q-card"
							:src="`${$store.state.movie.baseTmdbImages}w342/${props.row.poster_path}`"
							style=" height:  100%;with:  100%; "
							
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
	</q-page>
</template>

<script>
export default {
	data () {
		return {
			selected: [],
			filter: '',
			loading: false,
			pagination: {
				sortBy: 'name',
				descending: false,
				page: 1,
				rowsPerPage:3,
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
				{ name: 'name', align: 'left',label: 'Name', field: 'name', sortable: true },
				{ name: 'original_name',align: 'left', label: 'Original_name', field: 'original_name', sortable: true },
				{ name: 'first_air_date', align: 'left',label: 'First_air_date', field: 'first_air_date', sortable: true },
				{ name: 'temporadas_disponibles',align: 'left', label: 'Temporadas_disponibles', field: 'temporadas_disponibles', sortable: true },

				//  sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
				{ name: 'original_language', align: 'left',label: 'Original_language', field: 'original_language', sortable: true },
				{ name: 'origin_country', align: 'left',label: 'Origin_country', field: 'origin_country', sortable: true },
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
	mounted () {
		// get initial data from server (1st page)
		this.onRequest({
			pagination: this.pagination,
			filter: ''
		})
	},
	methods: {
		getSelectedString () {
			 return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`
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
		

			// emulate server
			// setTimeout(() => {
				// update rowsCount with appropriate value
				// this.pagination.rowsNumber = this.getRowsNumberCount(filter)
				// getRowsNumberCount($tabla, $filter, $fieldsFilter) 
				filter = encodeURIComponent(filter)
				this.$axios.get(`${self.$store.state.movie.baseUrl}getRowsNumberCount/serie/${filter}/name__original_name`)
				.then(r=>{
					self.pagination.rowsNumber = r.data.length
					// get all rows if "All" (0) is selected
					let fetchCount = rowsPerPage === 0 ? 	self.pagination.rowsNumber : rowsPerPage

					// calculate starting row of data
					let startRow = (page - 1) * rowsPerPage

					// fetch data from "server"
				
					// fetchFromServer($tabla, $startRow, $count, $sortBy, $direction, $filter, $fieldsFilter)

					// let returnedData = this.fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

					self.$axios.get(`${self.$store.state.movie.baseUrl}fetchFromServer/serie/${startRow}/${fetchCount}/${sortBy}/${descending}/${filter}/name__original_name`)
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
			
			// }, 1500)
		},

		// emulate ajax call
		// SELECT * FROM ... WHERE...LIMIT...
		fetchFromServer (startRow, count, filter, sortBy, descending) {
			let data = []

			if (!filter) {
				data = this.original.slice(startRow, startRow + count)
			}
			else {
				let found = 0
				for (let index = startRow, items = 0; index < this.original.length && items < count; ++index) {
					let row = this.original[index]
					// match filter?
					if (!row['name'].includes(filter)) {
						// get a different row, until one is found
						continue
					}
					++found
					if (found >= startRow) {
						data.push(row)
						++items
					}
				}
			}

			// handle sortBy
			if (sortBy) {
				data.sort((a, b) => {
					let x = descending ? b : a
					let y = descending ? a : b
					if (sortBy === 'desc') {
						// string sort
						return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
					}
					else {
						// numeric sort
						return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
					}
				})
			}

			return data
		},

		// emulate 'SELECT count(*) FROM ...WHERE...'
		getRowsNumberCount (filter) {
			if (!filter) {
				return this.original.length
			}
			let count = 0
			this.original.forEach((treat) => {
				if (treat['name'].includes(filter)) {
					++count
				}
			})
			return count
		}
	}
}
</script>
<style lang="stylus">
.my-sticky-header-column-table
  /*
    specifying max-width so the example can
    highlight the sticky column on any browser window
  */
  // max-width 600px

  /* max height is important */
  .q-table__middle
    max-height 500px

  .q-table__top,
  .q-table__bottom,
  tr:first-child th, /* bg color is important for th; just specify one */
  td:first-child /* bg color is important for td; just specify one */
    background-color #fff

  tr:first-child th
    position sticky
    top 0
    opacity 1 /* opacity is important */
    z-index 2 /* higher than z-index for td below */

  tr:first-child th:first-child
    z-index 3 /* highest z-index */

  td:first-child
    z-index 1

  td:first-child, th:first-child
    position sticky
    left 0
  
</style>