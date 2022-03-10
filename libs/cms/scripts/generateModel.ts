import { ContentType, Field } from 'contentful'
import upperFirst from 'lodash/upperFirst'

import {
  getLinkContentTypes,
  getFirstLevelContentType,
  Args,
} from './contentType'
import { Imports } from './generateFile'

export const pushOnce = (key: string, array: string[]) => {
  if (array.includes(key)) {
    return array
  }

  array.push(key)
}

const contentfulTypeToTsType = (
  field: Field,
  imports: Imports,
): [string, string | null] => {
  switch (field.type) {
    case 'Object': {
      return ['Record<string, any>', null]
    }

    case 'Location': {
      return ['{ lat: string; lon: string }', null]
    }

    case 'Date': {
      return ['string', null]
    }

    case 'Boolean': {
      return ['boolean', null]
    }

    case 'Integer':
    case 'Number': {
      pushOnce('Int', imports.nestjs)

      return ['number', 'Int']
    }

    case 'Symbol':
    case 'Text':
    case 'RichText': {
      // TODO: Is that a weak assumption?
      if (field.name === 'id') {
        pushOnce('ID', imports.nestjs)

        return ['string', 'ID']
      }

      return ['string', null]
    }

    case 'Link': {
      // TODO: Why picking only the first element
      const type = getFirstLevelContentType(field.validations).map(
        upperFirst,
      )?.[0]

      if (field.linkType === 'Asset') {
        /**
         * Looks like we never use the Asset type from contentful but always map through the mapImage function
         *
         * pushOnce('Asset', imports.contentful)
         * return ['Asset', 'Asset]
         */

        return ['Image', null]
      }

      return [type, type]
    }

    case 'Array': {
      const types = getFirstLevelContentType(field.items!.validations).map(
        upperFirst,
      )

      // If validations is empty, it means we are having an array of string
      if (types.length <= 0 && !field.items!.linkType) {
        return [`Array<string>`, `[String]`]
      }

      if (field.items!.linkType === 'Asset') {
        return ['Array<Image>', '[Image]']
      }

      return [
        `Array<${types.map((type) => `${type}`).join(' | ')}>`,
        `[${types.map((type) => type).join(',')}]`,
      ]
    }

    default: {
      return [field.type, field.type]
    }
  }
}

const generateFields = (fields: Field[], imports: Imports): string => {
  return `${fields
    .map((field) => {
      const [typeDef, typeRet] = contentfulTypeToTsType(field, imports)

      const fieldsArgs = [
        typeRet && `() => ${typeRet}`,
        !typeDef.includes('Array<')
          ? !field.required && '{ nullable: true }'
          : '',
      ].filter(Boolean)

      return `
        @Field(${fieldsArgs.join(', ')})
        ${field.id}${field.required ? '' : '?'}: ${typeDef}`
    })
    .join('\n\n  ')}`
}

export const getModel = (
  contentType: ContentType,
  args: Args,
  imports: Imports,
) => {
  if (args.sys.some((item) => item === 'id')) {
    pushOnce('ID', imports.nestjs)
  }

  const linkTypes = getLinkContentTypes(contentType)
  const fields = generateFields(contentType.fields, imports)

  const sysFields =
    args.sys.length > 0
      ? `
    ${args.sys
      .map(
        (item) => `
    @Field(${item === 'id' ? '() => ID' : ''})
      ${item}: string
    `,
      )
      .join('\n')}`
      : ''

  const graphqlImports = `
    import { Field, ObjectType${imports.nestjs
      .map((name, index) => `${index === 0 ? ', ' : ' '}${name}`)
      .join(',')} } from '@nestjs/graphql'`

  const contentfulImports =
    imports.contentful.length > 0
      ? `import { ${imports.contentful.map(
          (name) => name,
        )} } from 'contentful'\n`
      : ''

  // We don't import the model within itself
  const linkContentTypes = linkTypes.filter(
    (type) => type !== contentType.sys.id,
  )

  return {
    sysFields,
    fields,
    graphqlImports,
    contentfulImports,
    linkContentTypes,
  }
}
