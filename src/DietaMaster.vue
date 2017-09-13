<template>
  <div id="master">
    <div id="detail" class="row"></div>
    <div v-if="dietas.length>0">
      <form id="search">
        Busqueda <input name="query" v-model="searchQuery"/>
        <input type="button" name="crear" value="Nueva Dieta" class="btn btn-secondary" v-on:click = "showDetail"/>
      </form>
      <demo-grid
        :data="dietas"
        :titles = "titulosColumnas"
        :columns="columnas"
        :filter-key="searchQuery"
        :entidad="entidad">
      </demo-grid>
    </div>
    <div v-else>
      <p>No hay registros de dietas</p>
      <p><input type="button" name="crear" value="Nueva Dieta" class="btn btn-secondary" v-on:click = "showDetail"/></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import {EventBus} from './EventBus.js'
import DietaDetail from './DietaDetail.vue'
export default {
  name: 'master',
  data () {
    return {
      searchQuery: '',
      titulosColumnas: ['Nombre', 'Descripción','Cal/Dia','Dureza','Duración','Fecha Creación'],
      columnas: ['Nombre', 'Descripcion','CaloriasDia','Dureza','Duracion','FechaCreacion'],
      dietas:[],
      entidad:"Dieta"
    }
  },
  created(){
    this.getAll()
    EventBus.$on('cambiosDieta',
      this.getAll
    )
    
  },
  methods: {
    getAll: function(){
      axios.get(SERVER+'/api/Dietas')
      .then (result => {
        result.data.forEach(function(registro){
          registro.FechaCreacion = registro.FechaCreacion.split('T')[0]
        })
        this.dietas = result.data;
      })
    },
    showDetail: function(){
      let dieta = {}
      new Vue({
        el: '#detail',
        data:{
          dieta:dieta
        },
        render: h => h(DietaDetail)
      })
    }
  }
}
</script>

