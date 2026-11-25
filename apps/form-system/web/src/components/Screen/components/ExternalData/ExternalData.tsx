import { m } from '@island.is/form-system/ui'
import {
  AlertMessage,
  Box,
  Checkbox,
  Icon,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import { useIntl } from 'react-intl'
import { useApplicationContext } from '../../../../context/ApplicationProvider'

interface Props {
  disabled: boolean
  setExternalDataAgreement: (value: boolean) => void
  notificationError?: {
    hasError?: boolean
    title?: { is?: string; en?: string }
    message?: { is?: string; en?: string }
  }
  operationSuccessful?: boolean
}

export const ExternalData = ({
  disabled,
  setExternalDataAgreement,
  notificationError,
  operationSuccessful,
}: Props) => {
  const { state } = useApplicationContext()
  const { application } = state
  const { lang } = useLocale()
  const { certificationTypes } = application
  const { formatMessage } = useIntl()
  const additionalPremises = application.sectionInfo?.additionalPremises || []

  return (
    <Box>
      {notificationError?.hasError && !operationSuccessful && (
        <Box marginBottom={[4, 4, 5]}>
          <AlertMessage
            type="error"
            title={notificationError.title?.[lang]}
            message={
              <Text variant="small" whiteSpace="breakSpaces">
                {notificationError.message?.[lang]}
              </Text>
            }
          />
        </Box>
      )}
      <Box marginTop={2} marginBottom={5}>
        <Box marginBottom={5}>
          <Text variant="h2">{formatMessage(m.externalDataHeader)}</Text>
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
          <Text variant="h4">{formatMessage(m.externalDataTitle)}</Text>
        </Box>
      </Box>

      <Box marginBottom={5}>
        <Stack space={2}>
          <div>
            <Text variant="h4" color="blue400">
              {formatMessage(m.icelandicRegistryTitle)}
            </Text>
            <Markdown>{formatMessage(m.icelandicRegistryDescription)}</Markdown>
          </div>
          <div>
            <Text variant="h4" color="blue400">
              {formatMessage(m.myPagesTitle)}
            </Text>
            <Markdown>{formatMessage(m.myPagesDescription)}</Markdown>
          </div>

          {certificationTypes?.map((certificationType) => (
            <div key={certificationType?.id}>
              <Text variant="h4" color="blue400">
                {certificationType?.certificationTypeId}
              </Text>
              <Markdown>{certificationType?.id ?? ''}</Markdown>
            </div>
          ))}
          {additionalPremises.map((premise, index) => (
            <div key={index}>
              <Text variant="h4" color="blue400">
                {premise.title[lang]}
              </Text>
              <Markdown>{premise.description[lang] ?? ''}</Markdown>
            </div>
          ))}
        </Stack>
      </Box>
      {operationSuccessful && notificationError?.hasError && (
        <Box marginBottom={3}>
          <AlertMessage
            type="warning"
            title={notificationError.title?.[lang]}
            message={
              <Text variant="small" whiteSpace="breakSpaces">
                {notificationError.message?.[lang]}
              </Text>
            }
          />
        </Box>
      )}
      <Checkbox
        large={true}
        backgroundColor="blue"
        label={formatMessage(m.externalDataAgreement)}
        disabled={disabled}
        onChange={(event) => setExternalDataAgreement(event.target.checked)}
      />
    </Box>
  )
}
