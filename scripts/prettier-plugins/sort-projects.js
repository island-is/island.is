const _ = require('lodash')
const { parsers } = require('prettier/parser-babel')
const { basename } = require('path')

const jsonParser = parsers['json']

const sortObjectByKey = (obj) => {
  return _(obj).toPairs().sortBy(0).fromPairs().value()
}

const editStringJSON = (text, handler) => {
  const inJson = JSON.parse(text)
  const outJson = handler(inJson)
  return JSON.stringify(outJson, null, '  ')
}

const sortNx = (text) => {
  return editStringJSON(text, (json) => {
    if (json.projects) {
      json.projects = sortObjectByKey(json.projects)
    }

    return json
  })
}

const sortTsConfig = (text) => {
  return editStringJSON(text, (json) => {
    if (json.compilerOptions && json.compilerOptions.paths) {
      json.compilerOptions.paths = sortObjectByKey(json.compilerOptions.paths)
    }

    return json
  })
}

exports.parsers = {
  json: {
    ...jsonParser,
    preprocess(text, options) {
      if (jsonParser.preprocess) {
        text = jsonParser.preprocess(text, options)
      }

      const fileName = options.filepath && basename(options.filepath)

      switch (fileName) {
        case 'tsconfig.base.json':
          return sortTsConfig(text)

        case 'nx.json':
          return sortNx(text)

        default:
          return text
      }
    },
  },
}
