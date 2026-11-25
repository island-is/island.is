import {
  RightsPortalAidOrNutrition,
  RightsPortalAidOrNutritionRenewalStatus,
} from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  Inline,
  Text,
  Tooltip,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DownloadFileButtons,
  LinkButton,
  PortalTable,
  amountFormat,
  createColumnHelper,
  formatDate,
  m,
  useIsMobile,
} from '@island.is/portals/my-pages/core'
import { useEffect, useMemo, useState } from 'react'
import MobileLabeledCell from '../../components/MobileLabeledCell/MobileLabeledCell'
import GenericRenewModal, {
  ModalField,
} from '../../components/GenericRenewModal/GenericRenewModal'
import NestedInfoLines from '../../components/NestedInfoLines/NestedInfoLines'
import { messages } from '../../lib/messages'
import { tableTextCell } from '../../components/TableTextCell/TableTextCell'
import { exportAidTable, exportNutritionFile } from '../../utils/FileBreakdown'
import { useRenewAidsAndNutritionMutation } from './AidsAndNutrition.generated'
import LocationModal from './LocationModal'
import { Features } from '@island.is/feature-flags'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'

interface Props {
  type: 'AID' | 'NUTRITION'
  data: Array<RightsPortalAidOrNutrition>
  refetch: () => void
}

const columnHelper = createColumnHelper<RightsPortalAidOrNutrition>()

// Tighter than the table default so the columns fit without scrolling sideways
const CELL_BOX = { paddingLeft: 2, paddingRight: 2 } as const

