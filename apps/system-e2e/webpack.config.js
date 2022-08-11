const webpack = require('webpack')
const {resolve, join, relative} = require('path')
const fs = require('fs')
const nrwlConfig = require('@nrwl/react/plugins/webpack.js')
// import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'

const getAllFiles = function(ref, dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(ref, dirPath + "/" + file, arrayOfFiles)
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      arrayOfFiles[`${relative(ref, dirPath)}/${file.replace('.ts', '')}`] = [join(dirPath, "/", file)]
    }
  })

  return arrayOfFiles
}
module.exports = (config) => {
  nrwlConfig(config) // first call it so that it @nrwl/react plugin adds its configs,
  config.entry = getAllFiles(resolve(__dirname, './src'),resolve(__dirname, './src'), {})
  config.output = {
    ...config.output,
    filename: '[name].js',
    clean: true
  }

  return config
}
