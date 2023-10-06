import {
  Stack,
  SkeletonLoader,
  Box,
  AlertMessage,
  Text,
  Accordion,
  AccordionItem,
  Table as T,
  Button,
  FilterInput,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { EmptyState, ErrorScreen } from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import * as styles from './HealthRegistration.css'
import { m } from '@island.is/service-portal/core'
import groupBy from 'lodash/groupBy'
import { useEffect, useMemo, useRef, useState } from 'react'
import { RightsPortalHealthCenter } from '@island.is/api/schema'
import { useNavigate } from 'react-router-dom'
import { HealthPaths } from '../../lib/paths'
import { formatHealthCenterName } from '../../utils/format'
import { RegisterModal } from '../../components/RegisterModal'
import {
  useGetHealthCenterQuery,
  useRightsPortalTransferHealthCenterMutation,
} from './HealthCenterRegistration.generated'

type SelectedHealthCenter = Pick<RightsPortalHealthCenter, 'id' | 'name'>

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

  const [transferHealthCenter] = useRightsPortalTransferHealthCenterMutation({
    onError: (e) => {
      setSelectedHealthCenter(null)
      setLoadingTransfer(false)
      setErrorTransfer(true)
    },
    onCompleted: (data) => {
      if (data.rightsPortalRegisterHealthCenter.success) {
        navigate(`${HealthPaths.HealthCenter}`, {
          state: {
            transferSuccess: true,
          },
        })
      } else {
        setSelectedHealthCenter(null)
        setLoadingTransfer(false)
        setErrorTransfer(true)
      }
    },
    variables: {
      input: {
        id: selectedHealthCenter?.id || '',
      },
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

  const handleHealthCenterTransfer = async () => {
    setLoadingTransfer(true)
    await transferHealthCenter()
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
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.healthCenterRegistrationTitle)}
        intro={formatMessage(messages.healthCenterRegistrationInfo)}
      />
      {errorTransfer && (
        <Box paddingBottom={4} ref={errorBoxRef}>
          <AlertMessage
            type="error"
            title={formatMessage(
              messages.healthCenterRegistrationTransferErrorTitle,
            )}
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
            <Text variant="small">
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
        onClose={() => setSelectedHealthCenter(null)}
        onAccept={() => handleHealthCenterTransfer()}
        isVisible={!!selectedHealthCenter}
        buttonLoading={loadingTransfer}
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
              <AccordionItem id={`${region}-${key}`} key={key} label={name}>
                <T.Table>
                  <T.Head>
                    <T.Row>
                      <T.HeadData>
                        {formatMessage(messages.healthCenterTitle)}
                      </T.HeadData>
                      <T.HeadData>{formatMessage(m.postcode)}</T.HeadData>
                      <T.HeadData>{formatMessage(m.address)}</T.HeadData>
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
                            <Text variant="small">{healthCenter.name}</Text>
                          </T.Data>
                          <T.Data>{`${healthCenter.address?.postalCode} ${healthCenter.address?.municipality}`}</T.Data>
                          <T.Data>{healthCenter.address?.streetAddress}</T.Data>
                          <T.Data>
                            <Box
                              className={styles.saveButtonWrapperStyle({
                                visible: healthCenter.id === hoverId,
                              })}
                            >
                              <Button
                                size="small"
                                variant="text"
                                icon="pencil"
                                onClick={() => {
                                  setSelectedHealthCenter({
                                    id: healthCenter.id,
                                    name: healthCenter.name,
                                  })
                                }}
                              >
                                {formatMessage(messages.healthRegistrationSave)}
                              </Button>
                            </Box>
                          </T.Data>
                        </tr>
                      )
                    })}
                  </T.Body>
                </T.Table>
              </AccordionItem>
            )
          })}
        </Accordion>
      ) : null}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}
    </Box>
  )
}

export default HealthCenterRegistration
