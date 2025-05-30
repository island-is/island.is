import {
  RightsPortalAidOrNutrition,
  RightsPortalAidOrNutritionRenewalStatus,
} from '@island.is/api/schema'
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
import { exportAidTable } from '../../utils/FileBreakdown'
import NestedInfoLines from '../MedicinePrescriptions/components/NestedInfoLines/NestedInfoLines'
import { Box, Text, Tooltip, Icon, toast } from '@island.is/island-ui/core'
import { useRenewAidsAndNutritionMutation } from './AidsAndNutrition.generated'
import GenericRenewModal, {
  ModalField,
} from '../../components/GenericRenewModal/GenericRenewModal'
import { useState } from 'react'

interface Props {
  data: Array<RightsPortalAidOrNutrition>
}

const Aids = ({ data }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const [activeItem, setActiveItem] =
    useState<RightsPortalAidOrNutrition | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const [renewAidsAndNutrition, { data: postData, error: postError, loading }] =
    useRenewAidsAndNutritionMutation()

  const generateFoldedValues = (rowItem: RightsPortalAidOrNutrition) => {
    const foldedValues = []

    foldedValues.push({
      title: formatMessage(messages.location),
      value: rowItem.location ? rowItem.location : '',
    })

    foldedValues.push({
      title: formatMessage(messages.availableTo),
      value: rowItem.validUntil ? formatDate(rowItem.validUntil) : '',
    })

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

  const expiringIcon = (
    <Tooltip
      text={formatMessage(messages.timeRemainingOfRefund)}
      placement="top"
    >
      <Box>
        <Icon icon="time" type="outline" color="blue400" size="large" />
      </Box>
    </Tooltip>
  )

  const handleSubmit = async (item: RightsPortalAidOrNutrition) => {
    await renewAidsAndNutrition({
      variables: {
        input: {
          id: item.id,
        },
      },
    }).then(() => {
      if (postData?.rightsPortalRenewAidOrNutrition.success) {
        toast.success(formatMessage(messages.renewalFormSuccess))
      }
      if (postData?.rightsPortalRenewAidOrNutrition.errorMessage)
        toast.error(postData.rightsPortalRenewAidOrNutrition.errorMessage)
    })
  }

  const getFields = (item: RightsPortalAidOrNutrition): ModalField[] => [
    {
      title: formatMessage(messages.aids),
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
            aidsName: formatMessage(messages.name),
            maxUnitRefund: formatMessage(messages.maxUnitRefund),
            insuranceRatio: formatMessage(messages.insuranceRatio),
            availableRefund: formatMessage(messages.availableRefund),
            nextAvailableRefund: formatMessage(messages.nextAvailableRefund),
            renewal: formatMessage(messages.renew),
          }}
          defaultSortByKey="aidsName"
          mobileTitleKey="aidsName"
          items={data.map((rowItem, idx) => ({
            id: rowItem.id ?? idx,
            aidsName: rowItem.name ? rowItem.name.split('/').join(' / ') : '',
            maxUnitRefund: rowItem.maxUnitRefund ?? '',
            insuranceRatio: rowItem.refund
              ? rowItem.refund.type === 'amount'
                ? amountFormat(rowItem.refund.value)
                : `${rowItem.refund.value}%`
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
                data={generateFoldedValues(rowItem)}
                width="full"
                backgroundColor="blue"
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
              onClick: () => exportAidTable(data ?? [], 'xlsx'),
            },
          ]}
        />
      </Box>
      <Box paddingTop={4}>
        <Text variant="small" paddingBottom={2}>
          {formatMessage(messages['aidsDisclaimer'])}
        </Text>
        <LinkButton
          to={formatMessage(messages['aidsDescriptionLink'])}
          text={formatMessage(messages.aidsDescriptionInfo)}
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
        />
      )}
    </Box>
  )
}

export default Aids
