import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faPlus, faMinus,
    faCheck, faTimes,
    faArrowRight, faArrowLeft,
    faPlay, faPause, faStop
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
    faPlus, faMinus,
    faCheck, faTimes,
    faArrowRight, faArrowLeft,
    faPlay, faPause, faStop
)

Vue.component('font-awesome-icon', FontAwesomeIcon)