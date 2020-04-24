import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faPlus, faMinus,
    faCheck, faTimes,
    faArrowRight, faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
    faPlus, faMinus,
    faCheck, faTimes,
    faArrowRight, faArrowLeft
)

Vue.component('font-awesome-icon', FontAwesomeIcon)