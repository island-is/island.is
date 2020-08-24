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
type ${upperFirst(contentType.sys.id)} {
  ${fields.join('\n  ')}
}
  `.trim()
}

const validationToMapperFunction = (field): string => {
  const validations = (field.items?.validations ?? field.validations ?? [])
    .map((v) => v.linkContentType)
    .filter(Boolean)[0]

  switch (validations.length) {
    case 0:
      throw new Error(
        `field ${field.id} has no content type validation. ` +
          `Add content type validation to this field and try again`,
      )
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
    // 'createdAt: entry.sys.createdAt',
    // 'updatedAt: entry.sys.updatedAt',
  ]

  const fields = contentType.fields.map((field) => {
    let value = `entry.field.${field.id}`
    if (field.type === 'Array' && field.items?.type === 'Link') {
      value = `${value}.map(${validationToMapperFunction(field)})`
    } else if (field.type === 'Link') {
      value = `${validationToMapperFunction(field)}(${value})`
    }

    return `${field.id}: ${value},`
  })

  return `
import ${typeName}Model from './model/${contentType.sys.id}.model'

const map${typeName} = (entry: Entry<${typeName}>): ${typeName}Model => {
  if (!entry) return null

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
  const contentType = JSON.parse(input)
  const actions = [
    {
      action: 'create',
      path: path.resolve(
        __dirname,
        `lib/models/${contentType.sys.id}.model.ts`,
      ),
      content: generateModel(contentType),
    },
    {
      action: 'append',
      path: path.resolve(__dirname, `contentfulTypes.ts`),
      content: generateContentfulType(contentType),
    },
    {
      action: 'append',
      path: path.resolve(__dirname, 'mappers.ts'),
      content: generateMapperFunction(contentType),
    },
  ]

  actions.map(({ action, path, content }) => {
    console.log(`\n## ${action} ${path}`)
    console.log(content)
  })
})
