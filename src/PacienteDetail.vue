<template>
	<div id="detail">
		
		<form onsubmit="return false" v-if="active">
			<h3 v-if="paciente.Id">Actualización de Paciente</h3>
			<h3 v-else>Nuevo Paciente</h3>
			<input type="hidden" id="id" v-model:value="paciente.Id"/>
			<div class="form-group">
				<label for="nombre" class="control-label">Nombre: </label>
				<input type="text" required id="nombre" class="form-control" v-model:value="paciente.Nombre"/>
			</div>
			<div class="form-group">
				<label for="apellidos" class="control-label">Apellidos: </label>
				<input type="text" required id="apellidos" class="form-control" v-model:value="paciente.Apellidos"/>
			</div>
			<div class="form-group">
				<label for="dni" class="control-label">DNI: </label>
				<input type="text" required id="dni" class="form-control" v-model:value="paciente.DNI"/>
			</div>
			<div class="form-group">
				<label for="fechaNacimiento" class="control-label"> Fecha de Nacimiento</label>
				<input type="date" required id="fechaNacimiento" class="form-control" v-model:valueAsDate="paciente.FechaNacimiento"/></div>
			<div class="form-group">
				<label for="peso" class="control-label"> Peso:</label>
				<input type="number" required id="dni" min="0" max="200" class="form-control" v-model:value="paciente.Peso"/>
			</div>
			<div class="form-group">
				<label for="altura" class="control-label"> Altura:</label>
				<input type="number" required id="altura" min="0" max="260" class="form-control" v-model:value="paciente.Altura"/>
			</div>
			<div class="form-group">
				<label for="nivelActividad" class="control-label"> Nivel:</label>
				<input type="number" required id="nivelActividad" min="0" max="10" class="form-control" v-model:value="paciente.NivelActividad"/>
			</div>
			<div class="form-group">
				<label for="dieta" class="control-label"> Dieta:</label>
				<input type="text" required id="dieta" class="form-control" v-model:value="paciente.Dieta"/>
			</div>
			<!--<div class="form-group">
				<label for="dieta" class="control-label"> Dieta:</label>
				<select v-model:value="paciente.Dieta" id="dieta" required>
				  <option v-for="option in arrayDietas" v-bind:value="option.value">
				    {{ option.Nombre }}
				  </option>
				</select>
			</div>-->
			<p>
				<input type ="button" name="aceptar" value="Aceptar" class="btn btn-success" v-on:click="aceptar"/>
				<input type ="button" name="cancelar" value="Cancelar" class="btn btn-secondary" v-on:click="cerrarDetalle"/>
				<input v-if="paciente.Id" type ="button" name="eliminar" class="btn btn-danger"value="Eliminar" v-on:click="eliminar"/>
				
			</p>
		</form>
		
	</div>
</template>

<script>
import {EventBus} from './EventBus.js'
import axios from 'axios'
export default {
	name: 'detalle',
	data(){
		return {
			paciente:this.paciente,
			active:true,
			arrayDietas:this.arrayDietas
			
		}
		
	},
	created() {
		if(this.$parent.paciente != undefined){
			this.paciente = this.$parent.paciente
		}else{
			this.paciente = {
				Id:null
				
			}
		}
	},
	methods: {
		eliminar: function(){
			axios.delete(SERVER+'/api/Pacientes/'+this.paciente.Id)
			 .then(result => {
			 	this.paciente = result.data
			 	EventBus.$emit('cambiosPaciente',this.paciente)
			 	this.cerrarDetalle()
			})
			.catch(error=>{
				EventBus.$emit('error',true)
				setTimeout(()=>{ EventBus.$emit('error',false)}, 4000);
			})
			
		},
		aceptar: function(){
			this.paciente.FechaNacimiento = new Date(this.paciente.FechaNacimiento).toISOString()
			if(this.paciente.Id==null || this.paciente.Id==0){
				this.paciente.Id = 0
				axios.post(SERVER + '/api/Pacientes',this.paciente)
				.then(
					(paciente)=>{
					this.paciente.Id = paciente.data.Id
					this.cerrarDetalle()

				})
				.catch(error=>{
					EventBus.$emit('error',true)
					setTimeout(()=>{ EventBus.$emit('error',false)}, 4000);
				})
			}else{
				axios.put(SERVER + '/api/Pacientes/'+this.paciente.Id,this.paciente)
				.then(
					()=>{
						this.cerrarDetalle()
				})
				.catch(error=>{
					EventBus.$emit('error',true)
					setTimeout(()=>{ EventBus.$emit('error',false)}, 4000);
				})
			}
		},
		cerrarDetalle:function(){
			this.active = false
			EventBus.$emit('cambiosPaciente',this.paciente)
		}
	}
}
</script>
