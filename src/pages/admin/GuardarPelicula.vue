<template>
	<q-page padding>
		<!--  style="height:calc(100vh - 170px);" class="scroll" -->
				<q-card-section>
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
								resultados=[]
							 }" class="cursor-pointer" />
						 </template>
						</q-input>
					</q-form>
					<q-infinite-scroll @load="onLoad" :offset="250"  v-if="resultados.length">
					<div>
							<q-list bordered separator>
							<q-item-label header>{{totalResults}} resultados (elije uno):</q-item-label>
							<q-item v-for="resultado, index in resultados" :key="index">
								<q-item-section top avatar>
									<q-avatar rounded>
										{{index}}
										<img :src="`${$store.state.movie.baseTmdbImages}w342/${resultado.poster_path}`" v-if="resultado.poster_path">
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
		<!-- 		<q-card-actions align="right">
					<q-btn flat label="Cerrar" icon="close" color="primary" v-close-popup />
					<q-btn flat label="Accept" color="primary" v-close-popup />
				</q-card-actions> -->
			</q-card>
	</q-page>
</template>
<script>


	export default{
		data(){
			return{
				searchText:null,
				loadingState:false,
				resultados:[], 
				totalPages:0,
				totalResults:0,
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