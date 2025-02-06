import { initGlobalState } from 'qiankun'

const initialState = {
  lang: localStorage.getItem('lang') || 'zh',
  sessionId: '',
  role: localStorage.getItem('role'),
}

const actions = initGlobalState(initialState)

actions.onGlobalStateChange((state) => {
  // console.log('state, prev: ', state, prev);
  for (const key in state) {
    initialState[key] = state[key]
  }
})

actions.getGlobalState = (key) => {
  return key ? initialState[key] : initialState
}

export default actions
