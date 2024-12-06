import { Box, Stack, Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  SortableTable,
} from '@island.is/portals/my-pages/core'
import React, { useEffect, useState } from 'react'
import { messages } from '../../lib/messages'

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
  const [activeTag, setActiveTag] = useState('0')
  const stringMaxLength = 22
  const filterList = (id: string) => {
    if (activeTag !== id) setActiveTag(id)
    if (id === '0') return MedicinePrescriptionsData
    return MedicinePrescriptionsData.filter((item) => item.id === id)
  }

  const tagLabels = [
    {
      label: 'Öll lyf',
      id: '0',
    },
    {
      label: 'Lyf notuð reglulega',
      id: '1',
    },
    {
      label: 'Tímabundin lyf',
      id: '2',
    },
    {
      label: 'Lyfjakúrar',
      id: '3',
    },
  ]

  const filteredData = filterList(activeTag)
  return (
    <IntroWrapper
      title={formatMessage(messages.medicinePrescriptions)}
      intro={formatMessage(messages.medicinePrescriptionIntroText)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicinePrescriptionsTooltip,
      )}
    >
      <Box>
        <Box display="flex" flexDirection="row" flexWrap={'wrap'}>
          {tagLabels.map((item) => (
            <Box marginRight={1} marginBottom={[1, 1, 1, 2, 2]}>
              <Tag
                onClick={() => filterList(item.id)}
                children={item.label}
                active={item.id === activeTag}
              />
            </Box>
          ))}
        </Box>
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
          ellipsisLength={stringMaxLength}
          items={
            filteredData?.map((item, i) => ({
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
                  ? {
                      type: 'info',
                      label: item.status.data,
                      text: formatMessage(messages.notValidForRenewal),
                    }
                  : { type: 'text', label: item.status.data },

              children: (
                <Box background={'blue100'}>
                  <Stack space={2}>
                    <NestedInfoLines
                      label={formatMessage(messages.moreDetailedInfo)}
                      data={MedicinePrescriptionDetailData}
                    />
                    <NestedInfoLines
                      label={formatMessage(messages.version)}
                      data={MedicinePrescriptionDetailData2}
                    />
                    <DispensingContainer
                      label={formatMessage(messages.dispenseHistory)}
                      data={MedicineDispenseData}
                    />
                  </Stack>
                </Box>
              ),
              subTitleFirstCol: item?.instructions,
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
      {/* || loading */}
      {!filteredData.length && (
        <EmptyTable
          // loading={loading}
          message={formatMessage(messages.noDataFound, { arg: 'lyf' })}
        />
      )}
    </IntroWrapper>
  )
}

export default MedicinePrescriptions
