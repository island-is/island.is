import { Box } from '@island.is/island-ui/core'
import {
  ActionCard,
  CardLoader,
  DOMSMALARADUNEYTID_SLUG,
  ErrorScreen,
  IntroHeader,
  NotFound,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LawAndOrderPaths } from '../../lib/paths'
import { listCases } from '../../helpers/mockData'
import { useGetCourtCasesQuery } from './CourtCases.generated'

const CourtCases = () => {
  useNamespaces('sp.law-and-order')
  const { data, loading, error } = useGetCourtCasesQuery()
  const cases = data?.courtCasesList?.items
  const noInfo = cases === null
  const { formatMessage } = useLocale()

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.courtCases).toLowerCase(),
        })}
      />
    )
  }

  if (noInfo && !loading) {
    return <NotFound title={formatMessage(messages.courtCaseNotFound)} />
  }

  return (
    <Box marginTop={3}>
      <IntroHeader
        title={messages.courtCases}
        intro={messages.courtCasesDescription}
        serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
        serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
      />

      {loading && !error && (
        <Box width="full">
          <CardLoader />
        </Box>
      )}
      {!loading &&
        !error &&
        cases?.map((x) => (
          <Box marginTop={2}>
            <ActionCard
              translateLabel="no"
              heading={x.caseNumberTitle ?? ''}
              text={x.type ?? ''}
              tag={{
                label: x.state?.title ?? '',
                variant: 'blue',
                outlined: false,
              }}
              cta={{
                label: formatMessage(messages.seeInfo),
                variant: 'text',
                url: LawAndOrderPaths.CourtCaseDetail.replace(
                  ':id',
                  x.id ?? '',
                ),
              }}
            />
          </Box>
        ))}
    </Box>
  )
}
export default CourtCases
