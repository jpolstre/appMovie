<template>
	<div id="q-app">
		<router-view />
	</div>
</template>

<script>
export default {
	name: 'App',
	created(){
		// adds '!' to encodeURIComponent
		~function () {
				var orig = window.encodeURIComponent;
				window.encodeURIComponent = function (str) {
						// calls the original function, and adds your
						// functionality to it
						return orig.call(window, str).replace(/!/g, '%21');
				};
		}();


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
