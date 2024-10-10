import React from 'react'
import { useLocale } from '@island.is/localization'
import { LinkButton, SortableTable } from '@island.is/service-portal/core'
import { Box, Tooltip, Text } from '@island.is/island-ui/core'
import { MedicinePrescriptionWrapper } from '../Medicine/wrapper/MedicinePrescriptionWrapper'
import NestedInfoLines from '../Medicine/components/NestedInfoLines/NestedInfoLines'
import DispensingContainer from './components/DispensingContainer/DispensingContainer'
import {
  MedicineDispenseData,
  MedicinePrescriptionDetailData,
  MedicinePrescriptionDetailData2,
  MedicinePrescriptionsHistoryData,
} from '../Medicine/utils/mockData'
import { HealthPaths } from '../../lib/paths'
import { messages } from '../../lib/messages'

const MedicinePrescriptionHistory = () => {
  const { formatMessage } = useLocale()

  return (
    <MedicinePrescriptionWrapper
      pathname={HealthPaths.HealthMedicinePrescriptionHistory}
    >
      <Box>
        <SortableTable
          title=""
          labels={{
            medicine: formatMessage(messages.medicineTitle),
            usedFor: formatMessage(messages.usedFor),
            lastDispensed: formatMessage(messages.lastDispensed),
            status: formatMessage(messages.type),
          }}
          expandable
          defaultSortByKey="medicine"
          items={
            MedicinePrescriptionsHistoryData?.map((item, i) => ({
              id: item?.id ?? `${i}`,
              name: item?.medicineName ?? '',

              medicine: item?.medicineName ?? '',
              usedFor: item?.usedFor ?? '',
              lastDispensed: item?.lastDispensed ?? '',
              status: item?.status.type ?? '',

              lastNode:
                item?.status.type === 'renew' ? (
                  <LinkButton
                    to={item.status.data}
                    text={formatMessage(messages.renew)}
                    icon="reload"
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

export default MedicinePrescriptionHistory
