import { FieldMiddleware, NextFn, MiddlewareContext } from '@nestjs/graphql'

export const maskOutFieldsMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { info } = ctx
  const { extensions } = info.parentType

  if (extensions) {
    const { validateIf = (_) => true, validFields } = extensions

    if (
      validateIf(ctx) &&
      extensions?.validFields &&
      !extensions.validFields.includes(info.fieldName)
    ) {
      return null
    }
  }

  return next()
}
