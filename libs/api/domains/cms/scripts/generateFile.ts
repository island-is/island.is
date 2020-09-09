import { ContentType } from 'contentful'
import { upperFirst } from 'lodash'
import { writeFileSync } from 'fs'

import { getModel } from './generateModel'
import { getMapper } from './generateMapper'

export interface Imports {
  nestjs: string[]
  contentful: string[]
  mappers: string[]
  apollo: string[]
  slices: string[]
}

export const generateFile = (contentType: ContentType) => {
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
    fields,
  } = getModel(contentType, imports)
  const {
    contentfulTypesImports,
    apolloImports,
    mapperImports,
    mapper,
    mapperSlice,
  } = getMapper(contentType, imports)

  const genericImports = mapperImports
    .filter((name) => name === 'mapImage')
    .map(
      (name) => `import { ${name} } from '../mappers'
      import { Image } from './image.model'`,
    )

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
      ${fields}
    }

    ${mapperSlice}
    ${mapper}
  `

  writeFileSync(`libs/api/domains/cms/src/lib/models/${id}.model.ts`, data)
}
