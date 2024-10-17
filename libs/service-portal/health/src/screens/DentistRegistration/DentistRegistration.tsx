import {
  AlertMessage,
  Box,
  Button,
  FilterInput,
  Pagination,
  SkeletonLoader,
  Stack,
  Table as T,
} from '@island.is/island-ui/core'
import {
  useGetDentistStatusQuery,
  useGetPaginatedDentistsQuery,
  useRegisterDentistMutation,
} from './DentistRegistration.generated'
import { Modal, m } from '@island.is/service-portal/core'
import { IntroHeader } from '@island.is/portals/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { useNavigate } from 'react-router-dom'
import { HealthPaths } from '../../lib/paths'
import { RightsPortalDentist } from '@island.is/api/schema'
import * as styles from './DentistRegistration.css'
import { Problem } from '@island.is/react-spa/shared'

const DEFAULT_PAGE_SIZE = 12
const DEFAULT_PAGE_NUMBER = 1

type SelectedDentist = Pick<RightsPortalDentist, 'id' | 'name'>

export const DentistRegistration = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [page, setPage] = useState(DEFAULT_PAGE_NUMBER)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [selectedDentist, setSelectedDentist] =
    useState<SelectedDentist | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [hoverId, setHoverId] = useState(0)
  const [errorTransfering, setErrorTransfering] = useState(false)
  const errorBoxRef = useRef<HTMLDivElement>(null)
  const {
    data: status,
    error: statusError,
    loading: statusLoading,
  } = useGetDentistStatusQuery()

  const [registerDentist, { loading: loadingTranser }] =
    useRegisterDentistMutation({
      onError: () => {
        setErrorTransfering(true)
      },
      onCompleted: (data) => {
        if (data.rightsPortalRegisterDentist.success) {
          navigate(`${HealthPaths.HealthDentists}`, {
            state: {
              transferSuccess: true,
            },
          })
        } else {
          setErrorTransfering(true)
        }
      },
    })

  useEffect(() => {
    if (errorTransfering && errorBoxRef.current) {
      errorBoxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [errorTransfering])

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

  if (error) {
    return (
      <AlertMessage
        type="error"
        title={formatMessage(messages.dentistRegisterForbiddenTitle)}
        message={formatMessage(messages.dentistRegisterForbiddenInfo)}
      />
    )
  }

  if (!canRegister && !statusLoading && !statusError)
    return <Problem error={error} noBorder={false} />

  if (statusLoading)
    return (
      <Box paddingY={2}>
        <Stack space={4}>
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
        intro={formatMessage(messages.dentistRegisterationPageDescription)}
      />
      {errorTransfering && (
        <Box paddingBottom={4} ref={errorBoxRef}>
          <AlertMessage
            type="error"
            title={formatMessage(messages.healthErrorTitle)}
            message={formatMessage(
              messages.dentistRegistrationTransferErrorInfo,
            )}
          />
        </Box>
      )}
      <Box marginBottom={3} display="flex" justifyContent="flexStart">
        <FilterInput
          name="filter"
          placeholder={formatMessage(m.searchPlaceholder)}
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)}
          backgroundColor="blue"
        />
      </Box>
      {loading ? (
        <SkeletonLoader repeat={3} space={2} height={40} />
      ) : (
        <>
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
              {data?.response?.dentists.map((dentist, key) =>
                dentist.practices?.map((p, idx) => {
                  return (
                    <tr
                      onMouseOver={() => setHoverId(dentist.id)}
                      key={`${key}-${idx}`}
                    >
                      <T.Data>{idx === 0 ? dentist?.name : ''}</T.Data>
                      <T.Data>{p.practice}</T.Data>
                      <T.Data>{`${p.postalCode} ${p.region}`}</T.Data>
                      <T.Data>{p.address}</T.Data>
                      <T.Data style={{ whiteSpace: 'nowrap' }}>
                        {dentist.name === data.current?.dentist?.name ? (
                          formatMessage(messages.dentistCurrent)
                        ) : idx === 0 ? (
                          <Box
                            className={styles.saveButtonWrapperStyle({
                              visible: dentist.id === hoverId,
                            })}
                          >
                            <Modal
                              id={'dentistRegisterModal'}
                              initialVisibility={false}
                              iconSrc="./assets/images/coffee.svg"
                              iconAlt="coffee"
                              toggleClose={!modalVisible}
                              onCloseModal={() => {
                                setSelectedDentist(null)
                              }}
                              title={`${formatMessage(
                                messages.dentistModalTitle,
                              )} ${selectedDentist?.name}`}
                              buttons={[
                                {
                                  id: 'RegisterModalAccept',
                                  type: 'primary' as const,
                                  text: formatMessage(
                                    messages.healthRegisterModalAccept,
                                  ),
                                  onClick: () => {
                                    setErrorTransfering(false)
                                    setModalVisible(false)
                                    if (selectedDentist?.id) {
                                      registerDentist({
                                        variables: {
                                          input: {
                                            id: `${selectedDentist.id}`,
                                          },
                                        },
                                      })
                                    }
                                  },
                                },
                                {
                                  id: 'RegisterModalDecline',
                                  type: 'ghost' as const,
                                  text: formatMessage(
                                    messages.healthRegisterModalDecline,
                                  ),
                                  onClick: () => {
                                    setModalVisible(false)
                                  },
                                },
                              ]}
                              disclosure={
                                <Button
                                  size="small"
                                  variant="text"
                                  icon="pencil"
                                  onClick={() => {
                                    setModalVisible(true)
                                    setSelectedDentist({
                                      id: dentist.id,
                                      name: dentist.name,
                                    })
                                  }}
                                >
                                  {formatMessage(
                                    messages.healthRegistrationSave,
                                  )}
                                </Button>
                              }
                            />
                          </Box>
                        ) : undefined}
                      </T.Data>
                    </tr>
                  )
                }),
              )}
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
