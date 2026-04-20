import { Box, ActionCard } from '@island.is/island-ui/core'
import {
  CardLoader,
  m as coreMessages,
  formatDate,
  IntroWrapper,
  LinkButton,
  RIKISLOGREGLUSTJORI_SLUG,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LawAndOrderPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'
import { useGetPoliceCasesQuery } from './PoliceCases.generated'
import { useNavigate } from 'react-router-dom'

const PoliceCases = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { data, loading, error } = useGetPoliceCasesQuery()

  const cases = data?.lawAndOrderPoliceCasesPaginatedCollection?.data ?? []

  return (
    <IntroWrapper
      loading={loading}
      title={messages.policeCasesTitle}
      intro={messages.policeCasesDescription}
      serviceProviderSlug={RIKISLOGREGLUSTJORI_SLUG}
      serviceProviderTooltip={formatMessage(
        coreMessages.nationalPoliceCommissionerTooltip,
      )}
      buttonGroup={[
        <LinkButton
          key="link-button-1"
          to={formatMessage(messages.policeCasesHeaderLinkButton1Url)}
          text={formatMessage(messages.policeCasesHeaderLinkButton1Text)}
          icon="open"
          variant="utility"
        />,
        <LinkButton
          key="link-button-2"
          to={formatMessage(messages.policeCasesHeaderLinkButton2Url)}
          text={formatMessage(messages.policeCasesHeaderLinkButton2Text)}
          icon="open"
          variant="utility"
        />,
      ]}
    >
      {loading && !error && (
        <Box width="full">
          <CardLoader />
        </Box>
      )}

      {error && !loading && <Problem error={error} noBorder={false} />}

      {!loading &&
        cases.length > 0 &&
        cases.map((c) => (
          <Box key={c.number} marginTop={2}>
            <ActionCard
              heading={formatMessage(messages.policeCaseCardTitle, {
                arg: c.number,
              })}
              text={
                c.modified
                  ? formatMessage(messages.policeCaseCardText, {
                      arg: formatDate(c.modified),
                    })
                  : undefined
              }
              eyebrow={c.prosecutionOffice ?? undefined}
              tag={
                c.status?.headerDisplayString
                  ? {
                      label: c.status.headerDisplayString,
                      variant: 'blue',
                    }
                  : undefined
              }
              cta={{
                label: formatMessage(messages.seeInfo),
                variant: 'text',
                onClick: () =>
                  navigate(
                    LawAndOrderPaths.PoliceCasesDetail.replace(
                      ':id',
                      c.number ?? '',
                    ),
                  ),
              }}
            />
          </Box>
        ))}
      {!loading && !error && cases?.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(coreMessages.noData)}
          message={formatMessage(coreMessages.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
    </IntroWrapper>
  )
}
export default PoliceCases
