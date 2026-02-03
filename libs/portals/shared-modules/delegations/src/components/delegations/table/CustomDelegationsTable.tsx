import {
  Box,
  Button,
  SkeletonLoader,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import ExpandableRow from './ExpandableRow/ExpandableRow'
import format from 'date-fns/format'
import { useState } from 'react'
import { m as coreMessages } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'
import CustomDelegationsPermissionsTable from './CustomDelegationsPermissionsTable'
import { ApolloError } from '@apollo/client'
import { Problem } from '@island.is/react-spa/shared'
import { AuthDelegationDirection } from '@island.is/api/schema'
import { IdentityInfo } from './IdentityInfo/IdentityInfo'
import { m } from '../../../lib/messages'
import { AuthDelegationsGroupedByIdentityOutgoingQuery } from '../../delegations/outgoing/DelegationsGroupedByIdentityOutgoing.generated'

type DelegationsByPerson =
  AuthDelegationsGroupedByIdentityOutgoingQuery['authDelegationsGroupedByIdentityOutgoing'][number]

const CustomDelegationsTable = ({
  title,
  data,
  loading,
  error,
}: {
  title: string
  data: DelegationsByPerson[]
  loading: boolean
  error: ApolloError | undefined
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _direction?: AuthDelegationDirection
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _refetch?: () => void
}) => {
  const { formatMessage } = useLocale()
  const [expandedRow, setExpandedRow] = useState<string | null | undefined>(
    null,
  )

  const headerArray = [
    { value: '' },
    { value: formatMessage(m.name) },
    { value: formatMessage(m.numberOfDelegations) },
    { value: formatMessage(m.validityPeriod) },
    { value: '' },
    { value: '' },
  ]

  return (
    <Box marginTop={[4, 4, 6]} display="flex" flexDirection="column" rowGap={2}>
      <Text variant="h5">{title}</Text>
      {loading ? (
        <Box padding={3}>
          <SkeletonLoader space={1} height={40} repeat={2} />
        </Box>
      ) : error && !data?.length ? (
        <Problem error={error} />
      ) : (
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
            {data?.map((person) => {
              const identity = {
                nationalId: person.nationalId,
                name: person.name,
                type: person.type,
              }

              return (
                <ExpandableRow
                  key={person.nationalId}
                  onExpandCallback={() => setExpandedRow(person.nationalId)}
                  data={[
                    {
                      value: (
                        <IdentityInfo
                          identity={identity}
                          isExpanded={expandedRow === person.nationalId}
                        />
                      ),
                    },
                    {
                      value: (
                        <Text variant="medium" fontWeight="semiBold">
                          {person.totalScopeCount}
                        </Text>
                      ),
                    },
                    {
                      value: person.latestValidTo
                        ? format(new Date(person.latestValidTo), 'dd.MM.yyyy')
                        : formatMessage(m.noValidToDate),
                    },
                    {
                      value: (
                        <Button
                          variant="text"
                          icon="pencil"
                          iconType="outline"
                          size="small"
                          colorScheme="default"
                          onClick={() => console.log('edit', person.nationalId)}
                        >
                          {formatMessage(coreMessages.buttonEdit)}
                        </Button>
                      ),
                      align: 'right',
                    },
                    {
                      value: (
                        <Button
                          variant="text"
                          icon="trash"
                          iconType="outline"
                          size="small"
                          colorScheme="destructive"
                          onClick={() =>
                            console.log('delete', person.nationalId)
                          }
                        >
                          {formatMessage(coreMessages.buttonDestroy)}
                        </Button>
                      ),
                      align: 'right',
                    },
                  ]}
                >
                  <CustomDelegationsPermissionsTable data={person} />
                </ExpandableRow>
              )
            })}
          </T.Body>
        </T.Table>
      )}
    </Box>
  )
}

export default CustomDelegationsTable