const AidsAndNutritionWrapper = ({ type, data, refetch }: Props) => {
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()
  const [showRenewal, setShowRenewal] = useState<boolean>(false)

  const [activeItem, setActiveItem] =
    useState<RightsPortalAidOrNutrition | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const [locationModalItem, setLocationModalItem] =
    useState<RightsPortalAidOrNutrition | null>(null)
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false)
  const featureFlagClient = useFeatureFlagClient()

  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.servicePortalHealthAidAndNutritionRenewalEnabled,
        false,
      )
      if (ffEnabled) {
        setShowRenewal(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [renewAidsAndNutrition, { loading }] =
    useRenewAidsAndNutritionMutation()

  const isAid = type === 'AID'
  const generateFoldedValues = (rowItem: RightsPortalAidOrNutrition) => {
    const foldedValues = []

    isAid &&
      foldedValues.push({
        title: formatMessage(messages.location),
        value:
          rowItem.location && rowItem.location.length > 6 ? (
            <Inline space={2}>
              <Text variant="small">
                {formatMessage(messages.manyDispensationLocations)}
              </Text>
              <Button
                variant="text"
                size="small"
                onClick={() => openLocationModal(rowItem)}
              >
                {formatMessage(messages.seeList)}
              </Button>
            </Inline>
          ) : (
            rowItem.location ?? ''
          ),
      })

    foldedValues.push({
      title: formatMessage(messages.availableTo),
      value: rowItem.validUntil ? formatDate(rowItem.validUntil) : '',
    })

    isAid &&
      foldedValues.push({
        title: formatMessage(messages.availableEvery12Months),
        value: rowItem.allowed12MonthPeriod ? rowItem.allowed12MonthPeriod : '',
      })

    foldedValues.push({
      title: formatMessage(messages.extraDetail),
      value: rowItem.explanation ? rowItem.explanation : '',
    })

    return foldedValues
  }

  const handleSubmit = async (item: RightsPortalAidOrNutrition) => {
    try {
      const result = await renewAidsAndNutrition({
        variables: {
          input: {
            id: item.id,
          },
        },
      })

      const success = result?.data?.rightsPortalRenewAidOrNutrition?.success
      const error = result?.data?.rightsPortalRenewAidOrNutrition?.errorMessage

      if (success) {
        refetch()
        toast.success(formatMessage(messages.renewalFormSuccess))
      }
      if (error) {
        console.error(error)
        toast.error(formatMessage(messages.renewalFormError))
      }
    } catch (e) {
      console.error(e)
      toast.error(formatMessage(messages.renewalFormError))
    }
  }

  const getFields = (item: RightsPortalAidOrNutrition): ModalField[] => [
    {
      title: isAid
        ? formatMessage(messages.aids)
        : formatMessage(messages.nutrition),
      value: item.name ?? '',
    },
    {
      title: formatMessage(messages.dispensationPlace),
      value:
        item.location && item.location.length > 6 ? (
          <Inline space={2}>
            <Text variant="small">
              {formatMessage(messages.manyDispensationLocations)}
            </Text>

            <Button
              variant="text"
              size="small"
              onClick={() => openLocationModal(item)}
            >
              {formatMessage(messages.seeList)}
            </Button>
          </Inline>
        ) : (
          item.location ?? ''
        ),
    },
    {
      title: formatMessage(messages.extraDetail),
      value: item.explanation ?? '',
    },
    {
      title: formatMessage(messages.availableEvery12Months),
      value: item.allowed12MonthPeriod?.toString() ?? '',
    },
    {
      title: formatMessage(messages.availableRefund),
      value: item.available ?? '',
    },
    {
      title: formatMessage(messages.nextAvailableRefund),
      value: item.nextAllowedMonth ?? '',
    },
  ]

  const openLocationModal = (item: RightsPortalAidOrNutrition) => {
    setLocationModalItem(item)
    setIsLocationModalVisible(true)
  }

  const columns = useMemo(() => {
    const renewalLabel = formatMessage(messages.renew)

    return [
      columnHelper.accessor(
        (item) => (item.name ? item.name.split('/').join(' / ') : ''),
        {
          id: 'aidsName',
          header: formatMessage(messages.name),
        },
      ),
      columnHelper.accessor(
        (item) =>
          isAid
            ? item.maxUnitRefund ?? ''
            : item.maxMonthlyAmount
            ? amountFormat(item.maxMonthlyAmount)
            : '',
        {
          id: 'maxUnitRefund',
          header: isAid
            ? formatMessage(messages.maxUnitRefund)
            : formatMessage(messages.maxAmountPerMonth),
          meta: { type: 'interactive' },
          cell: ({ getValue }) => tableTextCell(getValue()),
        },
      ),
      columnHelper.accessor(
        (item) =>
          item.refund?.value
            ? item.refund.type === 'amount'
              ? amountFormat(item.refund.value)
              : `${item.refund.value}%`
            : '',
        {
          id: 'insuranceRatio',
          header: isAid
            ? formatMessage(messages.insuranceRatio)
            : formatMessage(messages.insuranceRatioOrInitialApplicantPayment),
          meta: { type: 'interactive' },
          cell: ({ getValue }) => tableTextCell(getValue()),
        },
      ),
      columnHelper.accessor((item) => item.available ?? '', {
        id: 'availableRefund',
        header: formatMessage(messages.availableRefund),
        meta: { type: 'interactive' },
        cell: ({ getValue }) => tableTextCell(getValue()),
      }),
      columnHelper.accessor((item) => item.nextAllowedMonth ?? '', {
        id: 'nextAvailableRefund',
        header: formatMessage(messages.nextAvailableRefund),
        meta: { type: 'interactive' },
        cell: ({ getValue }) => tableTextCell(getValue()),
      }),
      ...(showRenewal
        ? [
            columnHelper.display({
              id: 'renewal',
              header: renewalLabel,
              // span: 2 only applies on mobile, where the cell takes the full card width without a label
              meta: { type: 'interactive', span: 2 },
              cell: ({ row }) => {
                const item = row.original
                const info = (label: string, text: string) =>
                  isMobile ? (
                    <Box marginTop={1}>
                      <AlertMessage type="info" message={label} />
                    </Box>
                  ) : (
                    <Box display="flex">
                      <Text variant="medium">{text}</Text>
                      <Tooltip text={label} />
                    </Box>
                  )

                switch (item.renewalStatus) {
                  case RightsPortalAidOrNutritionRenewalStatus.RENEWAL_IN_PROGRESS:
                    return info(
                      formatMessage(messages.renewalInProgress),
                      formatMessage(messages.renewalInProgress),
                    )
                  case RightsPortalAidOrNutritionRenewalStatus.VALID: {
                    const status = tableTextCell(formatMessage(messages.valid))
                    return isMobile ? (
                      <MobileLabeledCell label={renewalLabel}>
                        {status}
                      </MobileLabeledCell>
                    ) : (
                      status
                    )
                  }
                  case RightsPortalAidOrNutritionRenewalStatus.VALID_FOR_RENEWAL: {
                    const button = (
                      <Button
                        variant={isMobile ? 'ghost' : 'text'}
                        type="button"
                        size="small"
                        icon="arrowForward"
                        iconType="outline"
                        fluid={isMobile}
                        onClick={() => {
                          setActiveItem(item)
                          setIsVisible(true)
                        }}
                      >
                        {renewalLabel}
                      </Button>
                    )
                    return isMobile ? <Box marginTop={2}>{button}</Box> : button
                  }
                  default:
                    return info(
                      formatMessage(messages.notValidForRenewal),
                      formatMessage(messages.notValidForRenewalDetail),
                    )
                }
              },
            }),
          ]
        : []),
    ]
  }, [formatMessage, isMobile, isAid, showRenewal])

  return (
    <Box>
      <Box marginTop={2}>
        <PortalTable
          columns={columns}
          data={data}
          emptyMessage={m.noDataFound}
          getRowId={(item) => item.id}
          defaultSorting={[{ id: 'aidsName', desc: false }]}
          mobileTitleKey="aidsName"
          cellBox={{ header: CELL_BOX, body: CELL_BOX }}
          renderExpandedRow={(row) => (
            <NestedInfoLines
              data={generateFoldedValues(row.original)}
              width="full"
              backgroundColor="blue"
            />
          )}
        />

        <DownloadFileButtons
          BoxProps={{
            paddingTop: 2,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flexEnd',
          }}
          buttons={[
            {
              text: formatMessage(m.getAsExcel),
              onClick: () =>
                isAid
                  ? exportAidTable(data ?? [], 'xlsx')
                  : exportNutritionFile(data ?? [], 'xlsx'),
            },
          ]}
        />
      </Box>
      <Box paddingTop={4}>
        <Text variant="small" paddingBottom={2}>
          {isAid
            ? formatMessage(messages.aidsDisclaimer)
            : formatMessage(messages.nutritionDisclaimer)}
        </Text>
        <LinkButton
          to={
            isAid
              ? formatMessage(messages.aidsDescriptionLink)
              : formatMessage(messages.nutritionDescriptionLink)
          }
          text={
            isAid
              ? formatMessage(messages.aidsDescriptionInfo)
              : formatMessage(messages.nutritionDescriptionInfo)
          }
          variant="text"
        />
      </Box>

      {activeItem && (
        <GenericRenewModal
          item={activeItem}
          isVisible={isVisible}
          setVisible={setIsVisible}
          setActiveItem={setActiveItem}
          onSubmit={handleSubmit}
          getDataFields={getFields}
          modalTitle={
            isAid
              ? formatMessage(messages.renewalAidRequest)
              : formatMessage(messages.renewalNutritionRequest)
          }
          modalText={
            isAid
              ? formatMessage(messages.renewalAidRequestDetail)
              : formatMessage(messages.renewalNutritionRequestDetail)
          }
          cancelLabel={formatMessage(m.buttonCancel)}
          confirmLabel={formatMessage(messages.renew)}
          errorMessage={formatMessage(messages.renewalFormError)}
          loading={loading}
        />
      )}

      {locationModalItem && (
        <LocationModal
          item={locationModalItem}
          onClose={() => {
            setLocationModalItem(null)
          }}
          isVisible={!!isLocationModalVisible}
        />
      )}
    </Box>
  )
}

export default AidsAndNutritionWrapper
