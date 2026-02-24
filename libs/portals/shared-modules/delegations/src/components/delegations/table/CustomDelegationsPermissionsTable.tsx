import { Box, Table as T } from '@island.is/island-ui/core'
import { Text } from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { AuthCustomDelegation } from '../../../types/customDelegation'
import { AuthDelegationsGroupedByIdentityOutgoingQuery } from '../outgoing/DelegationsGroupedByIdentityOutgoing.generated'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

type PersonCentricDelegation =
  AuthDelegationsGroupedByIdentityOutgoingQuery['authDelegationsGroupedByIdentityOutgoing'][number]

const RowItems = ({ values }: { values: string[] }) => {
  return values.map((value, index) => (
    <T.Data key={value + index}>
      <Text variant="medium">{value}</Text>
    </T.Data>
  ))
}

const CustomDelegationsPermissionsTable = ({
  data,
}: {
  data: AuthCustomDelegation | PersonCentricDelegation
}) => {
  const { formatMessage } = useLocale()
  const scopes = data.scopes

  const headerArray = [
    { value: formatMessage(m.headerDomain) },
    { value: formatMessage(m.headerScopeName) },
    { value: formatMessage(m.headerRegisteredDate) },
    { value: formatMessage(m.headerValidityPeriod) },
    // { value: 'Síðast notað' }, // TODO: Data not available yet
  ]

  return (
    <Box>
      <T.Table>
        <T.Head>
          <T.Row>
            {headerArray.map((item, i) => (
              <T.HeadData key={item.value + i} style={{ paddingInline: 16 }}>
                <Text variant="medium" fontWeight="semiBold">
                  {item.value}
                </Text>
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {scopes?.map((scope) => {
            const domainName =
              scope.domain?.displayName ||
              ('domain' in data && data.domain?.displayName) ||
              ''

            return (
              <T.Row key={scope.id}>
                <RowItems
                  values={[
                    domainName,
                    scope.displayName,
                    scope.validFrom
                      ? format(new Date(scope.validFrom), 'dd.MM.yyyy')
                      : '-',
                    scope.validTo
                      ? format(new Date(scope.validTo), 'dd.MM.yyyy')
                      : '-',
                    // Todo: add column for last used data when available
                  ]}
                />
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default CustomDelegationsPermissionsTable
