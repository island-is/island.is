import { z } from 'zod'

const parseValidationToZod = (validation: any) => {
  if (validation.isRequired) {
    return z.string().nonempty(validation.message)
  }

  if (validation.isEmail) {
    return z.string().email(validation.message)
  }

  if (validation.minLength || validation.maxLength) {
    let field = z.string()
    if (validation.minLength) {
      field = field.min(validation.minLength, validation.message)
    }
    if (validation.maxLength) {
      field = field.max(validation.maxLength, validation.message)
    }
    return field
  }

  if (validation.minValue || validation.maxValue) {
    let field = z.number()
    if (validation.minValue) {
      field = field.min(validation.minValue, validation.message)
    }
    if (validation.maxValue) {
      field = field.max(validation.maxValue, validation.message)
    }
    return field
  }

  if (validation.isURL) {
    return z.string().url({ message: validation.message })
  }

  if (validation.pattern) {
    return z.string().regex(new RegExp(validation.pattern), validation.message)
  }

  if (validation.allowedValues) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.log(validation.allowedValues)
    return z.enum(validation.allowedValues)
  }

  // Return null if no valid validation is found
  return null
}

export const generateZodSchema = (formJson: any) => {
  const schema: { [key: string]: any } = {}

  const recurseChildren = (children: any) => {
    children.forEach((child: any) => {
      if (child.validation) {
        const fieldSchema = parseValidationToZod(child.validation)
        if (fieldSchema) {
          schema[child.id] = fieldSchema
        }
      }

      if (child.children) {
        recurseChildren(child.children)
      }
    })
  }

  recurseChildren(formJson.children)
  console.log(schema)
  return z.object(schema)
}
