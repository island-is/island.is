import {
  Box,
  Button,
  Input,
  SkeletonLoader,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '../../../types/customDelegation'
import ExpandableRow from './ExpandableRow/ExpandableRow'
import format from 'date-fns/format'
import { useMemo, useState } from 'react'
import { m as coreMessages } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'
import CustomDelegationsPermissionsTable from './CustomDelegationsPermissionsTable'
import { AccessDeleteModal } from '../../access/AccessDeleteModal/AccessDeleteModal'
import { useDomains } from '../../../hooks/useDomains/useDomains'
import { prepareDomainName } from '../outgoing/DelegationsOutgoing'
import { isDefined } from '@island.is/shared/utils'
import { ApolloError } from '@apollo/client'
import { Problem } from '@island.is/react-spa/shared'
import { AuthDelegationDirection } from '@island.is/api/schema'
import { IdentityInfo } from './IdentityInfo/IdentityInfo'
import { m } from '../../../lib/messages'

const CustomDelegationsTable = ({
  title,
  data,
  loading,
  refetch,
  error,
  direction,
}: {
  title: string
  data: AuthCustomDelegation[]
  loading: boolean
  refetch: (variables?: { input?: { domain?: string | null } }) => void
  error: ApolloError | undefined
  direction: AuthDelegationDirection
}) => {
  const { name: domainName } = useDomains()
  const [searchValue, setSearchValue] = useState('')

  const { formatMessage } = useLocale()
  const [expandedRow, setExpandedRow] = useState<string | null | undefined>(
    null,
  )
  const [delegation, setDelegation] = useState<AuthCustomDelegation | null>(
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

  const filteredDelegations = useMemo(() => {
    if (!searchValue) {
      return data
    }

    return data.filter((delegation) => {
      const searchValueLower = searchValue.toLowerCase()
      const name = delegation.to?.name.toLowerCase()
      const nationalId = delegation.to?.nationalId.toLowerCase()

      return (
        name?.includes(searchValueLower) || nationalId?.includes(searchValue)
      )
    })
  }, [searchValue, data])

  return (
    <>
      <Box
        marginTop={[4, 4, 6]}
        display="flex"
        flexDirection="column"
        rowGap={2}
      >
        <Box
          display="flex"
          alignItems="center"
          columnGap={2}
          justifyContent="spaceBetween"
        >
          <Text variant="h5">{title}</Text>
          <Input
            name="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={formatMessage(m.searchPlaceholder)}
            size="xs"
            type="text"
            backgroundColor="blue"
            icon={{ name: 'search' }}
          />
        </Box>
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
              {filteredDelegations?.map((item) => {
                const identity = direction === 'outgoing' ? item.to : item.from

                return (
                  <ExpandableRow
                    key={item.id}
                    onExpandCallback={() => setExpandedRow(item.id)}
                    data={[
                      {
                        value: (
                          <IdentityInfo
                            identity={identity}
                            isExpanded={expandedRow === item.id}
                          />
                        ),
                      },
                      { value: item.scopes?.length },
                      {
                        value: item.validTo
                          ? format(new Date(item.validTo), 'dd.MM.yyyy')
                          : '',
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
