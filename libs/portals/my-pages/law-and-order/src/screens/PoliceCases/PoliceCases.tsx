import { Box } from '@island.is/island-ui/core'
import {
  ActionCard,
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
import { messages as m } from '../../lib/messages'

const PoliceCases = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

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
          to={formatMessage(m.policeCasesHeaderLinkButton1Url)}
          text={formatMessage(m.policeCasesHeaderLinkButton1Text)}
          icon="open"
          variant="utility"
        />,
        <LinkButton
          key="link-button-2"
          to={formatMessage(m.policeCasesHeaderLinkButton2Url)}
          text={formatMessage(m.policeCasesHeaderLinkButton2Text)}
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
          <Box marginTop={2}>
            <ActionCard
              heading={formatMessage(m.policeCaseCardTitle, { arg: c.number })}
              text={c.modified ? formatMessage(m.policeCaseCardText, { arg: formatDate(c.modified)}) : undefined}
              eyebrow={'Ríkislögreglustjóri'}
              tag={{
                label: c.status?.headerDisplayString ?? 'no status',
                variant: 'blue',
              }}
              cta={{
                label: formatMessage(messages.seeInfo),
                variant: 'text',
                url: LawAndOrderPaths.PoliceCasesDetail.replace(
                  ':id',
                  c.number ?? '',
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
