<template>
  <q-page padding>
	 <q-chip removable v-show="filtro" @remove="$store.commit('movie/actualizarFiltro', {})" color="primary" text-color="white" icon="movie_filter">    {{filtro}}
								</q-chip>
	<!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
	{{$store.state.movie.filtro}}
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',

  data(){
	return{
		
	}
  },
  computed:{
	filtro(){
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
				}
			}
		})
		return valReturn	
		
	}
  }
}
</script>
