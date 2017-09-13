<template>
  <div id="app" class="container">
    <h1 id="paciente" v-on:click="showMaster" class="col-spaced col-xs-6 btn btn-default" v-bind:class="{ 'btn-success': pacienteSelected }">Pacientes</h1>
    <h1 id="dieta" v-on:click="showMaster" class="col-spaced col-xs-6 btn btn-default" v-bind:class="{ 'btn-success': dietaSelected }">Dietas</h1>
    <div id="master">
      <div class="jumbotron">
        <h1>Gestión de Dietas</h1> 
        <h3>Bienvenido a la aplicación</h3> 
        <p>Selecione una entidad para su gestión</p>
      </div>
    </div>
  </div>
  
</template>
<script>
import Vue from 'vue'
import DietaMaster from './DietaMaster.vue'
import PacienteMaster from './PacienteMaster.vue'
export default {
  name: 'app',
  data(){
    return {
      pacienteSelected: false,
      dietaSelected: false
    }
    
  },
  methods: {
    showMaster:function(event){
      let id = event.target.id
      switch (id){
        case "paciente":
            this.pacienteSelected=true
            new Vue({
              el: '#master',
              render: h => h(PacienteMaster)
            })
            this.dietaSelected=false
          break
        case "dieta":
            this.dietaSelected=true
            new Vue({
              el: '#master',
              render: h => h(DietaMaster)
            })
            this.pacienteSelected=false
          break
      }
    }
  }
}
</script>
