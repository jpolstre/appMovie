
const routes = [
/*FRONT*/
	{
		path: '/',
		component: () => import('layouts/FrontLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/Index.vue') }
		]
	},
	/*BACK*/

	{
		path: '/admin',
		component: () => import('pages/admin/Login.vue'),
		children: [
			{ path: '', name:'Login', component: () => import('pages/admin/Login.vue') }
		]
	},
	{
		path: '/admin/peliculas',
		component: () => import('layouts/AdminLayout.vue'),
		children: [
			{ path: '', name:'Peliculas', component: () => import('pages/admin/Peliculas.vue') }
		]
	},
	{
		path: '/admin/peliculas/guardar',
		component: () => import('layouts/AdminLayout.vue'),
		children: [
			{ path: '', name:'GuardarPelicula', component: () => import('pages/admin/GuardarPelicula.vue') }
		]
	},

	{
		path: '/admin/generos',
		component: () => import('layouts/AdminLayout.vue'),
		children: [
			{ path: '', name:'Generos', component: () => import('pages/admin/Generos.vue') }
		]
	},
	{
		path: '/admin/calidades',
		component: () => import('layouts/AdminLayout.vue'),
		children: [
			{ path: '', name:'Calidades', component: () => import('pages/admin/Calidades.vue') }
		]
	},
	
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
	routes.push({
		path: '*',
		component: () => import('pages/Error404.vue')
	})
}

export default routes
