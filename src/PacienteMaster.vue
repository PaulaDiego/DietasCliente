<template>
  <div id="master">
    <div id="detail" class="row"></div>
    <div v-if="pacientes.length>0">
      <form id="search" class="row">
        <div class="col-xs-8 col-md-6">
          Búsqueda <input name="query" v-model="searchQuery"/>
          <input type="button" name="crear" value="Nuevo Paciente" class="btn btn-secondary" v-on:click = "showDetail"/>
        </div>
      </form>
      <demo-grid
        :data="pacientes"
        :titles="titulosColumnas"
        :columns="columnas"
        :filter-key="searchQuery"
        :entidad="entidad">
      </demo-grid>
    </div>
    <div v-else>
      <p>No hay registros de pacientes</p>
      <p><input type="button" name="crear" value="Nuevo Paciente" class="btn btn-secondary" v-on:click = "showDetail"/></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import {EventBus} from './EventBus.js'
import PacienteDetail from './PacienteDetail.vue'
export default {
  name: 'master',
  data () {
    return {
      searchQuery: '',
      titulosColumnas: ['Nombre', 'Apellidos','DNI','Fecha Nacimiento','Peso','Altura','Nivel de Actividad','Dieta'],
      columnas: ['Nombre', 'Apellidos','DNI','FechaNacimiento','Peso','Altura','NivelActividad','Dieta'],
      pacientes:[],
      entidad:"Paciente",
      arrayDietas:[],
      success:false,
      error:false
    }
  },
  created(){
    this.getAll()
    this.getDietas()
    EventBus.$on('cambiosPaciente',
      this.getAll
    )
    this.getDietas()
    
  },
  methods: {
    getAll: function(){
      axios.get(SERVER+'/api/Pacientes')
      .then (result => {
        result.data.forEach(function(registro){
          registro.FechaNacimiento = registro.FechaNacimiento.split('T')[0]
        })
        this.pacientes = result.data;
      })
    },
    showDetail: function(){
      let paciente = {}
      new Vue({
        el: '#detail',
        data:{
          pacientes:paciente,
          arrayDietas: this.arrayDietas
        },
        render: h => h(PacienteDetail)
      })
    },
    getDietas(){
      axios.get(SERVER+'/api/Dietas')
      .then (result => {
        this.arrayDietas = result.data;
      })
    }
  }
}
</script>

