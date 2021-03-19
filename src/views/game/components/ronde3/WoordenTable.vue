<template>
    <table :class="['table', 'table-bordered', 'text-center', 'table-mode-'+mode]">
        <tbody>
            <tr v-for="rij in 3" :key="'rij'+rij">
                <td 
                    v-for="col in 4" 
                    :key="'rij'+rij+'_'+col"
                    :class="getClasses(woordIndex(rij, col))"
                >
                    {{ woorden[woordIndex(rij, col)].woord }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    name: "WoordenTable",
    props: {
        "woorden": Array,
        "gevonden": Object,
        mode: {
            type: String,
            required: true
        }
    },
    methods: {
        woordIndex(rij, col) {
            return ((rij - 1) * 4 + col) - 1
        },
    },
    computed: {
        getClasses: function(){ 
            return (woordIndex) => {
                console.log(woordIndex)
                let woord = this.woorden[woordIndex];
                var gevonden = !!this.gevonden[woord.groepIndex];

                return [
                    "woord-"+woordIndex,
                    gevonden ? "woord-gevonden" : '',
                    "groep-" + woord.groepIndex
                ];
            }

        }
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
