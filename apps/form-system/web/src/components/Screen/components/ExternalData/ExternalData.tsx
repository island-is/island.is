import { useMutation } from '@apollo/client'
import { NotificationCommands } from '@island.is/form-system/enums'
import {
  NOTIFY_EXTERNAL_SERVICE,
  removeTypename,
} from '@island.is/form-system/graphql'
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
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useApplicationContext } from '../../../../context/ApplicationProvider'

interface Props {
  disabled: boolean
  setHasValidateEligibilityNotificationError: (value: boolean) => void
  setIsValidateEligibilityNotificationLoading: (value: boolean) => void
  setExternalDataAgreement: (value: boolean) => void
}

export const ExternalData = ({
  disabled,
  setHasValidateEligibilityNotificationError,
  setIsValidateEligibilityNotificationLoading,
  setExternalDataAgreement,
}: Props) => {
  const { state, validateEligibility } = useApplicationContext()
  const { application } = state
  const { lang } = useLocale()
  const { certificationTypes } = application
  const { formatMessage } = useIntl()
  const additionalPremises = application.sectionInfo?.additionalPremises || []
  const [notifyExternal] = useMutation(NOTIFY_EXTERNAL_SERVICE)
  const hasNotified = useRef(false)
  const [isNotificationLoading, setIsNotificationLoading] = useState(false)
  const [notificationError, setNotificationError] = useState<{
    hasError?: boolean
    title?: { is?: string; en?: string }
    message?: { is?: string; en?: string }
  }>()

  useEffect(() => {
    setHasValidateEligibilityNotificationError(false)

    if (
      !validateEligibility ||
      application.submissionServiceUrl === 'zendesk' ||
      hasNotified.current
    ) {
      return
    }

    hasNotified.current = true
    setIsNotificationLoading(true)
    setIsValidateEligibilityNotificationLoading(true)

    const notify = async () => {
      try {
        const { data } = await notifyExternal({
          variables: {
            input: {
              applicationId: application.id,
              nationalId: '',
              actorNationalId: '',
              organizationNationalId: application.organizationNationalId ?? '',
              slug: application.slug,
              isTest: application.isTest,
              command: NotificationCommands.VALIDATE_ELIGIBILITY,
              screenDto: undefined,
            },
          },
        })

        const screenError = removeTypename(
          data?.notifyFormSystemExternalSystem?.screenError,
        )
        setNotificationError(screenError)
        setHasValidateEligibilityNotificationError(
          screenError?.hasError === true,
        )
      } catch (error) {
        console.error('Error notifying external service:', error)
      } finally {
        setIsNotificationLoading(false)
        setIsValidateEligibilityNotificationLoading(false)
      }
    }

    void notify()
  }, [
    application,
    notifyExternal,
    setHasValidateEligibilityNotificationError,
    setIsValidateEligibilityNotificationLoading,
    validateEligibility,
  ])

  return (
    <Box>
      {notificationError?.hasError && (
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
      <Checkbox
        large={true}
        backgroundColor="blue"
        label={formatMessage(m.externalDataAgreement)}
        disabled={disabled || isNotificationLoading}
        onChange={(event) => setExternalDataAgreement(event.target.checked)}
      />
    </Box>
  )
}
