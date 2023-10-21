import { Box, ContentBlock, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import School from '../../assets/School'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

interface Name {
  fullName: string
}

export const Congratulations = ({ application }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const name = application.externalData.nationalRegistry?.data as Name

  return (
    <Box paddingTop={2}>
      <Box marginTop={2} marginBottom={5}>
        <ContentBlock>
          <AlertMessage
            type="success"
            title={`${formatText(
              m.congratulationsTitle,
              application,
              formatMessage,
            )} ${name.fullName}`}
            message={formatText(
              m.congratulationsTitleSuccess,
              application,
              formatMessage,
            )}
          />
        </ContentBlock>
      </Box>
      <School />
    </Box>
  )
}
