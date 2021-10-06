import { ContentType } from 'contentful'
import upperFirst from 'lodash/upperFirst'
import { writeFileSync, existsSync } from 'fs'

import { getModel } from './generateModel'
import { getMapper } from './generateMapper'
import { Args } from './contentType'

export interface Imports {
  nestjs: string[]
  contentful: string[]
  mappers: string[]
  apollo: string[]
  slices: string[]
}

export const generateFile = (
  contentType: ContentType,
  args: Args,
  array: string[],
) => {
  const { id } = contentType.sys
  const imports: Imports = {
    nestjs: [],
    contentful: [],
    mappers: [],
    apollo: [],
    slices: [],
  }
  const {
    graphqlImports,
    contentfulImports,
    linkContentTypes,
    sysFields,
    fields,
  } = getModel(contentType, args, imports)
  const {
    contentfulTypesImports,
    apolloImports,
    mapperImports,
    mapper,
    mapperSlice,
  } = getMapper(contentType, args, imports)

  const genericImports = mapperImports
    .filter((name) => name === 'mapImage')
    .map(() => `import { Image, mapImage } from './image.model'`)

  const linkContentTypesImports = linkContentTypes
    .map((type) => {
      const mapName = mapperImports.find(
        (name) => name === `map${upperFirst(type)}`,
      )

      return `import { ${upperFirst(type)}${
        mapName ? `, ${mapName}` : ''
      } } from './${type}.model'`
    })
    .join('\n')

  const data = `
    ${graphqlImports}
    ${apolloImports}
    ${contentfulImports}

    ${contentfulTypesImports}
    ${genericImports}
    ${linkContentTypesImports}

    @ObjectType()
    export class ${upperFirst(id)} {
      ${sysFields}
      ${fields}
    }

    ${mapperSlice}
    ${mapper}
  `

  const path = `libs/cms/src/lib/models/${id}.model.ts`

  if (!args.overwrite && existsSync(path)) {
    // We don't overwrite models that already exists unless we specify the overwrite boolean as true
    return
  }

  array.push(id)

  writeFileSync(path, data)
}
