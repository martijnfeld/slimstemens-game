<template>
  <div>
      <h2>3 - 6 - 9</h2>
      <VragenTable
        :vragen="vragenStatus"
        :current-vraag="currentVraag"
      />
  </div>
</template>

<script>
import VragenTable from  "../../components/ronde1/VragenTable"
export default {
    components: {
        VragenTable
    },
    data(){
        return {
            currentVraag: 1,
            vragenStatus: {}
        }
    }
}
</script>

<style>

</style>
