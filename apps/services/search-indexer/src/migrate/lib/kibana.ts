import fs from 'fs'
import path from 'path'
import util from 'util'
import get from 'lodash/get'
import set from 'lodash/set'
import { KibanaService } from '@island.is/content-search-toolkit'
import {
  KibanaSavedObject,
  LocalKibanaSavedObject,
} from '@island.is/content-search-indexer/types'
import { environment } from '../../environments/environment'

const { configPath } = environment

const kibanaObjects = `${configPath}/kibana`

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const readdir = util.promisify(fs.readdir)

const kibanaService = new KibanaService()

interface FileObject {
  name: string
  content: string
}

const getObjects = async (): Promise<FileObject[]> => {
  const files = await readdir(kibanaObjects)
  return Promise.all(
    files
      .filter((name) => path.extname(name) === '.json')
      .map(async (name) => {
        const content = await readFile(path.join(kibanaObjects, name))
        return {
          name,
          content: content.toString(),
        }
      }),
  )
}

const assembleNestedKeys = (object: object): string[] =>
  Object.keys(object).reduce((acc, curr) => {
    acc.push(curr)
    if (typeof object[curr] === 'object' && object[curr] !== null) {
      return [...acc, ...assembleNestedKeys(object[curr])]
    }
    return acc
  }, [])

const stringifySavedObject = (object: any): string => {
  object.nestedJsonPaths.reverse().forEach((jsonPath) => {
    const string = JSON.stringify(get(object, jsonPath))
    set(object, jsonPath, string)
  })
  delete object.nestedJsonPaths
  return JSON.stringify(object)
}

const deepParseSavedObject = (
  object: object,
  path: string,
  nestedJsonPaths: string[],
) => {
  if (Array.isArray(object)) {
    return object.map((item, index) =>
      deepParseSavedObject(item, `${path}[${index}]`, nestedJsonPaths),
    )
  } else if (typeof object === 'object' && object !== null) {
    return Object.keys(object).reduce((acc, curr) => {
      acc[curr] = deepParseSavedObject(
        object[curr],
        path ? `${path}.${curr}` : curr,
        nestedJsonPaths,
      )
      return acc
    }, {})
  } else if (typeof object === 'string') {
    try {
      const parsed = JSON.parse(object)
      nestedJsonPaths.push(path)
      return deepParseSavedObject(parsed, path, nestedJsonPaths)
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e
      }
    }
  }
  return object
}

// parseSavedObject and its helper deepParseSavedObject are necessary to
// parse nested json objects inside the original one
const parseSavedObject = (
  object: KibanaSavedObject,
): LocalKibanaSavedObject => {
  const nestedJsonPaths = []
  const parsed = deepParseSavedObject(object, undefined, nestedJsonPaths)
  parsed.nestedJsonPaths = nestedJsonPaths.sort()

  if (object.type === 'index-pattern') {
    delete parsed.attributes.title
  }
  delete parsed.updated_at
  delete parsed.version

  return parsed
}

export const importObjects = async (version: string) => {
  const objects = await getObjects()
  const savedObjects = objects.map(({ content }) => {
    const object = JSON.parse(content) as LocalKibanaSavedObject
    if (object.type === 'index-pattern') {
      object.attributes.title = `island-*-${version}`
    }
    return stringifySavedObject(object)
  })
  return kibanaService.importSavedObjects(savedObjects.join('\n'))
}

export const syncObjects = async () => {
  const objects = await getObjects()
  await Promise.all(
    objects.map(async ({ name, content }) => {
      const object = JSON.parse(content)
      const data = await kibanaService.findSavedObject(object.id, object.type)

      const parsedData = parseSavedObject(data)
      const sortedKeys = assembleNestedKeys(parsedData).sort()

      return writeFile(
        path.join(kibanaObjects, name),
        JSON.stringify(parsedData, sortedKeys, 2),
      )
    }),
  )
}
