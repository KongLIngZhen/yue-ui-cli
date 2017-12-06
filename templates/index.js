import yue_ui_component from './yue_ui_component.vue'

yue_ui_component.install = function (Vue) {
	Vue.component(yue_ui_component.name, yue_ui_component)
}

if (typeof window !== 'undefined' && window.Vue) {
	yue_ui_component.install(window.Vue)
}

export default yue_ui_component
