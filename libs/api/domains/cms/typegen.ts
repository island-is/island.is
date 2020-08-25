const path = require('path')
const upperFirst = require('lodash/upperFirst')
const camelcase = require('lodash/camelcase')

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
  return `
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ${upperFirst(contentType.sys.id)} {
  @Field(() => ID)
  id: string

  @Field()
  createdAt: string

  @Field()
  updatedAt: string

  ${contentType.fields.map(generateModelField).join('\n\n  ')}
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
  const typeName = upperFirst(camelcase(contentType.sys.id))

  const sysFields = [
    'id: sys.id',
    'createdAt: sys.createdAt',
    'updatedAt: sys.updatedAt',
  ]

  const fields = contentType.fields
    .map((field) => {
      let value = `fields.${field.id}`
      const mapperName = validationToMapperFunction(field)
      if (field.type === 'Array' && field.items?.type === 'Link') {
        value = mapperName && `${value}.map(${mapperName})`
      } else if (field.type === 'Link') {
        value = mapperName && `${mapperName}(${value})`
      }

      if (value) {
        return `${field.id}: ${value},`
      } else {
        console.warn(
          `no mapper created for ${contentType.sys.id}.${field.id} since it has no type validation`,
        )
      }
    })
    .filter(Boolean)

  return `
import ${typeName} from './lib/models/${contentType.sys.id}.model'

const map${typeName} = ({ fields, sys }: types.I${typeName}>): ${typeName} => ({
  ${[].concat(sysFields, fields).join('\n  ')}
})
  `.trim()
}

const stdin = process.openStdin()

let input = ''
stdin.on('data', (chunk) => {
  input += chunk
})

stdin.on('end', () => {
  const contentType = JSON.parse(input)

  console.log(
    `// create file libs/api/domains/cms/src/lib/models/${contentType.sys.id}.models.ts`,
  )
  console.log(generateModel(contentType))

  console.log(`\n// append to libs/api/domains/cms/src/lib/mappers.ts`)
  console.log(generateMapperFunction(contentType))
})
