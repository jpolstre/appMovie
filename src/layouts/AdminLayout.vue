<template>
	<div class="q-pa-none q-ma-none">
		<q-layout view="hHh Lpr lff"  >
			<q-header elevated class="bg-black">
				<q-toolbar>
					<q-btn flat round dense icon="menu" @click="drawer = !drawer" class="q-mr-sm" />
					<q-separator dark vertical inset />
					<q-btn stretch flat label="AdminMovie" class="animate-pop"/>
					<q-space />

					<q-btn-dropdown stretch flat label="Jpolstre" icon="person">
					 <q-list>
						 <!-- <q-item-label header>Folders</q-item-label> -->
						 <q-item clickable v-close-popup tabindex="0">
							 <q-item-section avatar>
								 <q-avatar icon="account_box" color="primary" text-color="white" />
							 </q-item-section>
							 <q-item-section>
								 <q-item-label>Opciones</q-item-label>
								 
							 </q-item-section>
							 <q-item-section side>
								 <!-- <q-icon name="info" /> -->
							 </q-item-section>
						 </q-item>
						 <!-- <q-separator inset spaced /> -->
							 <q-item clickable v-close-popup tabindex="0">
								 <q-item-section avatar>
									 <q-avatar icon="exit_to_app" color="primary" text-color="white" />
								 </q-item-section>
								 <q-item-section>
									 <q-item-label>Salir</q-item-label>
									 
								 </q-item-section>
								 <q-item-section side>
									 <!-- <q-icon name="info" /> -->
								 </q-item-section>
							 </q-item>
					 </q-list>
					</q-btn-dropdown>

				</q-toolbar>
			</q-header>

			<q-drawer
				v-model="drawer"
				:width="200"
				:breakpoint="500"
				show-if-above
				bordered
				content-class="bg-grey-3"
			>
				<q-scroll-area class="fit">
					<q-list v-for="(menuItem, index) in menuList" :key="index">


						<q-item clickable :active="menuItem.label === activeItem" :to="`/admin/${menuItem.label}`" @click="activeItem = menuItem.label" v-ripple>
							<q-item-section avatar>
								<q-icon :name="menuItem.icon" />
							</q-item-section>
							<q-item-section>
								{{ menuItem.label }}
							</q-item-section>
						</q-item>

					 <q-separator v-if="menuItem.separator" />

					</q-list>
				</q-scroll-area>
			</q-drawer>

		
		<q-page-container>
			<!-- @leave="resetScroll"-->
			<transition
				enter-active-class="animated fadeIn"
				leave-active-class="animated fadeOut"
				mode="out-in"
				:duration="100" 
				
			>
				<q-scroll-area style="height: calc(100vh - 230px); max-width: 100%;">
					<router-view />

				</q-scroll-area>
								
			</transition>
			
		</q-page-container>
		</q-layout>
	</div>
</template>
<script>
const menuList = [
	{
		icon: 'movie',
		label: 'peliculas',
		separator: true
	},
	{
		icon: 'movie_filter',
		label: 'generos',
		separator: true
	},
	{
		icon: '4k',
		label: 'calidades',
		separator: true
	},
	// {
	// 	icon: 'error',
	// 	label: 'Spam',
	// 	separator: true
	// },
	// {
	// 	icon: 'settings',
	// 	label: 'Settings',
	// 	separator: false
	// },
	// {
	// 	icon: 'feedback',
	// 	label: 'Send Feedback',
	// 	separator: false
	// },
	// {
	// 	icon: 'help',
	// 	iconColor: 'primary',
	// 	label: 'Help',
	// 	separator: false
	// }
]

export default {
	name: 'AdminLayout',

	data () {
		return {
			drawer: true,
			menuList,
			activeItem:'peliculas'
		}
	}
}
</script>
<style lang="stylus">
	.q-item--active
		background-color #d9d9d9	
</style>