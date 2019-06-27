<template>
	
	<q-page padding>
		<q-card flat bordered class="q-ma-none q-pa-none" v-if="filtro.length">





			<q-card-section class="q-mb-none q-pb-none">

				<div class="row items-center no-wrap">
									<div class="col">
										<!-- <div class="text-h6">Filtros</div> -->
										<div class="text-subtitle2">Filtros</div>
									</div>

									<div class="col-auto">
										<q-btn class="animate-pop" color="grey-7" round flat icon="delete_forever" @click="resetFilter"/>
									</div>
				</div>
						
			</q-card-section>
				 <q-card-section>
					
				 
			<q-chip v-for="item in filtro" :key="item.txt" class="animate-pop"  outline removable v-show="item.icon" @remove="delFilter(item)" color="primary" text-color="white" >    
				<q-icon :name="item.icon" style="color: #000; font-size: 1.4em;"/>&nbsp;&nbsp;{{item.txt}}
			</q-chip>
			</q-card-section>
		</q-card>
	<!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
	<!-- {{$store.state.movie.filtro}} -->
	</q-page>
</template>

<style>
</style>s

<script>
export default {
	name: 'PageIndex',

		data(){
		return{
			
		}
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
						case 'categoria':
							valReturn = {key:key, txt:value, icon:'movie_filter'}
						break;
					}

					arrReturn.push(valReturn)

				}
			})
			return arrReturn
		}

	},
	methods:{
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
