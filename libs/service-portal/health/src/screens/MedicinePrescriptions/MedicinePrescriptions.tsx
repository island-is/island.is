import { useLocale } from '@island.is/localization'
import { LinkButton, SortableTable } from '@island.is/service-portal/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { Box, Tooltip, Text, Button } from '@island.is/island-ui/core'
import { MedicinePrescriptionWrapper } from '../Medicine/wrapper/MedicinePrescriptionWrapper'
import { HealthPaths } from '../../lib/paths'

import DispensingContainer from './components/DispensingContainer/DispensingContainer'
import NestedInfoLines from '../Medicine/components/NestedInfoLines/NestedInfoLines'
import {
  MedicineDispenseData,
  MedicinePrescriptionDetailData,
  MedicinePrescriptionDetailData2,
  MedicinePrescriptionsData,
} from '../Medicine/utils/mockData'
import RenewPrescriptionModal from './components/RenewPrescriptionModal/RenewPrescriptionModal'

const MedicinePrescriptions = () => {
  const { formatMessage } = useLocale()

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
          items={
            MedicinePrescriptionsData?.map((item, i) => ({
              id: item?.id ?? `${i}`,
              name: item?.medicineName ?? '',

              medicine: item?.medicineName ?? '',
              usedFor: item?.usedFor ?? '',
              process: item?.process ?? '',
              validTo: item?.validTo ?? '',
              status: item?.status.type ?? '',

              lastNode:
                item?.status.type === 'renew' ? (
                  <RenewPrescriptionModal
                    id={`renewPrescriptionModal-${item.id}`}
                    activePrescription={item}
                    disclosure={
                      <Button icon="reload" size="small" variant="text">
                        {formatMessage(messages.renew)}
                      </Button>
                    }
                  />
                ) : item?.status.type === 'tooltip' ? (
                  <Tooltip text={item.status.data} />
                ) : (
                  <Text>{item.status.data}</Text>
                ),

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
    </MedicinePrescriptionWrapper>
  )
}

export default MedicinePrescriptions
