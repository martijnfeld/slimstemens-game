<template>
    <table class="table table-borderless text-center">
        <tbody>
            <tr v-for="rij in 3" :key="'rij'+rij">
                <td 
                    v-for="col in 3" 
                    :key="'rij'+rij+'_'+col"
                    :class="{
                        active: (vraagNummer(rij, col) == currentVraag),
                        puntenvraag: (vraagNummer(rij, col) % 3 == 0)
                    }"
                >
                    {{ vraagNummer(rij, col) }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    name: "VragenTable",
    props: {
        "vragen": Object,
        "currentVraag": Number,
    },
    methods: {
        vraagNummer(rij, col) {
            return (rij - 1) * 3 + col
        }
    },
    computed: {
    }
}
</script>

<style>
    td {
        transition: background-color 0.3s;
    }

    td.puntenvraag {
        background-color: pink;
    }
    td.active {
        background-color: yellow;
    }
</style>
