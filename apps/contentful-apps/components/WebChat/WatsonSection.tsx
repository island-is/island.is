import { type FieldExtensionSDK } from '@contentful/app-sdk'
import { JsonEditor } from '@contentful/field-editor-json'

interface SectionProps {
  sdk: FieldExtensionSDK
}

export const WatsonSection = ({ sdk }: SectionProps) => {
  return <JsonEditor isInitiallyDisabled={false} field={sdk.field} />
}
