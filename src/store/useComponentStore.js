import { reactive, readonly } from 'vue'

const defaultState = {
    isDateFilled: false,
    isTimeChoosed:false
}

const state = reactive(defaultState)


export default ()=>({
    state: state
})