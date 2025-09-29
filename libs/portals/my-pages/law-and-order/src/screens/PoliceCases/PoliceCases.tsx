import { Box } from '@island.is/island-ui/core'
import {
  ActionCard,
  CardLoader,
  m as coreMessages,
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
    <>
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
              heading={formatMessage(m.policeCaseTitle, { arg: c.number })}
              text={c.type ?? 'no type'}
              tag={{
                label: c.status ?? 'no status',
                variant: 'blue',
                outlined: false,
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
    </>
  )
}
export default PoliceCases
