import Vue from 'vue'
import yue_ui_component from '@/components/yue_ui_component/src/yue_ui_component.vue'

describe('yue_ui_component.vue', () => {
	it('test name', () => {
		const Constructor = Vue.extend(yue_ui_component)
		const vm = new Constructor().$mount()
		expect(vm.$options.name).to.equal('yue_ui_component')
	})
})
