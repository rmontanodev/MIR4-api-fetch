<template>
    <div v-bind:style="inline_block">
      <h2 v-bind:style="filter_title_css">{{filter_title}}</h2>
      <div class="col-md-1">
          <b-form-group
          id="fieldset-1"
          description="Constitution LVL"
          label-for="constitution"
          >
          <b-form-input id="constitution" v-model="constitution" type="number"></b-form-input>
          </b-form-group>
      </div>
      <div class="col-md-1">
        <b-form-group
        id="fieldset-2"
        description="muscle_strength LVL"
        label-for="muscle_strength"
        >
        <b-form-input id="muscle_strength" v-model="muscle_strength" type="number"></b-form-input>
        </b-form-group>
      </div>
      <div class="col-md-1">
        <b-form-group
        id="fieldset-3"
        description="nine_yin LVL"
        label-for="nine_yin"
        >
        <b-form-input id="nine_yin" v-model="nine_yin" type="number"></b-form-input>
        </b-form-group>
      </div>
      <div class="col-md-1">
        <b-form-group
        id="fieldset-4"
        description="nine_yang LVL"
        label-for="nine_yang"
        >
        <b-form-input id="nine_yang" v-model="nine_yang" type="number"></b-form-input>
        </b-form-group>
      </div>
      <div class="col-md-1">
        <b-form-group
        id="fieldset-4"
        description="violet_mist LVL"
        label-for="violet_mist"
        >
        <b-form-input id="violet_mist" v-model="violet_mist" type="number"></b-form-input>
        </b-form-group>
      </div>
      <div class="col-md-1">
        <b-form-group
        id="fieldset-5"
        description="northern_profound LVL"
        label-for="northern_profound"
        >
        <b-form-input id="northern_profound" v-model="northern_profound" type="number"></b-form-input>
        </b-form-group>
      </div>
      <div class="col-md-1">
        <b-form-group
        id="fieldset-6"
        description="toad_stance LVL"
        label-for="toad_stance"
        >
        <b-form-input id="toad_stance" v-model="toad_stance" type="number"></b-form-input>
        </b-form-group>
      </div>
      <div class="col-md-1">
        <b-form-group
        id="fieldset-7"
        description="solitude_training LVL"
        label-for="solitude_training"
        >
        <b-form-input id="solitude_training" v-model="solitude_training" type="number"></b-form-input>
        </b-form-group>
      </div>
    </div>
  </template>
  
  <script>
    export default {
      data() {
        return {
          constitution: 0,
          muscle_strength: 0,
          nine_yin: 0,
          nine_yang: 0,
          violet_mist: 0,
          northern_profound: 0,
          toad_stance: 0,
          solitude_training: 0,
          inline_block: {
            display:"inline-flex"
          },
          filter_title: "Training filter",
          filter_title_css: {
            color: "blue"
        }
        }
        
      }
    }
  </script>