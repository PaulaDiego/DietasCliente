<template>
	<div id="detail" class="container">
		
		<form onsubmit="return false" v-if="active" class="form-horizontal">
			<h3 v-if="dieta.Id">Actualización de la Dieta</h3>
			<h3 v-else>Nueva Dieta</h3>
			<input type="hidden" id="id" v-model:value="dieta.Id"/>
			<div class="form-group">
				<label for="nombre" class="control-label">Nombre: </label>
				<input type="text" required id="nombre" class="form-control" v-model:value="dieta.Nombre"/>
			</div>
			<div class="form-group">
				<label for="descripcion" class="control-label">Descripcion: </label>
				<!--<input type="text" required id="descripcion" class="form-control" v-model:value="dieta.Descripcion"/>-->
				<textarea required id="descripcion" class="form-control" rows="4" v-model:value="dieta.Descripcion"/></textarea>
			</div>
			<div class="form-group">
				<label for="duracion" class="control-label"> Duración:</label>
				<input type="number" required id="dni" min="0" class="form-control" v-model:value="dieta.Duracion"/>
			</div>
			<div class="form-group">
				<label for="cal-dia" class="control-label"> Calorías/Día:</label>
				<input type="number" required id="cal-dia" min="0" max="50000" class="form-control" v-model:value="dieta.CaloriasDia"/>
			</div>
			<div class="form-group">
				<label for="dureza" class="control-label"> Dureza:</label>
				<input type="number" required id="dureza" min="0" max="10" class="form-control col-xs-6" v-model:value="dieta.Dureza"/>
				<output v-model:value="dureza"></output>
			</div>
			<div v-if="dieta.FechaCreacion" class="form-group">
				<label for="fechaCreacion"> Fecha de Creación: </label>
				<input type="date" readonly id="fechaCreacion" class="form-control" v-model:valueAsDate="dieta.FechaCreacion"/>

			</div>
			<p>
				<input type ="button" name="aceptar" value="Aceptar" class="btn btn-success" v-on:click="aceptar"/>
				<input type ="button" name="cancelar" value="Cancelar" class="btn btn-secondary" v-on:click="cerrarDetalle"/>
				<input v-if="dieta.Id" type ="button" name="eliminar" class="btn btn-danger"value="Eliminar" v-on:click="eliminar"/>
				
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
			dieta:this.dieta,
			active:true
			
		}
		
	},
	created() {
		if(this.$parent.dieta != undefined){
			this.dieta = this.$parent.dieta
		}else{
			this.dieta = {
				Id:null
				
			}
		}
	},
	methods: {
		eliminar: function(){
			axios.delete(SERVER+'/api/Dietas/'+this.dieta.Id)
			 .then(result => {
			 	this.dieta = result.data
			 	EventBus.$emit('cambiosDieta',this.dieta)
			 	this.cerrarDetalle()
			})
			.catch(error=>{
				EventBus.$emit('error',true)
				setTimeout(()=>{ EventBus.$emit('error',false)}, 4000);
			})
			
			
		},
		aceptar: function(){
			if(this.dieta.Id==null || this.dieta.Id==0){
				this.dieta.Id = 0
				axios.post(SERVER + '/api/Dietas',this.dieta)
				.then(
					(dieta)=>{
					this.dieta.Id = dieta.data.Id
					this.cerrarDetalle()

				})
				.catch(error=>{
					EventBus.$emit('error',true)
					setTimeout(()=>{ EventBus.$emit('error',false)}, 4000);
				})
			}else{
				axios.put(SERVER + '/api/Dietas/'+this.dieta.Id,this.dieta)
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
			EventBus.$emit('cambiosDieta',this.dieta)
			this.active = false
		}
	}
}
</script>
