import { Box, Checkbox, Icon, Stack, Text } from '@island.is/island-ui/core'
import { useApplicationContext } from '../../../../context/ApplicationProvider'
import { webMessages } from '@island.is/form-system/ui'
import { useIntl } from 'react-intl'
import { Markdown } from '@island.is/shared/components'

interface Props {
  setExternalDataAgreement: (value: boolean) => void
}

export const ExternalData = ({ setExternalDataAgreement }: Props) => {
  const { state } = useApplicationContext()
  const { application } = state
  const { certificationTypes } = application
  const { formatMessage } = useIntl()

  return (
    <Box>
      <Box marginTop={2} marginBottom={5}>
        <Box marginBottom={5}>
          <Text variant="h2">Gagnaöflun</Text>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flexStart">
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">
            {formatMessage(webMessages.externalDataTitle)}
          </Text>
        </Box>
      </Box>

      <Box marginBottom={5}>
        <Stack space={2}>
          <div>
            <Text variant="h4" color="blue400">
              {formatMessage(webMessages.icelandicRegistryTitle)}
            </Text>
            <Markdown>
              {formatMessage(webMessages.icelandicRegistryDescription)}
            </Markdown>
          </div>
          <div>
            <Text variant="h4" color="blue400">
              {formatMessage(webMessages.myPagesTitle)}
            </Text>
            <Markdown>{formatMessage(webMessages.myPagesDescription)}</Markdown>
          </div>

          {certificationTypes?.map((certificationType) => (
            <div key={certificationType?.id}>
              <Text variant="h4" color="blue400">
                {certificationType?.certificationTypeId}
              </Text>
              <Markdown>{certificationType?.id ?? ''}</Markdown>
            </div>
          ))}
        </Stack>
      </Box>
      <Checkbox
        large={true}
        backgroundColor="blue"
        label={formatMessage(webMessages.externalDataAgreement)}
        onChange={(event) => setExternalDataAgreement(event.target.checked)}
      />
    </Box>
  )
}
