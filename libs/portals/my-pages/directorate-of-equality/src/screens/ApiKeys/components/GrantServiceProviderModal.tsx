import { useState } from 'react'

import {
  Bullet,
  BulletList,
  Box,
  InputError,
  RadioButton,
  SkeletonLoader,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatNationalId,
  m as coreMessages,
  Modal,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { messages } from '../../../lib/messages'
import {
  useDirectorateOfEqualityAvailableServiceProvidersQuery,
  useDirectorateOfEqualityGrantServiceProviderMutation,
} from '../../../mocks/hooks'

export const GrantServiceProviderModal = ({
  onClose,
  onGranted,
}: {
  onClose: () => void
  onGranted: () => void
}) => {
  const { formatMessage } = useLocale()
  const [selected, setSelected] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)
  const {
    data,
    loading,
    error,
  } = useDirectorateOfEqualityAvailableServiceProvidersQuery()
  const providers =
    data?.directorateOfEqualityAvailableServiceProviders.items ?? []
  const [
    grant,
    { loading: granting },
  ] = useDirectorateOfEqualityGrantServiceProviderMutation({
    onCompleted: (result) => {
      if (!result.directorateOfEqualityGrantServiceProvider.success) {
        toast.error(formatMessage(messages.mutationError))
        return
      }
      onGranted()
    },
    onError: () => toast.error(formatMessage(messages.mutationError)),
  })

  const handleConfirm = () => {
    if (!selected) {
      setShowError(true)
      return
    }
    grant({ variables: { input: { nationalId: selected } } })
  }

  return (
    <Modal
      id="directorate-of-equality-grant"
      label={formatMessage(messages.grantTitle)}
      title={formatMessage(messages.grantTitle)}
      text={formatMessage(messages.grantText)}
      onCloseModal={onClose}
      buttonsSpacing="spaceBetween"
      buttons={[
        {
          id: 'directorate-of-equality-grant-cancel',
          type: 'ghost',
          text: formatMessage(coreMessages.buttonCancel),
          onClick: onClose,
        },
        {
          id: 'directorate-of-equality-grant-confirm',
          type: 'primary',
          text: formatMessage(messages.grantConfirm),
          loading: granting,
          onClick: handleConfirm,
        },
      ]}
    >
      <Box background="blue100" borderRadius="large" padding={3}>
        <Text fontWeight="semiBold">
          {formatMessage(messages.grantPermissionsTitle)}
        </Text>
        <Box marginTop={2}>
          <BulletList space={1}>
            <Bullet>{formatMessage(messages.grantPermissionSubmit)}</Bullet>
            <Bullet>{formatMessage(messages.grantPermissionRead)}</Bullet>
            <Bullet>{formatMessage(messages.grantPermissionScoring)}</Bullet>
          </BulletList>
        </Box>
      </Box>
      <Box marginTop={4}>
        <Text
          variant="h5"
          as="h3"
          id="grant-service-provider-label"
          marginBottom={2}
        >
          {formatMessage(messages.serviceProvider)}
        </Text>
        {loading && <SkeletonLoader height={72} repeat={2} space={2} />}
        {!loading && error && <Problem error={error} noBorder={false} />}
        {!loading && !error && providers.length === 0 && (
          <Text>{formatMessage(messages.noAvailableServiceProviders)}</Text>
        )}
        {!loading && !error && providers.length > 0 && (
          <div
            role="radiogroup"
            aria-labelledby="grant-service-provider-label"
            aria-invalid={showError || undefined}
            aria-describedby={
              showError ? 'grant-service-provider-error' : undefined
            }
          >
            <Stack space={2}>
              {providers.map((provider) => (
                <RadioButton
                  key={provider.nationalId}
                  id={`grant-service-provider-${provider.nationalId}`}
                  name="grant-service-provider"
                  value={provider.nationalId}
                  label={provider.name}
                  subLabel={formatMessage(messages.nationalIdLine, {
                    nationalId: formatNationalId(provider.nationalId),
                  })}
                  checked={selected === provider.nationalId}
                  onChange={() => {
                    setSelected(provider.nationalId)
                    setShowError(false)
                  }}
                  large
                  backgroundColor="blue"
                />
              ))}
            </Stack>
          </div>
        )}
        <div role="alert">
          {showError && (
            <Box marginTop={1}>
              <InputError
                id="grant-service-provider-error"
                errorMessage={formatMessage(
                  messages.selectServiceProviderError,
                )}
              />
            </Box>
          )}
        </div>
      </Box>
    </Modal>
  )
}
