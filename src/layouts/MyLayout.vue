<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar>
				<q-toolbar-title>
					<q-icon name="local_movies"/> MovieApp
				</q-toolbar-title>
				<q-btn
					flat
					dense
					round
					@click="drawerRight = !drawerRight"
					aria-label="Menu"
				>
					<q-icon name="menu" />
				</q-btn>

			</q-toolbar>
		</q-header>

		<q-drawer
			side="right"
			v-model="drawerRight"
			bordered
			:width="300"
			:breakpoint="500"
			content-class="bg-grey-3"
			 show-if-above
		>
		<q-scroll-area class="fit">
			<q-list dense>
					<q-item-label header>Filtrar</q-item-label>
						<q-expansion-item
							group="somegroup"
							icon="explore"
							label="Género	"
							default-opened
							header-class="text-primary"
						>
							<q-card>
								<q-card-section>
									<q-list dense>

										<!-- <q-item-label header @click="displayStatus">Notifications</q-item-label> -->

										     <q-item tag="label" v-ripple  v-for="genero in $store.state.movie.generos" :key="genero.id">
										     	<q-item-section avatar>
										     		<q-icon :name="`img:statics/generos/${genero.imagen}`"/>

										     	</q-item-section>
										       <q-item-section>
										         <q-item-label>{{genero.nombre_es}}</q-item-label>
										       </q-item-section>
										       <q-item-section side >
										         <q-toggle color="blue" v-model="estados" :val="genero.id" @input="changeToggle"/>
										       </q-item-section>
										     </q-item>

										   

									<!-- 	<q-item tag="label" v-ripple   v-for="genero in $store.state.movie.generos" :key="genero.id">
												<q-item-section avatar>
													<q-icon :name="`img:statics/generos/${genero.imagen}`" />

												</q-item-section>
										        <q-item-section>
										          <q-item-label>{{genero.nombre_es}}</q-item-label>
										        </q-item-section>
										        <q-item-section side >
										          <q-toggle color="blue" v-model="estados[genero.id]" val="battery" />
										        </q-item-section>
										      </q-item>
				 -->
			


										<!-- <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
											<q-item-section avatar>
												<q-icon name="school" />
											</q-item-section>
											<q-item-section>
												<q-item-label>Docs</q-item-label>
												<q-item-label caption>quasar.dev</q-item-label>
											</q-item-section>
										</q-item> -->
										
									</q-list>
								</q-card-section>
							</q-card>
						</q-expansion-item>

						<q-separator />

						<q-expansion-item group="somegroup" icon="perm_identity" label="Second" header-class="text-teal">
							<q-card>
								<q-card-section>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
									commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
									eveniet doloribus ullam aliquid.
								</q-card-section>
							</q-card>
						</q-expansion-item>

						<q-separator />

						<q-expansion-item group="somegroup" icon="shopping_cart" label="Third" header-class="text-purple">
							<q-card>
								<q-card-section>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
									commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
									eveniet doloribus ullam aliquid.
								</q-card-section>
							</q-card>
						</q-expansion-item>

						<q-separator />

						<q-expansion-item
							group="somegroup"
							icon="bluetooth"
							label="Fourth"
							header-class="bg-teal text-white"
							expand-icon-class="text-white"
						>
							<q-card class="bg-teal-2">
								<q-card-section>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
									commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
									eveniet doloribus ullam aliquid.
								</q-card-section>
							</q-card>
						</q-expansion-item>
					</q-list>
					</q-scroll-area>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
	name: 'MyLayout',
	data () {
		return {
			drawerRight: this.$q.platform.is.desktop,
			estados:[],
		}
	},
	created(){
		// console.log(this.$store.state.movie.generos)
		for (let prop in this.$store.state.movie.generos) {

		  if(this.$store.state.movie.generos[prop].estado){
		  	this.estados.push(this.$store.state.movie.generos[prop].id)
		  }
		}
	
		console.log(this.estados)
	},
	methods: {
		openURL,
	
		displayStatus(){
			console.log(this.estados)
		},
		changeToggle(val){
			// set defaul change generos
			// console.log(val)//val = estados manda. los true
			this.$store.commit('movie/actualizarGeneros', val)

		}
	}
}
</script>

<style>
</style>











