import { FieldMapper } from './types'
import { asResolvableFormText, resolveFieldProp } from './utils'

export const mapStaticTableField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  const header = resolveFieldProp(raw.header, application)
  const rows = resolveFieldProp(raw.rows, application)
  component.header = Array.isArray(header)
    ? header.map((h: unknown) => resolver.resolve(asResolvableFormText(h)))
    : []
  component.rows = Array.isArray(rows)
    ? rows.map((row: unknown) =>
        Array.isArray(row)
          ? row.map((c: unknown) => resolver.resolve(asResolvableFormText(c)))
          : [],
      )
    : []
}
