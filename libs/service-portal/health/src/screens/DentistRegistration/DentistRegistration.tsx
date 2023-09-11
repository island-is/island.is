import {
  AlertMessage,
  Box,
  Input,
  Pagination,
  SkeletonLoader,
  Stack,
  Table as T,
} from '@island.is/island-ui/core'
import {
  useGetDentistStatusQuery,
  useGetPaginatedDentistsQuery,
} from './DentistRegistration.generated'
import { CardLoader, m } from '@island.is/service-portal/core'
import { IntroHeader } from '@island.is/portals/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { useState } from 'react'
import { useDebounce } from 'react-use'

const DEFAULT_PAGE_SIZE = 12
const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_CURSOR = ''

export const DentistRegistration = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const [page, setPage] = useState(DEFAULT_PAGE_NUMBER)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const {
    data: status,
    error: statusError,
    loading: statusLoading,
  } = useGetDentistStatusQuery()

  const canRegister = status?.rightsPortalDentistStatus?.canRegister
    ? true
    : false

  const contractType = status?.rightsPortalDentistStatus?.contractType
    ? status.rightsPortalDentistStatus.contractType
    : '0'

  const { data, error, loading } = useGetPaginatedDentistsQuery({
    variables: {
      input: {
        contractType,
        limit: DEFAULT_PAGE_SIZE,
        pageNumber: page - 1,
        nameStartsWith: activeSearch,
      },
    },
  })

  useDebounce(
    () => {
      setActiveSearch(searchTerm)
    },
    500,
    [searchTerm],
  )

  if (!canRegister && !statusLoading && !statusError)
    return (
      <AlertMessage
        type="error"
        title={formatMessage(messages.dentistRegisterForbiddenTitle)}
        message={formatMessage(messages.dentistRegisterForbiddenInfo)}
      />
    )

  if (statusLoading || loading)
    return (
      <Box paddingY={2}>
        <Stack space={4}>
          <CardLoader />
          <SkeletonLoader
            borderRadius="large"
            space={2}
            height={40}
            repeat={3}
          />
        </Stack>
      </Box>
    )

  return (
    <Box paddingY={2}>
      <IntroHeader
        title={formatMessage(messages.dentistRegisterationPageTitle)}
        intro={formatMessage(messages.healthCenterRegistrationInfo)}
      />
      {loading ? (
        <SkeletonLoader repeat={3} space={2} height={40} />
      ) : (
        <>
          <Box marginBottom={3}>
            <Input
              name="filter"
              placeholder={formatMessage(m.searchPlaceholder)}
              icon={{
                name: 'search',
                type: 'outline',
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(m.dentist)}</T.HeadData>
                <T.HeadData>
                  {formatMessage(messages.dentistPractice)}
                </T.HeadData>
                <T.HeadData>{formatMessage(m.postcode)}</T.HeadData>
                <T.HeadData>{formatMessage(m.address)}</T.HeadData>
                <T.HeadData></T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {data?.response?.dentists.map((dentist, key) => (
                <T.Row key={key}>
                  <T.Data>{dentist?.name}</T.Data>
                  <T.Data>{dentist?.practice}</T.Data>
                  <T.Data>{`${dentist?.address?.postalCode} ${dentist.address?.municipality}`}</T.Data>
                  <T.Data>{dentist?.address?.streetAddress}</T.Data>
                  <T.Data>
                    {dentist.name === data.current?.dentist?.name
                      ? formatMessage(messages.dentistCurrent)
                      : ''}
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
          <Box marginTop={6}>
            {data?.response?.totalCount && (
              <Pagination
                totalPages={Math.ceil(
                  data?.response.totalCount / DEFAULT_PAGE_SIZE,
                )}
                page={page}
                renderLink={(page, className, children) => (
                  <button className={className} onClick={() => setPage(page)}>
                    {children}
                  </button>
                )}
              />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default DentistRegistration
