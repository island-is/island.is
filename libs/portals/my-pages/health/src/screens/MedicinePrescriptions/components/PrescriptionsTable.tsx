import { HealthDirectoratePrescription } from '@island.is/api/schema'
import { Box, Icon, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate, SortableTable } from '@island.is/portals/my-pages/core'
import React, { useState } from 'react'
import DispensingContainer from '../../../components/DispensingContainer/DispensingContainer'
import NestedInfoLines from '../../../components/NestedInfoLines/NestedInfoLines'
import { messages } from '../../../lib/messages'
import RenewPrescriptionModal from './RenewPrescriptionModal/RenewPrescriptionModal'

const STRING_MAX_LENGTH = 22

interface Props {
  data?: HealthDirectoratePrescription[]
  loading?: boolean
}

const PrescriptionsTable: React.FC<Props> = ({ data, loading }) => {
  const { formatMessage } = useLocale()
  const [activePrescription, setActivePrescription] = React.useState<any>(null)
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <SortableTable
        title=""
        labels={{
          medicine: formatMessage(messages.medicineTitle),
          usedFor: formatMessage(messages.usedFor),
          process: formatMessage(messages.process),
          validTo: formatMessage(messages.medicineValidTo),
          status: formatMessage(messages.renewal),
        }}
        expandable
        align="left"
        defaultSortByKey="medicine"
        mobileTitleKey="medicine"
        ellipsisLength={STRING_MAX_LENGTH}
        emptyTableMessage={formatMessage(messages.noSearchResults)}
        tableLoading={loading}
        items={
          data?.map((item, i) => ({
            id: `${item.id}-${i}`,
            medicine: item?.name ?? '',
            usedFor: item?.indication ?? '',
            process: item?.amountRemaining ?? '',
            validTo: formatDate(item?.expiryDate) ?? '',
            status: undefined,
            lastNode: item?.isRenewable
              ? {
                  type: 'action',
                  label: formatMessage(messages.renew),
                  action: () => {
                    setActivePrescription(item)
                    setOpenModal(true)
                  },
                  icon: { icon: 'reload', type: 'outline' },
                }
              : {
                  type: 'info',
                  label: item.renewalBlockedReason?.toString() ?? '',
                  text: formatMessage(messages.notValidForRenewal),
                },

            children: (
              <Box background="blue100" paddingBottom={1}>
                <Stack space={2}>
                  <NestedInfoLines
                    backgroundColor="blue"
                    label={formatMessage(messages.moreDetailedInfo)}
                    data={[
                      {
                        title: formatMessage(messages.medicineTitle),
                        value: item?.name ?? '',
                        href: item?.url ?? '',
                        type: 'link',
                      },
                      {
                        title: formatMessage(messages.type),
                        value: item?.type ?? '',
                      },
                      {
                        title: formatMessage(messages.medicineForm),
                        value: item?.form ?? '',
                      },
                      {
                        title: formatMessage(messages.usedFor),
                        value: item?.indication ?? '',
                      },

                      {
                        title: formatMessage(messages.prescribedAmount),
                        value: item?.totalPrescribedAmount ?? '',
                      },
                      {
                        title: formatMessage(messages.usage),
                        value: item?.dosageInstructions ?? '',
                      },
                    ]}
                  />
                  <NestedInfoLines
                    backgroundColor="blue"
                    label={formatMessage(messages.version)}
                    data={[
                      {
                        title: formatMessage(messages.publicationDate),
                        value: formatDate(item?.issueDate) ?? '',
                      },
                      {
                        title: formatMessage(messages.doctor),
                        value: item?.prescriberName ?? '',
                      },
                      {
                        title: formatMessage(messages.medicineValidTo),
                        value: formatDate(item?.expiryDate) ?? '',
                      },
                    ]}
                  />
                  {item.dispensations.length > 0 && (
                    <DispensingContainer
                      backgroundColor="blue"
                      label={formatMessage(messages.dispenseHistory)}
                      data={item.dispensations.map((dispensation, di) => ({
                        date: formatDate(dispensation?.date),
                        icon: (
                          <Icon
                            icon={dispensation?.date ? 'checkmark' : 'remove'}
                            size="medium"
                            color={dispensation?.date ? 'mint600' : 'dark300'}
                            type="outline"
                          />
                        ),
                        number: (di + 1).toString() ?? '',
                        pharmacy: dispensation?.agentName ?? '',
                        quantity: dispensation?.count.toString() ?? '',
                      }))}
                    />
                  )}
                </Stack>
              </Box>
            ),
            subTitleFirstCol: item?.dosageInstructions ?? '',
          })) ?? []
        }
      />

      {activePrescription && (
        <RenewPrescriptionModal
          id={`renewPrescriptionModal-${activePrescription.id}`}
          activePrescription={activePrescription}
          toggleClose={openModal}
          isVisible={openModal}
        />
      )}
    </>
  )
}

export default PrescriptionsTable
