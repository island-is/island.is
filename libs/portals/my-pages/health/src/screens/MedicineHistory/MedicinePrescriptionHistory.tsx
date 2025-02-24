import { HealthDirectorateMedicineHistoryDispensation } from '@island.is/api/schema'
import { Box, Icon, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  SortableTable,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { useGetMedicineHistoryQuery } from '../MedicinePrescriptions/Prescriptions.generated'
import DispensingContainer from '../../components/DispensingContainer/DispensingContainer'
import DispensingDetailModal from '../../components/DispensingContainer/DispensingDetailModal'

const MedicinePrescriptionHistory = () => {
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const [activeDispensation, setActiveDispensation] = useState<
    HealthDirectorateMedicineHistoryDispensation | undefined
  >(undefined)
  const [openModal, setOpenModal] = useState(false)
  const { data, loading, error } = useGetMedicineHistoryQuery({
    variables: { locale: lang },
  })

  const history = data?.healthDirectorateMedicineHistory.medicineHistory

  return (
    <IntroWrapper
      title={formatMessage(messages.medicinePrescriptionHistory)}
      intro={formatMessage(messages.medicinePrescriptionHistoryIntroText)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicinePrescriptionsTooltip,
      )}
    >
      {!loading && !error && history && history.length > 0 && (
        <SortableTable
          title=""
          labels={{
            medicine: formatMessage(messages.medicineTitle),
            usedFor: formatMessage(messages.usedFor),
            lastDispensed: formatMessage(messages.lastDispensed),
            processCount: formatMessage(messages.process),
          }}
          expandable
          align="left"
          defaultSortByKey="medicine"
          mobileTitleKey="medicine"
          ellipsisLength={22}
          items={
            history?.map((item, i) => ({
              id: item?.id ?? `${i}`,
              medicine: item?.name ?? '',
              usedFor: item?.indication ?? '',
              lastDispensed: formatDate(item?.lastDispensationDate),
              children: (
                <Box padding={1} background={'blue100'}>
                  <Stack space={2}>
                    <DispensingContainer
                      backgroundColor="blue"
                      label={formatMessage(messages.dispenseHistory)}
                      showMedicineName
                      data={item?.dispensations.map((subItem, subIndex) => {
                        return {
                          pharmacy:
                            subItem.agentName ??
                            formatMessage(messages.notRegistered),
                          icon: (
                            <Icon
                              icon={subItem?.date ? 'checkmark' : 'remove'}
                              size="medium"
                              color={subItem?.date ? 'mint600' : 'dark300'}
                              type="outline"
                            />
                          ),
                          date: formatDate(subItem.date),
                          medicine:
                            subItem?.name ??
                            item.name ??
                            formatMessage(messages.notRegistered),
                          number: (subIndex + 1).toString(),
                          quantity: subItem.quantity ?? '',
                          button: {
                            text: formatMessage(messages.detail),
                            onClick: () => {
                              setActiveDispensation(subItem)
                              setOpenModal(true)
                            },
                          },
                        }
                      })}
                    />
                  </Stack>
                </Box>
              ),
            })) ?? []
          }
        />
      )}
      {openModal && activeDispensation && (
        <DispensingDetailModal
          id={activeDispensation.id ?? ''}
          activeDispensation={activeDispensation}
          toggleClose={openModal}
          isVisible={openModal}
          closeModal={() => setOpenModal(false)}
        />
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}

      {!error && history && history.length === 0 && (
        <EmptyTable
          loading={loading}
          message={formatMessage(messages.noDataFound, {
            arg: formatMessage(messages.medicineTitle).toLowerCase(),
          })}
        />
      )}
    </IntroWrapper>
  )
}

export default MedicinePrescriptionHistory
