import { Box, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  SortableTable,
} from '@island.is/portals/my-pages/core'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import {
  MedicineDispenseData,
  MedicinePrescriptionDetailData,
  MedicinePrescriptionDetailData2,
  MedicinePrescriptionsHistoryData,
} from '../../utils/mockData'
import DispensingContainer from './components/DispensingContainer/DispensingContainer'
import NestedInfoLines from './components/NestedInfoLines/NestedInfoLines'

const MedicinePrescriptionHistory = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  return (
    <IntroWrapper
      title={formatMessage(messages.medicinePrescriptions)}
      intro={formatMessage(messages.medicinePrescriptionIntroText)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicinePrescriptionsTooltip,
      )}
    >
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
        mobileTitleKey="medicine"
        items={
          MedicinePrescriptionsHistoryData?.map((item, i) => ({
            id: item?.id ?? `${i}`,
            medicine: item?.medicineName ?? '',
            usedFor: item?.usedFor ?? '',
            lastDispensed: item?.lastDispensed ?? '',
            status: item?.status.type ?? '',
            lastNode:
              item?.status.type === 'renew'
                ? {
                    type: 'action',
                    label: formatMessage(messages.renew),
                    action: () => navigate(item.status.data),
                    icon: { icon: 'reload', type: 'outline' },
                  }
                : item?.status.type === 'tooltip'
                ? { type: 'info', label: item.status.data }
                : { type: 'text', label: item.status.data },

            children: (
              <Box padding={1} background={'blue100'}>
                <Stack space={2}>
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
                </Stack>
              </Box>
            ),
          })) ?? []
        }
      />
    </IntroWrapper>
  )
}

export default MedicinePrescriptionHistory
