import { Box, Stack, Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  formatDate,
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
import { useGetMedicinePrescriptionsQuery } from './Prescriptions.generated'
import { HealthDirectoratePrescribedItemCategory } from '@island.is/api/schema'

const MedicinePrescriptions = () => {
  const { formatMessage, lang } = useLocale()
  const [activePrescription, setActivePrescription] = React.useState<any>(null)
  const [openModal, setOpenModal] = useState(false)
  const [activeTag, setActiveTag] =
    useState<HealthDirectoratePrescribedItemCategory>(
      HealthDirectoratePrescribedItemCategory.Owner,
    )

  const { data, error, loading } = useGetMedicinePrescriptionsQuery({
    variables: { locale: lang },
  })

  const prescriptions = data?.healthDirectoratePrescriptions.prescriptions
  console.log('data', data)
  const stringMaxLength = 22

  const filterList = (id: HealthDirectoratePrescribedItemCategory) => {
    if (!prescriptions) return []
    if (activeTag !== id) setActiveTag(id)
    if (id === HealthDirectoratePrescribedItemCategory.Owner)
      return prescriptions
    return prescriptions.filter((item) => item.category === id)
  }

  const tagLabels = [
    {
      label: 'Öll lyf',
      id: HealthDirectoratePrescribedItemCategory.Owner,
    },
    {
      label: 'Föst lyf',
      id: HealthDirectoratePrescribedItemCategory.Regular,
    },
    {
      label: 'Tímabundin lyf',
      id: HealthDirectoratePrescribedItemCategory.Pn,
    },
    {
      label: 'Lyfjakúrar',
      id: HealthDirectoratePrescribedItemCategory.Regimen,
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
        {!loading && !error && filteredData?.length > 0 && (
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
              filteredData.map((item, i) => ({
                id: item?.productId ?? `${i}`,
                medicine: item?.productName ?? '',
                usedFor: item?.indication ?? '',
                process: '',
                validTo: formatDate(item?.expiryDate) ?? '',
                status: undefined,

                // lastNode:
                //   item?.status.type === 'renew'
                //     ? {
                //         type: 'action',
                //         label: formatMessage(messages.renew),
                //         action: () => {
                //           setActivePrescription(item)
                //           setOpenModal(true)
                //         },
                //         icon: { icon: 'reload', type: 'outline' },
                //       }
                //     : item?.status.type === 'tooltip'
                //     ? {
                //         type: 'info',
                //         label: item.status.data,
                //         text: formatMessage(messages.notValidForRenewal),
                //       }
                //     : { type: 'text', label: item.status.data },

                children: (
                  <Box background={'blue100'} paddingBottom={1}>
                    <Stack space={2}>
                      <NestedInfoLines
                        backgroundColor="blue"
                        label={formatMessage(messages.moreDetailedInfo)}
                        data={MedicinePrescriptionDetailData}
                      />
                      <NestedInfoLines
                        backgroundColor="blue"
                        label={formatMessage(messages.version)}
                        data={MedicinePrescriptionDetailData2}
                      />
                      <DispensingContainer
                        backgroundColor="blue"
                        label={formatMessage(messages.dispenseHistory)}
                        data={MedicineDispenseData}
                      />
                    </Stack>
                  </Box>
                ),
                subTitleFirstCol: item?.dosageInstructions ?? '',
              })) ?? []
            }
          />
        )}
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
      {!error && !filteredData.length && (
        <EmptyTable
          loading={loading}
          message={formatMessage(messages.noDataFound, { arg: 'lyf' })}
        />
      )}
    </IntroWrapper>
  )
}

export default MedicinePrescriptions
