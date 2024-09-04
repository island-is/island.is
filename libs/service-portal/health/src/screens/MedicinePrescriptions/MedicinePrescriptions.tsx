import { useLocale } from '@island.is/localization'
import { SortableTable } from '@island.is/service-portal/core'
import React from 'react'
import { messages as m, messages } from '../../lib/messages'
import { Box, Text } from '@island.is/island-ui/core'
import { MedicinePrescriptionWrapper } from '../Medicine/wrapper/MedicinePrescriptionWrapper'
import { HealthPaths } from '../../lib/paths'
import { HealthTable } from '../../components/Table/HealthTable'
import { DetailHeader } from '../../utils/types'

const MedicinePrescriptions = () => {
  const { formatMessage } = useLocale()
  const headerDataDetail: Array<DetailHeader> = [
    {
      value: 'Nr.',
    },
    {
      value: 'Dags.',
    },
    {
      value: 'Aldur',
    },
    {
      value: 'Bóluefni',
    },
    {
      value: 'Staður',
    },
  ]

  const data = [
    {
      id: '1',
      medicineName: 'Esomeprazol Actavis 40mg',
      usedFor: 'Verkir',
      process: 'Fullafgreitt',
      validTo: '01.02.2025',
      status: {
        type: 'tooltip',
        data: 'Sjálfvirk endurnýjun er ekki í boði fyrir þessa lyfjaávísun.',
      },
    },
    {
      id: '2',
      medicineName: 'Naltrexone hydrochloride-forskriftarlyf 1 mg/ml',
      usedFor: 'Verkir',
      process: 'Fullafgreitt',
      validTo: '05.06.2025',
      status: {
        type: 'renew',
        data: 'https://www.island.is',
      },
    },
  ]
  return (
    <MedicinePrescriptionWrapper
      pathname={HealthPaths.HealthMedicinePrescriptionOverview}
    >
      <Box>
        <Text>HALLO</Text>
        <SortableTable
          title=""
          labels={{
            medicine: formatMessage(messages.medicineTitle),
            usedFor: formatMessage(messages.usedFor),
            process: formatMessage(messages.process),
            validTo: formatMessage(messages.medicineValidTo),
            status: formatMessage(messages.status),
          }}
          tagOutlined
          //expandable
          defaultSortByKey="vaccine"
          items={
            data?.map((item, i) => ({
              id: item?.id ?? `${i}`,
              name: item?.medicineName ?? '',
              medicine: item?.medicineName ?? '',
              usedFor: item?.usedFor ?? '',
              process: item?.process ?? '',
              validTo: item?.validTo ?? '',
              status: item?.status.data ?? '',
            })) ?? []
          }
        />
      </Box>
    </MedicinePrescriptionWrapper>
  )
}

export default MedicinePrescriptions
