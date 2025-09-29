import { Box, TagVariant } from '@island.is/island-ui/core'
import { ActionCard, CardLoader, m } from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LawAndOrderPaths } from '../../lib/paths'
import { useGetCourtCasesQuery } from './CourtCases.generated'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect } from 'react'

const CourtCases = () => {
  useNamespaces('sp.law-and-order')
  const { lang } = useLocale()
  const { formatMessage } = useLocale()

  const { data, loading, error, refetch } = useGetCourtCasesQuery({
    variables: {
      locale: lang,
    },
  })

  const cases = data?.lawAndOrderCourtCasesList?.cases

  useEffect(() => {
    refetch()
  }, [lang])

  return (
    <>
      {loading && !error && (
        <Box width="full">
          <CardLoader />
        </Box>
      )}

      {error && !loading && <Problem error={error} noBorder={false} />}

      {!loading &&
        cases &&
        cases.length > 0 &&
        cases.map((x) => (
          <Box marginTop={2}>
            <ActionCard
              translateLabel="no"
              heading={x.caseNumberTitle ?? ''}
              text={x.type ?? ''}
              tag={{
                label: x.state?.label ?? '',
                variant: (x.state?.color as unknown as TagVariant) ?? 'blue',
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
      {!loading && !error && cases?.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
    </>
  )
}
export default CourtCases
