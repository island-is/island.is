import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { checkDelegation } from '@island.is/shared/utils'

import { m } from '../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { PortalRoute } from '../types/portalCore'
import { computeDisabledReason } from '../utils/filterNavigationTree/filterNavigationTree'
import { renderHtml } from '@island.is/island-ui/contentful'
import { useGetServicePortalPageQuery } from '../queries/ServicePortalPage.generated'
import * as css from './AccessDenied.css'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { RequestDelegationButton } from '../components/RequestDelegationButton/RequestDelegationButton'

export const AccessDenied = ({ route }: { route?: PortalRoute }) => {
  const { formatMessage, lang } = useLocale()
  const user = useUserInfo()
  const isDelegation = user && checkDelegation(user)

  const disabledReason =
    route?.disabledReason ??
    (route && user ? computeDisabledReason(user, route) : undefined)

  const isNotAvailableForActors = disabledReason === 'notAvailableForActors'

  const slug =
    disabledReason === 'notMinor'
      ? 'access-denied-not-minor'
      : isNotAvailableForActors
      ? 'access-denied-not-available-for-actors'
      : 'access-denied-default'

  const { data, loading } = useGetServicePortalPageQuery({
    variables: { input: { slug, lang } },
    skip: !isDelegation,
  })

  const delegationsMessage = data?.getServicePortalPage?.emptyStateMessage

  const showRequest = disabledReason === 'default'

  const moduleName =
    typeof route?.name === 'string'
      ? route.name
      : route?.name
      ? formatMessage(route.name)
      : ''

  const messageBody = loading ? (
    <LoadingDots />
  ) : isDelegation ? (
    delegationsMessage ? (
      renderHtml(delegationsMessage?.document)
    ) : isNotAvailableForActors ? (
      formatMessage(m.disabledReasonNotAvailableForActors, { moduleName })
    ) : (
      formatMessage(m.accessDeniedText)
    )
  ) : (
    formatMessage(m.accessNeededText)
  )

  return (
    <div className={css.container}>
      <Problem
        size="large"
        noBorder={false}
        tag={formatMessage(m.accessDenied)}
        title={
          isDelegation
            ? delegationsMessage
              ? ''
              : isNotAvailableForActors
              ? formatMessage(m.accessNotAvailableForActorsTitle)
              : formatMessage(m.accessNeeded)
            : formatMessage(m.accessDenied)
        }
        message={
          <>
            {messageBody}
            {showRequest && (
              <Box display="flex" justifyContent="center" marginTop={2}>
                <RequestDelegationButton
                  scopes={route?.requiredScopes}
                  variant="primary"
                />
              </Box>
            )}
          </>
        }
        imgSrc="./assets/images/jobsGrid.svg"
      />
    </div>
  )
}
