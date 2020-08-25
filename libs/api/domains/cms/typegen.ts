const path = require('path')
const upperFirst = require('lodash/upperFirst')

const getLinkContentTypes = (validations): string[] => {
  const types =
    validations.map((v) => v.linkContentType).filter(Boolean)[0] ?? []
  return types.map(upperFirst)
}

const contentfulTypeToTsType = (field: any): [string, string | null] => {
  switch (field.type) {
    case 'Symbol': {
      return ['string', null]
    }
    case 'Link': {
      const t = getLinkContentTypes(field.validations)[0]
      return [t, t]
    }
    case 'Array': {
      const t = getLinkContentTypes(field.items.validations)[0]
      return [`Array<typeof ${t}>`, `[${t}]`]
    }
    default: {
      return [field.type, field.type]
    }
  }
}

const generateModelField = (field: any): string => {
  const [typeDef, typeRet] = contentfulTypeToTsType(field)
  const fieldsArgs = [
    typeRet && `() => ${typeRet}`,
    !field.required && '{ nullable: true }',
  ].filter(Boolean)

  return `
  @Field(${fieldsArgs.join(', ')})
  ${field.id}${field.required ? '' : '?'}: ${typeDef}
  `.trim()
}

const generateModel = (contentType: any): string => {
  const fields = contentType.fields.map(generateModelField)

  return `
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ${upperFirst(contentType.sys.id)} {
  @Field()
  id: string

  @Field
  createdAt: string

  @Field
  updatedAt: string

  ${fields.join('\n\n  ')}
}
  `.trim()
}

const generateContentfulType = (contentType: any): string => {
  const fields = contentType.fields.map((field) => {
    return `
  ${field.id}${field.required ? '' : '?'}: ${contentfulTypeToTsType(field)[0]}
    `.trim()
  })

  return `
interface ${upperFirst(contentType.sys.id)} {
  ${fields.join('\n  ')}
}
  `.trim()
}

const validationToMapperFunction = (field): string => {
  if (field.type === 'Array') {
    field = field.items
  }

  if (field.linkType === 'Asset') {
    // only asset type we know how to handle atm is an image
    return 'mapImage'
  }

  const validations =
    (field.validations ?? [])
      .map((v) => v.linkContentType)
      .filter(Boolean)[0] ?? []

  switch (validations.length) {
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

const generateMapperFunction = (contentType: any): string => {
  const typeName = upperFirst(contentType.sys.id)

  const sysFields = [
    'id: entry.sys.id',
    'createdAt: entry.sys.createdAt',
    'updatedAt: entry.sys.updatedAt',
  ]

  const fields = contentType.fields.map((field) => {
    let value = `entry.fields.${field.id}`
    const mapperName = validationToMapperFunction(field)
    if (field.type === 'Array' && field.items?.type === 'Link') {
      value = mapperName && `${value}.map(${mapperName})`
    } else if (field.type === 'Link') {
      value = mapperName && `${mapperName}(${value})`
    }

    if (value) {
      return `${field.id}: ${value},`
    } else {
      console.warn(`no mapper created for ${contentType.sys.id}.${field.id} since it has no type validation`)
    }
  }).filter(Boolean)

  return `
import ${typeName}Model from './lib/models/${contentType.sys.id}.model'

const map${typeName} = (entry: Entry<${typeName}>): ${typeName}Model => {
  return {
    ${[].concat(sysFields, fields).join('\n    ')}
  }
}
  `.trim()
}

const stdin = process.openStdin()

let input = ''
stdin.on('data', (chunk) => {
  input += chunk
})

stdin.on('end', () => {
  const data = JSON.parse(input)
  const contentTypes = data.contentTypes ?? [data]

  switch (process.argv[2] ?? 'new-type') {
    case 'new-type': {
      console.log('// append to libs/api/domains/cms/src/lib/contentfulTypes.ts')
      console.log(generateContentfulType(data))
      console.log(`\n// create file libs/api/domains/cms/src/lib/models/${data.sys.id}.models.ts`)
      console.log(generateModel(data))
      console.log(`\n// append to libs/api/domains/cms/src/lib/mappers.ts`)
      console.log(generateMapperFunction(data))
    }
    case 'contentful-types': {
      console.log(contentTypes.map(generateContentfulType).join('\n\n'))
    }
  }
})
