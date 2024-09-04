import { useLocale } from '@island.is/localization'
import { LinkButton, SortableTable } from '@island.is/service-portal/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { Box, Tooltip, Text } from '@island.is/island-ui/core'
import { MedicinePrescriptionWrapper } from '../Medicine/wrapper/MedicinePrescriptionWrapper'
import { HealthPaths } from '../../lib/paths'

import DispensingContainer from './DispensingContainer'
import NestedInfoLines from '../Medicine/components/NestedInfoLines/NestedInfoLines'
import { MedicinePrescriptionsData } from '../Medicine/utils/mockData'

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
                  <LinkButton
                    to={item.status.data}
                    text="Endurnýja"
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
                    label={'Nánari upplýsingar'}
                    data={[
                      {
                        title: 'Lyf',
                        type: 'link',
                        href: HealthPaths.HealthMedicine,
                        value: 'Esomeprazol Actavis 40mg',
                      },
                      {
                        title: 'Tegund',
                        value: 'Önnur lyf með verkun á taugakerfið',
                      },
                      {
                        title: 'Notað við',
                        value: 'Verkir',
                      },
                      {
                        title: 'Ávísað magn',
                        value: '100 ml',
                      },
                      {
                        title: 'Notkunarleiðbeiningar',
                        value: '2 ml 1 sinni á dag',
                      },
                    ]}
                  />

                  <DispensingContainer
                    label="Afgreiðslusaga"
                    data={[
                      {
                        title: '1. afgreiðsla',
                        value: 'Sótt í Árbæjarapótek 01.08.2023',
                        icon: {
                          type: 'checkmark',
                          color: 'mint600',
                        },
                      },
                      {
                        title: '2. afgreiðsla',
                        value: '01.08.2023',
                        icon: {
                          type: 'remove',
                          color: 'dark300',
                        },
                      },
                    ]}
                  />

                  <NestedInfoLines
                    label={'Útgáfa'}
                    data={[
                      {
                        title: 'Útgáfudagur',
                        value: '06.06.2024',
                      },
                      {
                        title: 'Læknir',
                        value: 'Gunnar Gunnarsson',
                      },
                      {
                        title: 'Gildir til',
                        value: '05.06.2025',
                      },
                    ]}
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
