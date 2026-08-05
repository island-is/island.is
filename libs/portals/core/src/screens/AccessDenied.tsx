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
import { LoadingDots } from '@island.is/island-ui/core'

export const AccessDenied = ({ route }: { route?: PortalRoute }) => {
  const { formatMessage, lang } = useLocale()
  const user = useUserInfo()
  const isDelegation = user && checkDelegation(user)

  const disabledReason =
    route?.disabledReason ??
    (route && user ? computeDisabledReason(user, route) : undefined)

  const slug =
    disabledReason === 'notMinor'
      ? 'access-denied-not-minor'
      : 'access-denied-default'

  const { data, loading } = useGetServicePortalPageQuery({
    variables: { input: { slug, lang } },
    skip: !isDelegation,
  })

  const delegationsMessage = data?.getServicePortalPage?.emptyStateMessage

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
              : formatMessage(m.accessNeeded)
            : formatMessage(m.accessDenied)
        }
        message={
          loading ? (
            <LoadingDots />
          ) : isDelegation ? (
            delegationsMessage ? (
              renderHtml(delegationsMessage?.document)
            ) : (
              formatMessage(m.accessDeniedText)
            )
          ) : (
            formatMessage(m.accessNeededText)
          )
        }
        imgSrc="./assets/images/jobsGrid.svg"
      />
    </div>
  )
}
