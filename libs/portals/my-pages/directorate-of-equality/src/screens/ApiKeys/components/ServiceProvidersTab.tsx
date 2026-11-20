import { useRef, useState } from 'react'

import {
  Box,
  Button,
  ProblemTemplate,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { DirectorateOfEqualityServiceProvider } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { ActionCardLoader } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { focusAfterClose } from '../../../lib/focus'
import { messages } from '../../../lib/messages'
import {
  useDirectorateOfEqualityRevokeServiceProviderMutation,
  useDirectorateOfEqualityServiceProvidersQuery,
} from './ServiceProvidersTab.generated'
import { ConfirmRevokeModal } from './ConfirmRevokeModal'
import { GrantServiceProviderModal } from './GrantServiceProviderModal'
import { ServiceProviderCard } from './ServiceProviderCard'

export const ServiceProvidersTab = () => {
  const { formatMessage } = useLocale()
  const [grantSession, setGrantSession] = useState<number | null>(null)
  const grantSessionRef = useRef<number | null>(null)
  const grantSessionCount = useRef(0)
  const [revokeTarget, setRevokeTarget] =
    useState<DirectorateOfEqualityServiceProvider | null>(null)
  const grantButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const { data, loading, error, refetch } =
    useDirectorateOfEqualityServiceProvidersQuery()
  const [revokeProvider, { loading: revoking }] =
    useDirectorateOfEqualityRevokeServiceProviderMutation({
      onCompleted: (result, options) => {
        if (!result.revokeDirectorateOfEqualityServiceProvider.success) {
          toast.error(formatMessage(messages.mutationError))
          return
        }
        toast.success(formatMessage(messages.serviceProviderRevoked))
        refetch()
        if (revokeTarget?.id === options?.variables?.input.id) {
          setRevokeTarget(null)
          focusAfterClose(grantButtonRef.current)
        }
      },
      onError: () => toast.error(formatMessage(messages.mutationError)),
    })
  const providers = data?.directorateOfEqualityServiceProviders?.items ?? []

  const openGrant = () => {
    grantSessionCount.current += 1
    grantSessionRef.current = grantSessionCount.current
    setGrantSession(grantSessionCount.current)
  }

  const closeGrant = () => {
    grantSessionRef.current = null
    setGrantSession(null)
    focusAfterClose(grantButtonRef.current)
  }

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
          onClick={openGrant}
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
                key={provider.id}
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
      {grantSession !== null && (
        <GrantServiceProviderModal
          key={grantSession}
          onClose={closeGrant}
          onGranted={() => {
            toast.success(formatMessage(messages.serviceProviderGranted))
            refetch()
            if (grantSessionRef.current === grantSession) {
              closeGrant()
            }
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
              variables: { input: { id: revokeTarget.id } },
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
