<template>
  <q-page padding>
	 <q-chip outline removable v-show="filtro.icon" @remove="$store.commit('movie/actualizarFiltro', {})" color="primary" text-color="white" >    
	 		<q-icon :name="filtro.icon" style="color: #000; font-size: 1.4em;"/>&nbsp;&nbsp;{{filtro.txt}}
	 		
		</q-chip>
	<!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
	<!-- {{$store.state.movie.filtro}} -->
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
		let valReturn =  {}
		let keys = Object.keys(this.$store.state.movie.filtro)
		keys.forEach(key=>{
			let value = this.$store.state.movie.filtro[key]
			if(value){//la primre valor q no es null
				switch(key){
					case 'idGenero':
						valReturn =  {txt:this.$store.state.movie.generos[value].nombre_es, icon:`img:statics/generos/svg/${this.$store.state.movie.generos[value].imagen}`}
					break;
					case 'year':
						valReturn = {txt:value, icon:'calendar_today'}
					break;
				}
			}
		})
		return valReturn	
		
	}
  }
}
</script>
