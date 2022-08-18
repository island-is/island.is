const { parse, resolve, relative, join } = require('path')
const fs = require('fs')
const nrwlConfig = require('@nrwl/react/plugins/webpack.js')

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
      // arrayOfFiles[`${relative(ref, dirPath)}/${file}`] = [join(dirPath, file)]
    }
  })
  return arrayOfFiles
}

module.exports = (config) => {
  nrwlConfig(config) // first call it so that it @nrwl/react plugin adds its configs,
  config.entry = {
    ...getAllFiles(
      resolve(__dirname, './src'),
      resolve(__dirname, './src'),
      {},
    ),
    ...getRootFiles(['cypress.config.ts']),
    'cypress.env.json': [resolve(__dirname, './cypress.env.json')],
  }

  console.log(config.entry)
  config.module = {
    ...config.module,
    rules: [
      {
        test: /cypress.env.json/,
        type: 'asset/resource',
        generator: {
          filename: '[name]',
        },
      },
      ...config.module.rules,
    ],
  }
  console.log(config.module.rules)

  config.output = {
    ...config.output,
    // filename: (name) => {
    //   console.log(name)
    //   return name.runtime === 'cypress.env.json' ? '[name].json' : '[name].js'
    // },

    filename: '[name].js',
    clean: true,
    assetModuleFilename: '[name]',
    // assetModuleFilename: (name) => {
    //   return name === 'cypress.env.json' ? '[name].js' : 'cypress.env.json'
    // },
  }
  return config
}

// filename: (name) => {
//   return name === 'cypress.env.json' ? '[name].js' : 'cypress.env.json'
// },
