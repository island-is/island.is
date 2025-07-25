import {
  RightsPortalAidOrNutrition,
  RightsPortalAidOrNutritionRenewalStatus,
} from '@island.is/api/schema'
import { Box, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DownloadFileButtons,
  LinkButton,
  SortableTable,
  amountFormat,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { exportNutritionFile } from '../../utils/FileBreakdown'
import NestedInfoLines from '../../components/NestedInfoLines/NestedInfoLines'
import { useRenewAidsAndNutritionMutation } from './AidsAndNutrition.generated'
import { useState } from 'react'
import GenericRenewModal, {
  ModalField,
} from '../../components/GenericRenewModal/GenericRenewModal'

interface Props {
  data: Array<RightsPortalAidOrNutrition>
}

const Nutrition = ({ data }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const [activeItem, setActiveItem] =
    useState<RightsPortalAidOrNutrition | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const [renewAidsAndNutrition, { data: postData, error: postError, loading }] =
    useRenewAidsAndNutritionMutation()

  const handleSubmit = async (item: RightsPortalAidOrNutrition) => {
    const data = await renewAidsAndNutrition({
      variables: {
        input: {
          id: item.id,
        },
      },
    })

    const success = data?.data?.rightsPortalRenewAidOrNutrition?.success
    const error = data?.data?.rightsPortalRenewAidOrNutrition?.errorMessage

    if (success) {
      toast.success(formatMessage(messages.renewalFormSuccess))
    }
    if (error) {
      toast.error(formatMessage(messages.renewalFormError))
    }
  }

  const getFields = (item: RightsPortalAidOrNutrition): ModalField[] => [
    {
      title: formatMessage(messages.nutrition),
      value: item.name ?? '',
    },
    {
      title: formatMessage(messages.dispensationPlace),
      value: item.location ?? '',
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

  return (
    <Box>
      <Box marginTop={2}>
        <SortableTable
          expandable
          labels={{
            name: formatMessage(messages.name),
            maxAmountPerMonth: formatMessage(messages.maxAmountPerMonth),
            insuranceRatioOrInitialApplicantPayment: formatMessage(
              messages.insuranceRatioOrInitialApplicantPayment,
            ),
            availableRefund: formatMessage(messages.availableRefund),
            nextAvailableRefund: formatMessage(messages.nextAvailableRefund),
            renewal: formatMessage(messages.renew),
          }}
          defaultSortByKey="name"
          mobileTitleKey="name"
          items={data.map((rowItem, idx) => ({
            id: rowItem.id ?? idx,
            name: rowItem.name ?? '',
            maxAmountPerMonth: rowItem.maxMonthlyAmount
              ? amountFormat(rowItem.maxMonthlyAmount)
              : '',
            insuranceRatioOrInitialApplicantPayment:
              rowItem.refund.type === 'amount'
                ? rowItem.refund.value
                  ? amountFormat(rowItem.refund.value)
                  : ''
                : rowItem.refund.value
                ? `${rowItem.refund.value}%`
                : '',
            availableRefund: rowItem.available ?? '',
            nextAvailableRefund: rowItem.nextAllowedMonth ?? '',
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
                : RightsPortalAidOrNutritionRenewalStatus.VALID_FOR_RENEWAL
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
                backgroundColor="blue"
                data={[
                  {
                    title: formatMessage(messages.availableTo),
                    value: rowItem.validUntil
                      ? formatDate(rowItem.validUntil)
                      : '',
                  },
                  {
                    title: formatMessage(messages.extraDetail),
                    value: rowItem.explanation ?? '',
                  },
                ]}
                width="full"
              />
            ),
          }))}
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
              onClick: () => exportNutritionFile(data ?? [], 'xlsx'),
            },
          ]}
        />
      </Box>

      <Box paddingTop={4}>
        <Text variant="small" paddingBottom={2}>
          {formatMessage(messages.nutritionDisclaimer)}
        </Text>
        <LinkButton
          to={formatMessage(messages.nutritionDescriptionLink)}
          text={formatMessage(messages.nutritionDescriptionInfo)}
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
          modalTitle={formatMessage(messages.renewalAidRequest)}
          modalText={formatMessage(messages.renewalAidRequestDetail)}
          cancelLabel={formatMessage(m.buttonCancel)}
          confirmLabel={formatMessage(messages.renew)}
          errorMessage={formatMessage(messages.renewalFormError)}
          loading={loading}
        />
      )}
    </Box>
  )
}

export default Nutrition
