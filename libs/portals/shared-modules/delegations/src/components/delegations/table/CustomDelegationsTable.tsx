import {
  Box,
  Button,
  SkeletonLoader,
  Table as T,
  Text,
  UserAvatar,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '../../../types/customDelegation'
import ExpandableRow from './ExpandableRow/ExpandableRow'
import format from 'date-fns/format'
import { useState } from 'react'
import { m as coreMessages } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'
import CustomDelegationsPermissionsTable from './CustomDelegationsPermissionsTable'
import { AccessDeleteModal } from '../../access/AccessDeleteModal/AccessDeleteModal'
import { useDomains } from '../../../hooks/useDomains/useDomains'
import { prepareDomainName } from '../outgoing/DelegationsOutgoing'
import { isDefined } from '@island.is/shared/utils'
import { ApolloError } from '@apollo/client'
import { Problem } from '@island.is/react-spa/shared'

// todo: translate
const headerArray = [
  { value: '' },
  { value: 'Nafn' },
  { value: 'Fjöldi umboða' },
  { value: 'Gildistími' },
  { value: '' },
  { value: '' },
]

const CustomDelegationsTable = ({
  data,
  loading,
  refetch,
  error,
}: {
  data: AuthCustomDelegation[]
  loading: boolean
  refetch: (variables?: { input?: { domain?: string | null } }) => void
  error: ApolloError | undefined
}) => {
  const { name: domainName } = useDomains()
  const { formatMessage } = useLocale()
  const [expandedRow, setExpandedRow] = useState<string | null | undefined>(
    null,
  )
  const [delegation, setDelegation] = useState<AuthCustomDelegation | null>(
    null,
  )

  return (
    <>
      <Box marginTop={[4, 4, 6]}>
        {loading && (
          <Box padding={3}>
            <SkeletonLoader space={1} height={40} repeat={2} />
          </Box>
        )}
        {error && !data?.length ? (
          <Problem error={error} />
        ) : (
          <T.Table>
            <T.Head>
              <T.Row>
                {/* Todo: translate */}
                {headerArray.map((item, i) => (
                  <T.HeadData
                    key={item.value + i}
                    style={{ paddingInline: 16 }}
                  >
                    <Text variant="medium" fontWeight="semiBold">
                      {item.value}
                    </Text>
                  </T.HeadData>
                ))}
              </T.Row>
            </T.Head>
            <T.Body>
              {data?.map((item) => {
                return (
                  <ExpandableRow
                    key={item.id}
                    onExpandCallback={() => setExpandedRow(item.id)}
                    data={[
                      {
                        value: (
                          <Box display="flex" alignItems="center" columnGap={2}>
                            <UserAvatar
                              color={expandedRow === item.id ? 'white' : 'blue'}
                              username={item.to?.name}
                            />
                            <Box>
                              <Text variant="medium">{item.to?.name}</Text>
                              <Text variant="small">{item.to?.nationalId}</Text>
                            </Box>
                          </Box>
                        ),
                      },
                      { value: item.scopes?.length },
                      {
                        value: format(
                          new Date(item.validTo || ''),
                          'dd.MM.yyyy',
                        ),
                      },
                      {
                        value: (
                          <Button
                            variant="text"
                            icon="trash"
                            iconType="outline"
                            size="small"
                            colorScheme="destructive"
                            onClick={() => setDelegation(item)}
                          >
                            {formatMessage(coreMessages.buttonDestroy)}
                          </Button>
                        ),
                        align: 'right',
                      },
                      {
                        value: (
                          <Button
                            variant="text"
                            icon="pencil"
                            iconType="outline"
                            size="small"
                            colorScheme="default"
                            onClick={() => console.log('edit')}
                          >
                            {formatMessage(coreMessages.buttonEdit)}
                          </Button>
                        ),
                        align: 'right',
                      },
                    ]}
                  >
                    <CustomDelegationsPermissionsTable data={item} />
                  </ExpandableRow>
                )
              })}
            </T.Body>
          </T.Table>
        )}
      </Box>
      <AccessDeleteModal
        onClose={() => {
          setDelegation(null)
        }}
        onDelete={() => {
          setDelegation(null)
          refetch({
            input: {
              domain: prepareDomainName(domainName),
            },
          })
        }}
        isVisible={isDefined(delegation)}
        delegation={delegation as AuthCustomDelegation}
      />
    </>
  )
}

export default CustomDelegationsTable
