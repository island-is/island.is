import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SortableTable } from '@island.is/portals/my-pages/core'
import React, { useState } from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { MedicinePrescriptionWrapper } from '../Medicine/wrapper/MedicinePrescriptionWrapper'

import {
  MedicineDispenseData,
  MedicinePrescriptionDetailData,
  MedicinePrescriptionDetailData2,
  MedicinePrescriptionsData,
} from '../../utils/mockData'
import DispensingContainer from './components/DispensingContainer/DispensingContainer'
import NestedInfoLines from './components/NestedInfoLines/NestedInfoLines'
import RenewPrescriptionModal from './components/RenewPrescriptionModal/RenewPrescriptionModal'

const MedicinePrescriptions = () => {
  const { formatMessage } = useLocale()
  const [activePrescription, setActivePrescription] = React.useState<any>(null)
  const [openModal, setOpenModal] = useState(false)

  return (
    <MedicinePrescriptionWrapper
      pathname={HealthPaths.HealthMedicinePrescriptionOverview}
    >
      <Box>
        <SortableTable
          title=""
          labels={{
            medicine: formatMessage(messages.medicineTitle),
            usedFor: formatMessage(messages.usedFor),
            process: formatMessage(messages.process),
            validTo: formatMessage(messages.medicineValidTo),
            status: formatMessage(messages.status),
          }}
          expandable
          defaultSortByKey="medicine"
          mobileTitleKey="medicine"
          items={
            MedicinePrescriptionsData?.map((item, i) => ({
              id: item?.id ?? `${i}`,
              medicine: item?.medicineName ?? '',
              usedFor: item?.usedFor ?? '',
              process: item?.process ?? '',
              validTo: item?.validTo ?? '',
              status: undefined,
              lastNode:
                item?.status.type === 'renew'
                  ? {
                      type: 'action',
                      label: formatMessage(messages.renew),
                      action: () => {
                        setActivePrescription(item)
                        setOpenModal(true)
                      },
                      icon: { icon: 'reload', type: 'outline' },
                    }
                  : item?.status.type === 'tooltip'
                  ? { type: 'info', label: item.status.data }
                  : { type: 'text', label: item.status.data },

              children: (
                <Box padding={1} background={'blue100'}>
                  <NestedInfoLines
                    label={formatMessage(messages.moreDetailedInfo)}
                    data={MedicinePrescriptionDetailData}
                  />

                  <DispensingContainer
                    label={formatMessage(messages.dispenseHistory)}
                    data={MedicineDispenseData}
                  />

                  <NestedInfoLines
                    label={formatMessage(messages.version)}
                    data={MedicinePrescriptionDetailData2}
                  />
                </Box>
              ),
            })) ?? []
          }
        />
      </Box>

      {activePrescription && (
        <RenewPrescriptionModal
          id={`renewPrescriptionModal-${activePrescription.id}`}
          activePrescription={activePrescription}
          toggleClose={openModal}
          isVisible={openModal}
        />
      )}
    </MedicinePrescriptionWrapper>
  )
}

export default MedicinePrescriptions
