import { Box, Table as T } from '@island.is/island-ui/core'
import { Text } from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { AuthCustomDelegation } from '../../../types/customDelegation'
import { AuthDelegationsGroupedByIdentityOutgoingQuery } from '../outgoing/DelegationsGroupedByIdentityOutgoing.generated'

type PersonCentricDelegation =
  AuthDelegationsGroupedByIdentityOutgoingQuery['authDelegationsGroupedByIdentityOutgoing'][number]

// Todo: translate
const headerArray = [
  { value: 'Stofnun' },
  { value: 'Heiti Umboðs' },
  { value: 'Skráð dags.' },
  { value: 'Gildistími' },
  // { value: 'Síðast notað' }, // TODO: Data not available yet
]

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
  const scopes = 'scopes' in data ? data.scopes : data.delegationScopes

  return (
    <Box>
      <T.Table>
        <T.Head>
          <T.Row>
            {/* Todo: translate */}
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
          {scopes?.map((scope) => (
            <T.Row key={scope.id}>
              <RowItems
                values={[
                  ('domain' in scope && scope.domain?.displayName) ||
                    ('domain' in data && data.domain?.displayName) ||
                    '',
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
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default CustomDelegationsPermissionsTable
