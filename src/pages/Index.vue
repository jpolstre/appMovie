<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
    {{$store.state.movie.generos}}
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
  }
}
</script>
