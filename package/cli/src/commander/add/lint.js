import shelljs from 'shelljs'
import { resolve } from 'path'
import inquirer  from 'inquirer'
import { sequenceIterate } from "../../utils/common";
import { renderAndOutput } from "../../utils/render";
import { rootDirName } from '../../instance';

const __dirname = resolve(rootDirName, 'src/commander/add')

const addEslint = async function (answer, context) {
  // 安装@xunserver/eslint-config
  shelljs.exec('npm i -D @xunserver/eslint-config')

  // 辈分本地的.eslintrc.js
  shelljs.cp('./.eslintrc.js', './.eslintrc.js.bak')

  let eslintType = answer.framework;
  if (answer.typescript) {
    eslintType = eslintType + '-ts'
  }

  // 通过添加配置文件
  renderAndOutput(resolve(__dirname, './template/eslintrc.js'), '.eslintrc.js', { eslintType })
}

const addStylelint = async function (answer, context) {
 shelljs.exec('npm i -D @xunserver/stylelint-config')

 const configFileName = '.stylelintrc.js'
 shelljs.cp(configFileName, `${configFileName}.bak`)

 let type = answer.framework;

 // 通过添加配置文件
 renderAndOutput(resolve(__dirname, `./template/${configFileName.substring(1)}`), configFileName, { type })
}

const addPrettier = async function (answer, context) {
  shelljs.exec('npm i -D @xunserver/prettier-config')

  const configFileName = '.prettierrc.js'
  shelljs.cp(configFileName, `${configFileName}.bak`)
  // 通过添加配置文件
  renderAndOutput(resolve(__dirname, `./template/${configFileName.substring(1)}`), configFileName, {})
 }

const addEditorconfig = async function () {
  shelljs.exec('npm i -D @xunserver/vscode-config')
  shelljs.cp('.editorconfig', '.editorconfig.bak')
  shelljs.cp('node_modules/@xunserver/vscode-config/.editorconfig', '.editorconfig')
}

const addCommitlint = async function (answer) {
  shelljs.exec('npm i -D @xunserver/prettier-config')

  const configFileName = '.commitlintrc.js'
  shelljs.cp(configFileName, `${configFileName}.bak`)
 
  // 通过添加配置文件
  renderAndOutput(resolve(__dirname, `./template/${configFileName.substring(1)}`), configFileName, {})
 }

const actionMaps = {
  'eslint': addEslint,
  'stylelint': addStylelint,
  'prettier': addPrettier,
  'editorconfig': addEditorconfig,
  'commitlint': addCommitlint
}

export const action = async (option) => {
  const answer = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'framework',
      message: 'vue、react还是通用开发',
      default: 'common',
      choices: [
        'vue',
        'vu3',
        'react',
        'recommended'
      ]
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: '是否使用typescript',
      default: true
    },
    {
      type: 'checkbox',
      name: 'lints',
      message: '选择需要添加的lint工具',
      default: ['all'],
      choices: [
        'all',
        'prettier',
        'editorconfig',
        'eslint',
        'stylelint',
        'commitlint',
      ]
    }
  ])

  if (answer.lints.find(item => item === 'all')) {
    const actions = Object.entries(actionMaps).map(([_, action]) => action);
    return await sequenceIterate(actions, answer)
  }

  const context = {
    cwd: process.cwd()
  }

  sequenceIterate(answer.lints.map(lint => actionMaps[lint]), answer, context)

}