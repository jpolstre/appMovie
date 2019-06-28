<template>
	<div id="q-app">
		<router-view />
	</div>
</template>

<script>
export default {
	name: 'App',
	mounted(){

	

		// adds '!' to encodeURIComponent
		~function () {
				var orig = window.encodeURIComponent;
				window.encodeURIComponent = function (str) {
						// calls the original function, and adds your
						// functionality to it
						return orig.call(window, str).replace(/!/g, '%21');
				};
		}();

		if(this.$store.state.movie.categoria.label === 'Series'){
			this.$store.commit('movie/SET_THEME', {
					primary: "#027BE3",
					secondary: "#263238",
					accent: "#333333"
				})
		}else{
				this.$store.commit('movie/SET_THEME', {
				primary: "#ef6c00",
				secondary: "#111111",
				accent: "#333333"
			})
		}


		const self =  this
		this.$store.state.movie.getGeneros.then((resp)=>{
			// console.log(resp)
			// self.generos = resp
			
			self.$store.commit('movie/setGeneros', resp)


		})
	}
}
</script>

<style lang="stylus">

</style>
