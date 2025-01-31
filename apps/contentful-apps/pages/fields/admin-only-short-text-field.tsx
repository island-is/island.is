import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { SingleLineEditor } from '@contentful/field-editor-single-line'
import { Box, Paragraph } from '@contentful/f36-components'

const AdminOnlyShortTextField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  const value = sdk.field.getValue()

  if (!sdk.user.spaceMembership.admin) {
    return (
      <Box>
        <Paragraph>{value}</Paragraph>
        <Paragraph>(Only admins can edit this field)</Paragraph>
      </Box>
    )
  }

  return <SingleLineEditor field={sdk.field} locales={sdk.locales} />
}

export default AdminOnlyShortTextField
