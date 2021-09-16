const _ = require('lodash')
const { parse: babelParser } = require('@babel/parser')
const { parsers } = require('prettier/parser-babel')
const { basename } = require('path')
const sortPaths = require('sort-paths')
const get = require('lodash/get')

const jsonParser = parsers['json']
const javascriptParser = parsers['babel']

const sortObjectByKey = (obj) => {
  return _(obj).toPairs().sortBy(0).fromPairs().value()
}

const editStringJSON = (text, handler) => {
  const inJson = JSON.parse(text)
  const outJson = handler(inJson)
  return JSON.stringify(outJson, null, '  ')
}

const sortWorkspace = (text) => {
  return editStringJSON(text, (json) => {
    if (json.projects) {
      json.projects = sortObjectByKey(json.projects)
    }

    return json
  })
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

const sortJestConfig = (text) => {
  const projects = []
  const ast = babelParser(text)
  const elements = get(
    ast,
    'program.body[0].expression.right.properties[0].value.elements',
    [],
  )

  for (const project of elements) {
    projects.push(project.value.replace('<rootDir>', ''))
  }

  const sorted = sortPaths(projects, '/')
  const paths = sorted.map((name) => `'<rootDir>${name}'`).join(',\n')

  return `
    module.exports = {
      projects: [${paths}]
    }
  `
}

exports.parsers = {
  babel: {
    ...javascriptParser,
    preprocess(text, options) {
      switch (options.filepath) {
        // Removed parsing of 'jest.config.js' in the root of the repo
        // as Nx now includes getJestProjects() function and no need to sort the array.

        default:
          return text
      }
    },
  },
  json: {
    ...jsonParser,
    preprocess(text, options) {
      if (jsonParser.preprocess) {
        text = jsonParser.preprocess(text, options)
      }

      const fileName = options.filepath && basename(options.filepath)

      switch (fileName) {
        case 'workspace.json':
          return sortWorkspace(text)

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
