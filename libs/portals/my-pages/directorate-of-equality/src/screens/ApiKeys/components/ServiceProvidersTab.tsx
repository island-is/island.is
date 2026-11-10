import { useRef, useState } from 'react'

import {
  Box,
  Button,
  ProblemTemplate,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ActionCardLoader } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { focusAfterClose } from '../../../lib/focus'
import { messages } from '../../../lib/messages'
import {
  useDirectorateOfEqualityRevokeServiceProviderMutation,
  useDirectorateOfEqualityServiceProvidersQuery,
} from '../../../mocks/hooks'
import { DirectorateOfEqualityServiceProvider } from '../../../mocks/types'
import { ConfirmRevokeModal } from './ConfirmRevokeModal'
import { GrantServiceProviderModal } from './GrantServiceProviderModal'
import { ServiceProviderCard } from './ServiceProviderCard'

export const ServiceProvidersTab = () => {
  const { formatMessage } = useLocale()
  const [grantOpen, setGrantOpen] = useState(false)
  const [
    revokeTarget,
    setRevokeTarget,
  ] = useState<DirectorateOfEqualityServiceProvider | null>(null)
  const grantButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const {
    data,
    loading,
    error,
    refetch,
  } = useDirectorateOfEqualityServiceProvidersQuery()
  const [
    revokeProvider,
    { loading: revoking },
  ] = useDirectorateOfEqualityRevokeServiceProviderMutation({
    onCompleted: (result) => {
      if (!result.directorateOfEqualityRevokeServiceProvider.success) {
        toast.error(formatMessage(messages.mutationError))
        return
      }
      setRevokeTarget(null)
      toast.success(formatMessage(messages.serviceProviderRevoked))
      refetch()
      focusAfterClose(grantButtonRef.current)
    },
    onError: () => toast.error(formatMessage(messages.mutationError)),
  })
  const providers = data?.directorateOfEqualityServiceProviders.items ?? []

  return (
    <Box paddingTop={4}>
      <Text variant="h4" as="h2">
        {formatMessage(messages.serviceProvidersTitle)}
      </Text>
      <Text marginTop={2}>{formatMessage(messages.serviceProvidersIntro)}</Text>
      <Box display="flex" justifyContent="flexEnd" marginTop={4}>
        <Button
          ref={grantButtonRef}
          size="small"
          icon="add"
          onClick={() => setGrantOpen(true)}
        >
          {formatMessage(messages.grantServiceProvider)}
        </Button>
      </Box>
      <Box marginTop={4}>
        {loading && <ActionCardLoader repeat={2} />}
        {!loading && error && <Problem error={error} noBorder={false} />}
        {!loading && !error && providers.length === 0 && (
          <ProblemTemplate
            variant="info"
            tag={formatMessage(messages.serviceProviderTag)}
            title={formatMessage(messages.noServiceProvidersTitle)}
            message={formatMessage(messages.noServiceProvidersMessage)}
            imgSrc="./assets/images/nodata.svg"
            titleAs="h3"
          />
        )}
        {!loading && !error && providers.length > 0 && (
          <Stack space={2}>
            {providers.map((provider) => (
              <ServiceProviderCard
                key={provider.nationalId}
                provider={provider}
                onRevoke={(target, trigger) => {
                  triggerRef.current = trigger
                  setRevokeTarget(target)
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
      {grantOpen && (
        <GrantServiceProviderModal
          onClose={() => {
            setGrantOpen(false)
            focusAfterClose(grantButtonRef.current)
          }}
          onGranted={() => {
            setGrantOpen(false)
            toast.success(formatMessage(messages.serviceProviderGranted))
            refetch()
            focusAfterClose(grantButtonRef.current)
          }}
        />
      )}
      {revokeTarget && (
        <ConfirmRevokeModal
          id="directorate-of-equality-revoke-provider"
          title={formatMessage(messages.revokeServiceProviderTitle)}
          text={formatMessage(messages.revokeServiceProviderText, {
            name: revokeTarget.name,
          })}
          confirmLabel={formatMessage(messages.revokeServiceProvider)}
          loading={revoking}
          onConfirm={() =>
            revokeProvider({
              variables: { input: { nationalId: revokeTarget.nationalId } },
            })
          }
          onClose={() => {
            setRevokeTarget(null)
            focusAfterClose(triggerRef.current)
          }}
        />
      )}
    </Box>
  )
}
