import { RightsPortalHealthCenter } from '@island.is/api/schema'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  FilterInput,
  Hidden,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  ExcludesFalse,
  IntroWrapper,
  m,
  MobileTable,
} from '@island.is/portals/my-pages/core'
import groupBy from 'lodash/groupBy'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterModal } from '../../components/RegisterModal'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { formatHealthCenterName } from '../../utils/format'
import {
  useGetHealthCenterDoctorsLazyQuery,
  useGetHealthCenterQuery,
  useRightsPortalTransferHealthCenterMutation,
} from './HealthCenterRegistration.generated'
import * as styles from './HealthRegistration.css'
import {
  HealthCenterDoctorOption,
  SelectedHealthCenter,
} from '../../utils/types'

export interface Dictionary<T> {
  [index: string]: T
}

const HealthCenterRegistration = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { data, loading, error } = useGetHealthCenterQuery()
  const totalCount = data?.rightsPortalPaginatedHealthCenters?.totalCount || 0
  const healthCentersData = data?.rightsPortalPaginatedHealthCenters?.data

  const errorBoxRef = useRef<HTMLDivElement>(null)

  const [hoverId, setHoverId] = useState<string>('')
  const [filter, setFilter] = useState('')
  const [loadingTransfer, setLoadingTransfer] = useState(false)
  const [errorTransfer, setErrorTransfer] = useState(false)
  const [selectedHealthCenter, setSelectedHealthCenter] =
    useState<SelectedHealthCenter | null>(null)
  const [healthCenterDoctors, setHealthCenterDoctors] = useState<
    HealthCenterDoctorOption[]
  >([])

  const handleOnError = () => {
    setSelectedHealthCenter(null)
    setLoadingTransfer(false)
    setErrorTransfer(true)
  }

  const handleHealthCenterSelect = useCallback(
    (id: string, name?: string | null) => {
      setSelectedHealthCenter({ id, name })
    },
    [],
  )

  const [getHealthCenterDoctors] = useGetHealthCenterDoctorsLazyQuery({
    onCompleted: (data) => {
      setHealthCenterDoctors(
        data?.rightsPortalHealthCenterDoctors
          ?.map((d) => {
            if (d.id && d.name) {
              return { value: d.id, label: d.name }
            }
            return null
          })
          .filter(Boolean as unknown as ExcludesFalse) ?? [],
      )
    },
  })

  useEffect(() => {
    if (selectedHealthCenter) {
      getHealthCenterDoctors({
        variables: {
          input: {
            id: selectedHealthCenter.id,
          },
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHealthCenter])

  const [transferHealthCenter] = useRightsPortalTransferHealthCenterMutation({
    onError: () => {
      handleOnError()
    },
    onCompleted: (data) => {
      if (data.rightsPortalRegisterHealthCenter.success) {
        navigate(`${HealthPaths.HealthCenter}`, {
          state: {
            transferSuccess: true,
          },
        })
      } else {
        handleOnError()
      }
    },
  })

  useEffect(() => {
    if (errorTransfer && errorBoxRef.current) {
      errorBoxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [errorTransfer])

  const handleHealthCenterTransfer = async (doctorId?: number) => {
    setLoadingTransfer(true)
    if (selectedHealthCenter && selectedHealthCenter?.id) {
      await transferHealthCenter({
        variables: {
          input: {
            id: selectedHealthCenter.id,
            doctorId: doctorId,
          },
        },
      })
    } else {
      handleOnError()
    }
  }

  const healthCenterGroups = useMemo(() => {
    return groupBy(healthCentersData, 'region')
  }, [healthCentersData])

  const filteredHealthCenters = useMemo(() => {
    if (!filter || !healthCenterGroups) return healthCenterGroups

    return Object.keys(healthCenterGroups).reduce(
      (acc: Dictionary<RightsPortalHealthCenter[]>, key) => {
        const group = healthCenterGroups[key]
        const filteredGroup = group.filter(
          (hc) =>
            hc.name?.toLowerCase().includes(filter.toLowerCase()) ||
            hc.address?.streetAddress
              ?.toLowerCase()
              .includes(filter.toLowerCase()) ||
            hc.address?.postalCode
              ?.toLowerCase()
              .includes(filter.toLowerCase()) ||
            hc.address?.municipality
              ?.toLowerCase()
              .includes(filter.toLowerCase()),
        )

        if (filteredGroup.length) {
          acc[key] = filteredGroup
        }

        return acc
      },
      {},
    )
  }, [filter, healthCenterGroups])

  if (loading)
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

  if (error)
    return (
      <ErrorScreen
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.errorFetch)}
      />
    )

  return (
    <IntroWrapper
      marginBottom={[6, 6, 10]}
      title={formatMessage(messages.healthCenterRegistrationTitle)}
      intro={formatMessage(messages.healthCenterRegistrationInfo)}
    >
      {errorTransfer && (
        <Box paddingBottom={4} ref={errorBoxRef}>
          <AlertMessage
            type="error"
            title={formatMessage(messages.healthErrorTitle)}
            message={formatMessage(
              messages.healthCenterRegistrationTransferErrorInfo,
            )}
          />
        </Box>
      )}
      <Box paddingBottom={4}>
        <AlertMessage
          type="warning"
          message={
            <Text variant="medium">
              <strong className={styles.strongStyle}>
                {formatMessage(messages.alert)}
              </strong>
              {formatMessage(messages.healthCenterRegistrationWarning)}
            </Text>
          }
        />
      </Box>

      {!loading && totalCount <= 0 && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      <RegisterModal
        id="healthCenterDialog"
        title={formatMessage(messages.healthCenterRegistrationModalTitle, {
          healthCenter: selectedHealthCenter?.name,
        })}
        description={formatMessage(messages.healthCenterRegistrationModalInfo)}
        onClose={() => {
          setSelectedHealthCenter(null)
          setHealthCenterDoctors([])
        }}
        onAccept={handleHealthCenterTransfer}
        isVisible={!!selectedHealthCenter}
        buttonLoading={loadingTransfer}
        healthCenterDoctors={healthCenterDoctors}
      />

      <Box className={styles.filterWrapperStyle} marginBottom={3}>
        <FilterInput
          onChange={(val) => setFilter(val)}
          name="filter"
          value={filter}
          placeholder={formatMessage(
            messages.healthCenterListSearchPlaceholder,
          )}
          backgroundColor="blue"
        />
      </Box>

      {Object.keys(filteredHealthCenters).length ? (
        <Accordion dividerOnTop={false}>
          {Object.keys(filteredHealthCenters).map((region, key) => {
            const name = formatHealthCenterName(region)
            const group = filteredHealthCenters[region]
            return (
              <Box dataTestId={`accordion-item`}>
                <AccordionItem id={`${region}-${key}`} key={key} label={name}>
                  <Hidden below="md">
                    <T.Table>
                      <T.Head>
                        <T.Row>
                          <T.HeadData>
                            <Text variant="medium" fontWeight="semiBold">
                              {formatMessage(messages.healthCenterTitle)}
                            </Text>
                          </T.HeadData>
                          <T.HeadData>
                            <Text variant="medium" fontWeight="semiBold">
                              {formatMessage(m.postcode)}
                            </Text>
                          </T.HeadData>
                          <T.HeadData>
                            <Text variant="medium" fontWeight="semiBold">
                              {formatMessage(m.address)}
                            </Text>
                          </T.HeadData>
                          <T.HeadData />
                        </T.Row>
                      </T.Head>
                      <T.Body>
                        {group.map((healthCenter, key) => {
                          return (
                            <tr
                              className={styles.tableRowStyle}
                              key={key}
                              onMouseEnter={() => setHoverId(healthCenter.id)}
                              onMouseLeave={() => setHoverId('')}
                            >
                              <T.Data>
                                <Text variant="medium">
                                  {healthCenter.name}
                                </Text>
                              </T.Data>
                              <T.Data>
                                <Text variant="medium">
                                  {`${healthCenter.address?.postalCode} ${healthCenter.address?.municipality}`}
                                </Text>
                              </T.Data>
                              <T.Data>
                                <Text variant="medium">
                                  {healthCenter.address?.streetAddress}
                                </Text>
                              </T.Data>
                              <T.Data>
                                {healthCenter.canRegister ? (
                                  <Box
                                    className={styles.saveButtonWrapperStyle({
                                      visible: healthCenter.id === hoverId,
                                    })}
                                  >
                                    <Button
                                      size="small"
                                      variant="text"
                                      icon="pencil"
                                      onClick={() =>
                                        handleHealthCenterSelect(
                                          healthCenter.id,
                                          healthCenter.name,
                                        )
                                      }
                                    >
                                      {formatMessage(
                                        messages.healthRegistrationSave,
                                      )}
                                    </Button>
                                  </Box>
                                ) : (
                                  <Text
                                    variant="medium"
                                    aria-label={formatMessage(
                                      messages.healthCenterNotAvailableForRegistration,
                                    )}
                                  >
                                    {formatMessage(
                                      messages.healthCenterNotAvailableForRegistration,
                                    )}
                                    <Tooltip
                                      text={formatMessage(
                                        messages.healthCenterNotAvailableForRegistrationDesc,
                                      )}
                                      placement="right"
                                    />
                                  </Text>
                                )}
                              </T.Data>
                            </tr>
                          )
                        })}
                      </T.Body>
                    </T.Table>
                  </Hidden>
                  <Hidden above="sm">
                    <MobileTable
                      rows={group.map((healthCenter) => ({
                        title: healthCenter.name ?? '',
                        action: healthCenter.canRegister ? (
                          <div style={{ width: '100%' }}>
                            <Button
                              size="small"
                              fluid
                              type="button"
                              variant="ghost"
                              icon="pencil"
                              onClick={() =>
                                handleHealthCenterSelect(
                                  healthCenter.id,
                                  healthCenter.name,
                                )
                              }
                            >
                              {formatMessage(messages.healthRegistrationSave)}
                            </Button>
                          </div>
                        ) : (
                          <AlertMessage
                            type="info"
                            message={formatMessage(
                              messages.healthCenterNotAvailableForRegistrationDesc,
                            )}
                          />
                        ),
                        data: [
                          {
                            title: formatMessage(m.postcode),
                            content: `${healthCenter.address?.postalCode} ${healthCenter.address?.municipality}`,
                          },
                          {
                            title: formatMessage(m.address),
                            content: healthCenter.address?.streetAddress ?? '',
                          },
                        ],
                      }))}
                    />
                  </Hidden>
                </AccordionItem>
              </Box>
            )
          })}
        </Accordion>
      ) : null}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}
    </IntroWrapper>
  )
}

export default HealthCenterRegistration
