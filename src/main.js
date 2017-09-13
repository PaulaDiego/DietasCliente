import Vue from 'vue'
import App from './App.vue'
import DietaDetail from './DietaDetail.vue'
import PacienteDetail from './PacienteDetail.vue'
import {EventBus} from './EventBus.js'
import axios from 'axios'
window.SERVER = "http://10.60.23.11:49941" 

Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    titles: Array,
    filterKey: String,
    entidad: String
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      error:false
    }
  },
  created(){
  	EventBus.$on('error', (value => {
      		this.error = value
  		})
    )
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  methods: {
  	capitalize:function(index){
  		return this.titles[index]
  	},
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    showDetail: function(event){
    	let data = this.devuelveData(event.target.id)
    	if(data!=null || data!=undefined){
    		switch(this.entidad){
    			case "Dieta":
	    			new Vue({
			        el: '#detail',
			        data:{
			          dieta:data
			        },
	        		render: h => h(DietaDetail)
	      			})
	    			break
    			case "Paciente":
    				//data.FechaNacimiento = data.FechaNacimiento.split('T')[0]
    				new Vue({
			        el: '#detail',
			        data:{
			          paciente:data
			        },
	        		render: h => h(PacienteDetail)
	      			})
	      			break
    		}
    		    		
    	}
		
    },
    eliminar:function(event){
    	let id = event.target.id
    	if(id!=null || id!=undefined){
    		switch(this.entidad){
    			case "Dieta":
	    			axios.delete(SERVER+'/api/Dietas/'+id)
					 .then(result => {
					 	this.paciente = result.data
					 	EventBus.$emit('cambiosDieta')
					})
					.catch(error=>{
						this.error=true;
						setTimeout(()=>{ this.error = false; }, 4000);
					})
	    			break
    			case "Paciente":
    				axios.delete(SERVER+'/api/Pacientes/'+id)
					 .then(result => {
					 	this.paciente = result.data
					 	EventBus.$emit('cambiosPaciente')
					})
					.catch(error=>{
						this.error=true;
						setTimeout(()=>{ this.error = false; }, 4000);
					})
	      			break
    		}
    		    		
    	}
    },
	devuelveData: function(id){
		var resultado
		this.data.forEach(function(registro){
			if(registro.Id == id){
				resultado = registro
			}		
		})
		return resultado
	}
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
