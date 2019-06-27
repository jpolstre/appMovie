

import axios from 'axios'


// const  url = 'http://localhost/apimovie/'

function getGenerosPeliculas() {
	return axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=8bd1f0324e19b04b41ed5c8d182ca1ce&language=es-ES`);
}

function getGenerosSeries() {
	return axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=8bd1f0324e19b04b41ed5c8d182ca1ce&language=es-ES`);
}


// async y await  es para construir promesas, en este caso getGeneros es una promesa
async function getGeneros(){
	// const res = await axios('/data');
	// return await res.json();

	const res = await axios.all([getGenerosPeliculas(), getGenerosSeries()])
	// console.log(res)//ok

	var arr = res[0].data.genres.concat(res[1].data.genres), len = arr.length, array3=[];
	let obj = {}
	while (len--) {
		var itm = arr[len];
		if (array3.indexOf(itm) === -1) {
			array3.unshift(itm);
			obj[itm.id]=itm
		}
	}
	// console.log(obj)
	return obj
	// return res//ok
		// .then(axios.spread(function (acct, perms) {
		// 	// Both requests are now complete
		// }));
}



export default {
	namespaced: true,
 //estados
	state: {
		getGeneros:getGeneros(),
		generos:{},
		keyTmdb: '8bd1f0324e19b04b41ed5c8d182ca1ce',
		baseTmdb: 'https://api.themoviedb.org/3/',
		baseTmdbImages: 'https://image.tmdb.org/t/p/',
		baseUrl:'https://apimovie.corprotec.com/',


		rememberLogin:{name:'', pass:'', tipo:''},
		
		filtro:{categoria:null, idGenero:null, year:null, titulo:null, letra:null, idCalidad:null, director:null, reparto:null },

		paginaMeta: {},
		usuario:{
			nombre:null,
			perfil:{
				modulos:[]
			},
			id:null,
			autorizacion:false,
			imagen:false,
		},
		estadoConeccion:null,
		
		//obtener por ajaxa (axios)
		calidad:[
			{
				id:0,
				estado:1,
				nombre:'netflix'

			},
			
			{
				id:1,
				estado:1,
				nombre:'4K'
			},
			{
				id:1,
				estado:1,
				nombre:'1080p'
			},
			{
				id:1,
				estado:1,
				nombre:'3d'
			},
			{
				id:1,
				estado:1,
				nombre:'720p'
			},
			{
				id:1,
				estado:1,
				nombre:'bluray'
			},
			{
				id:1,
				estado:1,
				nombre:'dvdrip'
			},
			{
				id:1,
				estado:1,
				nombre:'fullhd'
			},
			{
				id:1,
				estado:1,
				nombre:'webdl'
			}
		],


	/*	generos:{
			1:{
				id:1,
				nombre_es:'Accion',
				nombre_en:'',
				imagen:'action-512.svg',
				estado:false,
			},
			2:{
				id:2,
				nombre_es:'Animacion',
				nombre_en:'',
				imagen:'fantasy-512.svg',
				estado:false,
			},
			3:{
				id:3,
				nombre_es:'Aventura',
				nombre_en:'',
				imagen:'adventures-512.svg',
				estado:false,
			},
			4:{
				id:4,
				nombre_es:'Ciencia Ficcion',
				nombre_en:'',
				imagen:'sci-fi-512.svg',
				estado:false,
			},
			5:{
				id:5,
				nombre_es:'Crimen',
				nombre_en:'',
				imagen:'crime-512.svg',
				estado:false,
			},
			6:{
				id:6,
				nombre_es:'Documental',
				nombre_en:'',
				imagen:'documentary-512.svg',
				estado:false,
			},
			7:{
				id:7,
				nombre_es:'Drama',
				nombre_en:'',
				imagen:'drama-512.svg',
				estado:false,
			},
			
		
			8:{
				id:8,
				nombre_es:'Fantasia',
				nombre_en:'',
				imagen:'fantasy-512.svg',
				estado:false,
			},
			9:{
				id:9,
				nombre_es:'Guerra',
				nombre_en:'',
				imagen:'action-512.svg',
				estado:false,
			},
			10:{
				id:10,
				nombre_es:'Romance',
				nombre_en:'',
				imagen:'novel-512.svg',
				estado:false,
			},
			11:{
				id:11,
				nombre_es:'Suspenso',
				nombre_en:'',
				imagen:'triller-512.svg',
				estado:false,
			},
			12:{
				id:12,
				nombre_es:'Terror',
				nombre_en:'',
				imagen:'horror-512.svg',
				estado:false,
			},
			13:{
				id:13,
				nombre_es:'Western',
				nombre_en:'',
				imagen:'western-512.svg',
				estado:true,
			}

		},*/

		categorias:{

			1:{
				label:'Peliculas'
			},
			2:{
				label:'Series'
			}
		}

	},

	

	//mutaciones
	mutations: {
		setGeneros(state, val){
			state.generos = val
		},
		actualizarFiltro(state, opt){
			// console.log(state.filtro)

			// let keys = Object.keys(state.filtro)
			// 	keys.forEach(key=>{
			// 		if(opt[key]){
			// 		state.filtro[key] = opt[key]
			// 	}
			// 	else{
			// 		state.filtro[key] = null
			// 	}
			// })

			let keys = Object.keys(opt)
			keys.forEach(key=>{
				state.filtro[key] = opt[key]
			})

		},


		

		actualizarGeneros(state, idsGenerosTrue){

			for (let prop in state.generos) {

				if(idsGenerosTrue.indexOf(state.generos[prop].id) !== -1){
					state.generos[prop].estado = true
				}else{
					state.generos[prop].estado = false

				}
			}

		

		},
	
		setRememberLogin(state, valor){
			state.rememberLogin = valor
		},

		actualizarMeta(state, meta){
			state.paginaMeta = {
				// titulo: '',
				// vista: '',
				// icono: '',
				// parent:'',
				...meta
			}
		},

		actualizarUsuario(state, usuario){
			state.usuario = usuario

		},

	}
}
