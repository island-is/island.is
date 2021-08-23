import { ContentType, Field } from 'contentful'
import uniq from 'lodash/uniq'
import upperFirst from 'lodash/upperFirst'

import { Imports } from './generateFile'
import { getFirstLevelContentType, Args } from './contentType'
import { pushOnce } from './generateModel'

const validationsToMapperFunction = (
  validations?: string[],
): string | undefined => {
  switch (validations?.length) {
    case undefined:
    case 0:
      return

    case 1:
      return 'map' + upperFirst(validations[0])

    default:
      // Probably a Slice type - if not it must be fixed afterwards
      return 'mapSlice'
  }
}

const contentfulTypeToMap = (field: Field, imports: Imports) => {
  const value = `fields.${field.id}`
  const items = getFirstLevelContentType(
    field?.items?.validations ?? field?.validations ?? [],
  )
  const mapper = validationsToMapperFunction(items)

  switch (field.type) {
    case 'Integer':
    case 'Number': {
      return {
        value,
        fallback: '0',
      }
    }

    case 'RichText': {
      const base = `JSON.stringify(${value})`

      return {
        value: field.required ? `${base}` : `${value} && ${base}`,
        fallback: 'null',
      }
    }

    case 'Array': {
      if (!field.items) {
        return {
          value: undefined,
          fallback: undefined,
        }
      }
      // When the linkType is an Entry (another document) and we have more than one, it's high chance to be a "slice" type
      if (field.items.linkType === 'Entry' && items.length > 1) {
        const base = `${value}.map(${mapper})`

        pushOnce('ApolloError', imports.apollo)

        imports.slices.push(...items)
        imports.mappers.push(...items.map((name) => `map${upperFirst(name)}`))

        return {
          value: field.required ? `${base}` : `${value} && ${base}`,
          fallback: '[]',
        }
      }

      if (field.items.linkType === 'Asset' && items.length <= 0) {
        pushOnce('mapImage', imports.mappers)

        return {
          value: `${field.required ? value : `(${value} ?? [])`}.map(mapImage)`,
          fallback: '[]',
        }
      }

      if (field.items.type === 'Symbol') {
        return {
          value,
          fallback: '[]',
        }
      }

      if (field.items.type === 'Link' && mapper) {
        pushOnce(mapper, imports.mappers)

        return {
          value: `${
            field.required ? value : `(${value} ?? [])`
          }.map(${mapper})`,
          fallback: undefined,
        }
      }

      return {
        value: undefined,
        fallback: undefined,
      }
    }

    case 'Link': {
      if (field.linkType === 'Asset') {
        pushOnce('mapImage', imports.mappers)

        return {
          value: `mapImage(${value})`,
          fallback: undefined,
        }
      }

      if (field.validations.length > 0) {
        return {
          value: `${value}?.fields`,
          fallback: undefined,
        }
      }

      return {
        value: undefined,
        fallback: undefined,
      }
    }

    default:
      return {
        value,
        fallback: `''`,
      }
  }
}

const getFields = (contentType: ContentType, imports: Imports) => {
  return contentType.fields
    .map((field) => {
      const { value, fallback } = contentfulTypeToMap(field, imports)

      if (!value) {
        console.warn(
          `No mapper created for ${contentType.sys.id}.${field.id} since it has no type validation`,
        )
      }

      return `${field.id}: ${value} ${
        !field.required && fallback ? `?? ${fallback}` : ''
      },`
    })
    .filter(Boolean)
}

export const getMapper = (
  contentType: ContentType,
  args: Args,
  imports: Imports,
) => {
  const type = upperFirst(contentType.sys.id)
  const fields = getFields(contentType, imports)
  const sysImport = args.sys.length > 0 || fields.some((f) => f.includes('id:'))

  const contentfulTypesImports = `import { I${type}, ${imports.slices
    .map((name) => `I${upperFirst(name)}`)
    .join(',')} } from '../generated/contentfulTypes'`

  const apolloImports =
    imports.apollo.length > 0
      ? `import { ${imports.apollo.map(
          (item) => item,
        )} } from 'apollo-server-express'`
      : ''

  // We don't import the model within itself
  const mapperImports = uniq(
    imports.mappers.filter(
      (name) => name !== `map${upperFirst(contentType.sys.id)}`,
    ),
  )

  const mapperSlice =
    imports.slices.length > 0
      ? `
    const mapSlice = (slice: ${imports.slices
      .map((name) => `I${upperFirst(name)}`)
      .join('|')}) => {
      switch (slice.sys.contentType.sys.id) {
        ${imports.slices
          .map(
            (name) => `case '${name}':
          return map${upperFirst(name)}(slice as I${upperFirst(name)})`,
          )
          .join('\n')}

        default:
          throw new ApolloError(\`Cannot convert to slice: \${(slice.sys.contentType.sys as { id: string }).id}\`)
      }
    }`
      : ''

  const mapper = `
      export const map${type} = ({ fields ${
    sysImport ? ', sys' : ''
  } }: I${type}): ${type} => ({
        ${args.sys.map((item) => `${item}: sys.${item},`).join('\n  ')}
        ${fields.join('\n  ')}
      })
    `

  return {
    contentfulTypesImports,
    apolloImports,
    mapperImports,
    mapperSlice,
    mapper,
  }
}
