<template>
  <span>
    <span>{{integer}}</span>
    <span class="lighter-color">{{decimals}}</span>
  </span>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'


    @Component
    export default class NumberFormatting extends Vue {

        @Prop({default: 0})
        numberOfFormatting: number

        get pointIndex() {
            return this.numberOfFormatting.toString().indexOf('.')
        }

        get integer() {
            return this.numberOfFormatting.toString().substring(0, this.pointIndex)
        }

        get decimals() {
            return this.numberOfFormatting.toFixed(this.pointIndex)
        }

    }
</script>
<style scoped lang="less">
  .lighter-color {
    opacity: .8;
  }
</style>
