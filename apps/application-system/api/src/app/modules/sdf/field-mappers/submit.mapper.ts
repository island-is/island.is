import { FieldMapper } from './types'
import { asResolvableFormText, resolveFieldProp } from './utils'

export const mapSubmitField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  component.placement = (raw.placement as string | undefined) ?? 'footer'
  const actions = resolveFieldProp(raw.actions, application) as
    | Array<{ event: string; name: string; type: string }>
    | undefined
  component.actions = (actions ?? []).map((a) => ({
    event: a.event ?? '',
    name:
      resolver.resolve(asResolvableFormText(a.name)) || String(a.name ?? ''),
    type: a.type ?? 'primary',
  }))
}
