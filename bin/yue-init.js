#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const ora = require('ora')

program
	.version(require('../package').version, '-v, --version')
	.usage('<command> [options]')
	.option('-t --test', 'test a component')

program.on('--help', () => {
	console.log('')
	console.log('Examples:')
	console.log('')
	console.log(chalk.blue('    # create a new component with a template'))
	console.log(chalk.gray('    $ yue-init <component-name>'))
	console.log('')
})

function help () {
	program.parse(process.argv)
	if (program.args.length < 1) return program.help()
}

help()

let componentName
let to

if (!program.args[0]) {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Please enter a component name',
			name: 'ok'
		}
	]).then(answer => {
		if (answer.ok) {
			console.log(chalk.green(`#[yue-ui-cli] component name is ${answer.ok}`))
			componentName = answer.ok
			checkExists(componentName)
		}
	})
} else {
	componentName = program.args[0]
	checkExists(componentName)
}

function checkExists (componentName) {
	to = path.resolve(componentName)
	if (!fs.existsSync(to)) {
		console.log(chalk.yellow(`#[yue-ui-cli] ${to} is not existed`))
		inquirer.prompt([
			{
				type: 'confirm',
				message: 'Create component in current directory?',
				name: 'ok'
			}
		]).then(answer => {
			if (answer.ok) {
				run()
			}
		})
	} else {
		run()
	}
}

function run () {
	console.log(chalk.blue(`#[yue-ui-cli] init begin`))
	const spinner = ora('Create component...\n')
	spinner.start()
	setTimeout(function () {
		copy(path.resolve(__dirname, '../templates/component'), `${to}/`).then(res => {
			spinner.stop()
			console.log(chalk.green(`#[yue-ui-cli] init success`))
			handleArgv()
		}).catch(err => {
			spinner.stop()
			console.log(chalk.red(`#[yue-ui-cli] init failed, reason: \n`))
			console.log(chalk.red(err))
		})
	}, 1500)
}

let ps = []

function copy (src, target) {
	if (!fs.existsSync(target)) {
		fs.mkdirSync(target)
	}

	let paths = fs.readdirSync(src)

	paths.forEach(path => {
		let stat = fs.statSync(`${src}/${path}`)

		if (stat.isFile()) {
			let pro = new Promise((resolve, reject) => {
				let data = fs.readFileSync(`${src}/${path}`)

				if (data) {
					let res = data.toString().replace(/yue_ui_component/g, componentName)
					if (path === 'yue_ui_component.vue') path = `${componentName}.vue`

					fs.writeFileSync(`${target}/${path}`, res)
				}
				resolve(`${target}/${path} success`)
			})

			ps.push(pro)
		} else {
			copy(`${src}/${path}`, `${target}/${path}`)
		}
	})

	return Promise.all(ps)
}

function handleArgv () {
	if (program.test) {
		console.log(chalk.blue(`#[yue-ui-cli] init unit test begin`))

		testArgv().then(res => {
			console.log(chalk.green(`#[yue-ui-cli] init unit test success`))
		}).catch(err => {
			console.log(chalk.red(`#[yue-ui-cli] init unit test failed, reason: \n`))
			console.log(chalk.red(err))
		})
	}
}

function testArgv () {

	return new Promise((resolve, reject) => {
		let testTempPath = `${path.resolve(__dirname, '../templates/test')}/yue_ui_component.spec.js`
		fs.readFile(testTempPath, (err, data) => {
			if (err) {
				reject(err)
				return
			}
			let res = data.toString().replace(/yue_ui_component/g, componentName)

			inquirer.prompt([
				{
					type: 'input',
					message: 'Please enter unit test path',
					name: 'ok'
				}
			]).then(answer => {
				if (answer.ok) {
					mkDirsSync(answer.ok)

					console.log(path.resolve(process.cwd(), `${answer.ok}/${componentName}.spec.js`))
					fs.writeFile(path.resolve(process.cwd(), `${answer.ok}/${componentName}.spec.js`), res, err => {
						if (err) {
							reject(err)
							return
						}
						resolve(`./test/unit/specs/${componentName}.spec.js success`)
					})
				}
			})

		})
	})
}

function mkDirsSync (dirname) {
	if (fs.existsSync(dirname)) {
		return true
	} else {
		if (mkDirsSync(path.dirname(dirname))) {
			fs.mkdirSync(dirname)
			return true
		}
	}
}
