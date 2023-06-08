import { FieldMiddleware, NextFn, MiddlewareContext } from '@nestjs/graphql'

export const maskOutFieldsMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { info } = ctx
  const { extensions } = info.parentType

  if (extensions?.filterFields) {
    const { condition = () => true, fields = [] } =
      extensions.filterFields as any

    if (condition(ctx) && !fields.includes(info.fieldName)) {
      return null
    }
  }

  return next()
}
