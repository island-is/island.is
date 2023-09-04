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
  ModalBase,
  Icon,
  Input,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import {
  CardLoader,
  EmptyState,
  ErrorScreen,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import {
  useGetHealthCenterQuery,
  useRightsPortalTransferHealthCenterMutation,
} from './HealthCenterRegistration.generated'
import {
  ModalGridButtonGroup,
  CloseModalButtonStyle,
  ModalBaseStyle,
  ModalGridContentStyle,
  ModalGridImageStyle,
  ModalGridStyle,
  SaveButtonWrapperStyle,
  StrongStyle,
  TableRowStyle,
  FilterWrapperStyle,
} from './HealthRegistration.css'
import { m } from '@island.is/service-portal/core'
import groupBy from 'lodash/groupBy'
import { useMemo, useState } from 'react'
import { RightsPortalHealthCenter } from '@island.is/api/schema'
import { useNavigate } from 'react-router-dom'
import { HealthPaths } from '../../lib/paths'

const POSTFIX = '-'

export interface Dictionary<T> {
  [index: string]: T
}

const HealthCenterRegistration = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { data, loading, error } = useGetHealthCenterQuery()

  const [hoverId, setHoverId] = useState<string>('')
  const [toggle, setToggle] = useState(false)
  const [filter, setFilter] = useState('')
  const [selectedHealthCenter, setSelectedHealthCenter] =
    useState<RightsPortalHealthCenter | null>(null)

  const [loadingTransfer, setLoadingTransfer] = useState(false)
  const [errorTransfer, setErrorTransfer] = useState(false)

  const [transferHealthCenter] = useRightsPortalTransferHealthCenterMutation({
    variables: {
      id: selectedHealthCenter?.id ?? '',
    },
  })

  const handleHealthCenterTransfer = async (
    hc: RightsPortalHealthCenter | null,
  ) => {
    setLoadingTransfer(true)
    if (!hc) {
      setLoadingTransfer(false)
      setToggle(false)
      setErrorTransfer(true)
    }

    const res = await transferHealthCenter()

    if (res.data?.rightsPortalTransferHealthCenter?.success) {
      navigate(`${HealthPaths.HealthCenter}?s=t`)
    } else {
      setLoadingTransfer(false)
      setToggle(false)
      setErrorTransfer(true)
    }
  }

  const healthCenters = data?.rightsPortalPaginatedHealthCenters
  const healthCentersData = data?.rightsPortalPaginatedHealthCenters?.data

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
        <Stack space={2}>
          <CardLoader />
          <CardLoader />
          <CardLoader />
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
        <Box paddingBottom={4}>
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
              <strong className={StrongStyle}>
                {formatMessage(messages.alert)}
              </strong>
              {formatMessage(messages.healthCenterRegistrationWarning)}
            </Text>
          }
        />
      </Box>

      {!loading && healthCenters?.totalCount && healthCenters.totalCount <= 0 && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      <ModalBase
        baseId="healthCareDialog"
        isVisible={toggle}
        onVisibilityChange={(v) => {
          if (v !== toggle) setToggle(v)
        }}
        className={ModalBaseStyle}
      >
        <Box paddingTop={10} paddingBottom={9} paddingX={3} background="white">
          <Box className={CloseModalButtonStyle}>
            <button
              aria-label={formatMessage(messages.closeModal)}
              onClick={() => setToggle(false)}
            >
              <Icon icon="close" size="large" />
            </button>
          </Box>
          <Box className={ModalGridStyle}>
            <Box className={ModalGridContentStyle}>
              <Text variant="h2">
                {`${formatMessage(
                  messages.healthCenterRegistrationModalTitleStart,
                )} ${selectedHealthCenter?.name} ${formatMessage(
                  messages.healthCenterRegistrationModalTitleEnd,
                )}`}
              </Text>
              <Text marginTop={2} marginBottom={3}>
                {formatMessage(messages.healthCenterRegistrationModalInfo)}
              </Text>
              <Box className={ModalGridButtonGroup}>
                <Button
                  size="small"
                  variant="primary"
                  onClick={() => setToggle(false)}
                >
                  {formatMessage(
                    messages.healthCenterRegistrationModalButtonCancel,
                  )}
                </Button>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() =>
                    handleHealthCenterTransfer(selectedHealthCenter)
                  }
                  loading={loadingTransfer}
                >
                  {formatMessage(
                    messages.healthCenterRegistrationModalButtonAccept,
                  )}
                </Button>
              </Box>
            </Box>
            <Box className={ModalGridImageStyle}>
              <img src="./assets/images/hourglass.svg" alt="" />
            </Box>
          </Box>
        </Box>
      </ModalBase>

      <Box className={FilterWrapperStyle} marginBottom={3}>
        <Input
          size="sm"
          onChange={(e) => setFilter(e.target.value)}
          name="filter"
          value={filter}
          placeholder={formatMessage(
            messages.healthCenterListSearchPlaceholder,
          )}
        />
      </Box>

      {Object.keys(filteredHealthCenters).length ? (
        <Accordion>
          {Object.keys(filteredHealthCenters).map((region, key) => {
            const name = `${region.split(POSTFIX)[0]}`
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
                          className={TableRowStyle}
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
                              className={SaveButtonWrapperStyle({
                                visible: healthCenter.id === hoverId,
                              })}
                            >
                              <Button
                                size="small"
                                variant="text"
                                icon="pencil"
                                onClick={() => {
                                  setSelectedHealthCenter(healthCenter)
                                  setToggle((p) => !p)
                                }}
                              >
                                {formatMessage(
                                  messages.healthCenterRegistrationSave,
                                )}
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
