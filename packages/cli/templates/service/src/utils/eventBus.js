// EventBus.js
import { createApp } from 'vue'

const eventBus = createApp({})
eventBus.config.globalProperties.$bus = eventBus

export default eventBus
