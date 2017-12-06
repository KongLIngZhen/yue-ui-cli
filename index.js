#!/usr/bin/env node

console.log('==================== Welcome to use Yue-ui-cli ====================')
console.log('init begin')

const fs = require('fs')
const path = require('path')

const BASE_PATH = './src/components/'

let config = {}

config.name = process.argv.slice(2)[0]
config.path = BASE_PATH + config.name

console.log('component name is ' + config.name)
console.log('path is ' + config.path)

function copyTemplate (from, to) {
	if (!fs.existsSync(config.path)) {
		fs.mkdirSync(config.path)
	}
	read(from, to)
}

function read (from, to) {
	from = path.join(__dirname, 'templates', from)
	fs.readFile(from, function(err, data) {
		if (!err) {
			write(to, data.toString().replace(/yue_ui_component/g, config.name))
		}
	})
}

function write (path, str) {
	fs.writeFile(path, str, (error) => {
		if (error) {
			console.log('writeFile error :' + error)
		} else {
			console.log(path + ' done')
		}
	})
}

copyTemplate('yue_ui_component.vue', config.path + '/' + config.name + '.vue')
copyTemplate('index.js', config.path + '/index.js')
copyTemplate('README.md', config.path + '/README.md')
