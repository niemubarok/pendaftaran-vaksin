import { reactive, readonly } from 'vue'

const defaultState = {
    isDateFilled: false,
    isTimeChoosed: false,
    showDialog:true
}

const state = reactive(defaultState)


export default ()=>({
    state: state
})