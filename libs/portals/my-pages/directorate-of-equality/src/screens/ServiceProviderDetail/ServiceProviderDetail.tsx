import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { DirectorateOfEqualityServiceProvider } from '@island.is/api/schema'
import { toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatNationalId,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { getServiceProviderCardText } from '../../lib/cardText'
import { NAMESPACE } from '../../lib/constants'
import { focusAfterClose } from '../../lib/focus'
import { messages } from '../../lib/messages'
import { DirectorateOfEqualityPaths } from '../../lib/paths'
import { ConfirmRevokeModal } from '../../components/ConfirmRevokeModal/ConfirmRevokeModal'
import { DirectorateOfEqualityServiceProvidersDocument } from '../ServiceProviders/ServiceProviders.generated'
import {
  useDirectorateOfEqualityRevokeServiceProviderMutation,
  useDirectorateOfEqualityServiceProviderDetailQuery,
} from './ServiceProviderDetail.generated'

const ServiceProviderDetail = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { id } = useParams() as { id: string }
  const { data, loading, error } =
    useDirectorateOfEqualityServiceProviderDetailQuery()
  const provider = data?.directorateOfEqualityServiceProviders?.items.find(
    (item) => item.id === id,
  )
  const [revokeTarget, setRevokeTarget] =
    useState<DirectorateOfEqualityServiceProvider | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const [revokeProvider, { loading: revoking }] =
    useDirectorateOfEqualityRevokeServiceProviderMutation({
      refetchQueries: [{ query: DirectorateOfEqualityServiceProvidersDocument }],
      awaitRefetchQueries: true,
      onCompleted: (result) => {
        if (!result.revokeDirectorateOfEqualityServiceProvider.success) {
          toast.error(formatMessage(messages.mutationError))
          return
        }
        toast.success(formatMessage(messages.serviceProviderDeleted))
        navigate(DirectorateOfEqualityPaths.ServiceProviders, { replace: true })
      },
      onError: () => toast.error(formatMessage(messages.mutationError)),
    })

  return (
    <IntroWrapper
      desktopContentSpan="10/12"
      title={formatMessage(coreMessages.equalityServiceProvider)}
      intro={provider?.name ?? revokeTarget?.name}
      loading={loading}
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : !loading && !provider && !revokeTarget ? (
        <Problem type="not_found" noBorder={false} />
      ) : (
        <InfoLineStack label={messages.information}>
          <InfoLine
            label={messages.serviceProviderGrantedTo}
            content={provider?.name}
            loading={loading}
          />
          <InfoLine
            label={coreMessages.natreg}
            content={
              provider ? formatNationalId(provider.nationalId) : undefined
            }
            loading={loading}
          />
          <InfoLine
            label={messages.serviceProviderGrantedBy}
            content={provider?.grantedByName ?? '–'}
            loading={loading}
          />
          <InfoLine
            label={coreMessages.status}
            content={formatMessage(messages.active)}
            loading={loading}
            button={{
              type: 'action',
              variant: 'text',
              icon: 'trash',
              label: messages.deleteServiceProvider,
              action: () => {
                if (!provider) return
                triggerRef.current = document.activeElement as HTMLElement
                setRevokeTarget(provider)
              },
            }}
          />
        </InfoLineStack>
      )}
      {revokeTarget && (
        <ConfirmRevokeModal
          id="directorate-of-equality-revoke-provider"
          title={formatMessage(messages.deleteServiceProviderConfirmTitle)}
          text={formatMessage(messages.deleteServiceProviderConfirmText)}
          summary={{
            heading: revokeTarget.name,
            ...getServiceProviderCardText(revokeTarget, formatMessage),
          }}
          confirmLabel={formatMessage(messages.deleteServiceProvider)}
          loading={revoking}
          onConfirm={() =>
            revokeProvider({ variables: { input: { id: revokeTarget.id } } })
          }
          onClose={() => {
            setRevokeTarget(null)
            focusAfterClose(triggerRef.current)
          }}
        />
      )}
    </IntroWrapper>
  )
}

export default ServiceProviderDetail
