const { parse, resolve, relative, join } = require('path')
const fs = require('fs')

const getRootFiles = function (files) {
  return files.reduce((acc, file) => {
    return { ...acc, [parse(file).name]: [join(__dirname, file)] }
  }, {})
}
const getAllFiles = function (ref, dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)

  files.forEach(function (file) {
    if (fs.statSync(join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(ref, join(dirPath, file), arrayOfFiles)
    } else if (parse(file).ext === '.ts' && !file.endsWith('.d.ts')) {
      arrayOfFiles[`${relative(ref, dirPath)}/${parse(file).name}`] = [
        join(dirPath, file),
      ]
    }
  })
  return arrayOfFiles
}

module.exports = (config) => {
  config.externals = {
    '@testing-library/cypress': '@testing-library/cypress',
    cypress: 'cypress',
  }
  config.entry = {
    ...getAllFiles(
      resolve(__dirname, './src'),
      resolve(__dirname, './src'),
      {},
    ),
    ...getRootFiles(['./cypress.config.ts']),
  }
  config.output = {
    ...config.output,
    filename: '[name].js',
    clean: true,
  }

  return config
}
