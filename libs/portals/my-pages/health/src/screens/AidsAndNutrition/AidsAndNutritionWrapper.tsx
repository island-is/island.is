import {
  RightsPortalAidOrNutrition,
  RightsPortalAidOrNutritionRenewalStatus,
} from '@island.is/api/schema'
import { Box, Button, Inline, Text, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DownloadFileButtons,
  LinkButton,
  SortableTable,
  amountFormat,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { useEffect, useState } from 'react'
import GenericRenewModal, {
  ModalField,
} from '../../components/GenericRenewModal/GenericRenewModal'
import NestedInfoLines from '../../components/NestedInfoLines/NestedInfoLines'
import { messages } from '../../lib/messages'
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

const AidsAndNutritionWrapper = ({ type, data, refetch }: Props) => {
  const { formatMessage } = useLocale()
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

  const openModal = (item: RightsPortalAidOrNutrition) => {
    setActiveItem(item)
    setIsVisible(true)
  }

  const openLocationModal = (item: RightsPortalAidOrNutrition) => {
    setLocationModalItem(item)
    setIsLocationModalVisible(true)
  }

  const labels = {
    aidsName: formatMessage(messages.name),
    maxUnitRefund: isAid
      ? formatMessage(messages.maxUnitRefund)
      : formatMessage(messages.maxAmountPerMonth),
    insuranceRatio: isAid
      ? formatMessage(messages.insuranceRatio)
      : formatMessage(messages.insuranceRatioOrInitialApplicantPayment),
    insuranceRatioOrInitialApplicantPayment: formatMessage(
      messages.insuranceRatioOrInitialApplicantPayment,
    ),
    availableRefund: formatMessage(messages.availableRefund),
    nextAvailableRefund: formatMessage(messages.nextAvailableRefund),
  }
  return (
    <Box>
      <Box marginTop={2}>
        <SortableTable
          expandable
          labels={{
            ...labels,
            ...(showRenewal && { renewal: formatMessage(messages.renew) }),
          }}
          defaultSortByKey="aidsName"
          mobileTitleKey="aidsName"
          items={data.map((rowItem, idx) => {
            const baseItem = {
              id: rowItem.id ?? idx,
              aidsName: rowItem.name ? rowItem.name.split('/').join(' / ') : '',
              maxUnitRefund: isAid
                ? rowItem.maxUnitRefund ?? ''
                : rowItem.maxMonthlyAmount
                ? amountFormat(rowItem.maxMonthlyAmount)
                : '',
              insuranceRatio: rowItem.refund
                ? rowItem.refund.type === 'amount'
                  ? rowItem.refund.value
                    ? amountFormat(rowItem.refund.value)
                    : ''
                  : rowItem.refund.value
                  ? `${rowItem.refund.value}%`
                  : ''
                : '',
              availableRefund: rowItem.available ?? '',
              nextAvailableRefund: rowItem.nextAllowedMonth ?? '',
            }

            // Only add renewal property if showRenewal is true
            if (showRenewal) {
              return {
                ...baseItem,
                renewal: undefined,
                lastNode:
                  rowItem.renewalStatus ===
                  RightsPortalAidOrNutritionRenewalStatus.RENEWAL_IN_PROGRESS
                    ? {
                        type: 'info',
                        label: formatMessage(messages.renewalInProgress),
                        text: formatMessage(messages.renewalInProgress),
                      }
                    : rowItem.renewalStatus ===
                      RightsPortalAidOrNutritionRenewalStatus.VALID
                    ? {
                        type: 'text',
                        label: formatMessage(messages.valid),
                      }
                    : rowItem.renewalStatus ===
                      RightsPortalAidOrNutritionRenewalStatus.VALID_FOR_RENEWAL
                    ? {
                        type: 'action',
                        label: formatMessage(messages.renew),
                        action: () => openModal(rowItem),
                        icon: { icon: 'arrowForward', type: 'outline' },
                      }
                    : {
                        type: 'info',
                        label: formatMessage(messages.notValidForRenewal),
                        text: formatMessage(messages.notValidForRenewalDetail),
                      },
                children: (
                  <NestedInfoLines
                    data={generateFoldedValues(rowItem)}
                    width="full"
                    backgroundColor="blue"
                  />
                ),
              }
            }

            // Return item without renewal property when showRenewal is false
            return {
              ...baseItem,
              children: (
                <NestedInfoLines
                  data={generateFoldedValues(rowItem)}
                  width="full"
                  backgroundColor="blue"
                />
              ),
            }
          })}
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
