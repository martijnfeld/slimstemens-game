<template>
    <b-button v-if="!value" block variant="success" :active="value" @click="$emit('start', !value)">
            <font-awesome-icon :icon="['fas',  'play']" /> 
            Start timer voor <i>{{ speler.naam }}</i>
    </b-button>
    <b-button v-else block variant="warning" :active="value" @click="$emit('pas', !value)">
        <font-awesome-icon :icon="['fas',  'stop']" /> Pas
    </b-button>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        speler: {
            type: Object
        }
    }
}
</script>

<style>

</style>
