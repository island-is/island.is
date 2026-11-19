import { FieldMapper } from './types'
import { asResolvableFormText } from './utils'

export const mapPdfLinkButtonField: FieldMapper = (
  component,
  raw,
  { resolver },
) => {
  component.pdfDescription = resolver.resolve(
    asResolvableFormText(raw.verificationDescription),
  )
  component.pdfLinkTitle = resolver.resolve(
    asResolvableFormText(raw.verificationLinkTitle),
  )
  component.pdfLinkUrl = resolver.resolve(
    asResolvableFormText(raw.verificationLinkUrl),
  )
}
