import { HealthDirectorateMedicineHistoryDispensation } from '@island.is/api/schema'
import { Box, Button, Icon } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  SortableTable,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useState } from 'react'
import DispensingContainer from '../../components/DispensingContainer/DispensingContainer'
import DispensingDetailModal from '../../components/DispensingContainer/DispensingDetailModal'
import { messages } from '../../lib/messages'
import {
  useGetMedicineDispensationForAtcLazyQuery,
  useGetMedicineHistoryQuery,
} from './MedicineHistory.generated'

const MAX_DISPENSATIONS = 3
interface ActiveDispensation {
  id: string
  activeDispensation: HealthDirectorateMedicineHistoryDispensation
  dispensationNumber: number
}

const MedicinePrescriptionHistory = () => {
  const { formatMessage, lang } = useLocale()
  const [activeDispensation, setActiveDispensation] = useState<
    ActiveDispensation | undefined
  >(undefined)
  const [openModal, setOpenModal] = useState(false)
  const [atcCode, setAtcCode] = useState<string>()

  const [dispensations, setDispensations] = useState<{
    id?: string
    data: Array<HealthDirectorateMedicineHistoryDispensation>
  }>()

  const { data, loading, error } = useGetMedicineHistoryQuery({
    variables: { locale: lang },
  })

  const [getMedicineDispensationsATC, { loading: atcLoading, data: atcData }] =
    useGetMedicineDispensationForAtcLazyQuery({
      fetchPolicy: 'no-cache',
    })

  const history = data?.healthDirectorateMedicineHistory.medicineHistory ?? []

  useEffect(() => {
    if (atcData) {
      setDispensations({
        id: atcCode,
        data: atcData.healthDirectorateMedicineDispensationsATC.dispensations,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atcData])

  return (
    <IntroWrapper
      title={formatMessage(messages.medicinePrescriptionHistory)}
      intro={formatMessage(messages.medicinePrescriptionHistoryIntroText)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicinePrescriptionsTooltip,
      )}
      childrenWidthFull
      marginBottom={6}
    >
      {!error && (
        <SortableTable
          title=""
          labels={{
            medicine: formatMessage(messages.medicineTitle),
            usedFor: formatMessage(messages.usedFor),
            lastDispensed: formatMessage(messages.lastDispensed),
            numberOfDispensations: formatMessage(messages.process),
          }}
          expandable
          align="left"
          defaultSortByKey="lastDispensed"
          sortBy="descending"
          mobileTitleKey="medicine"
          ellipsisLength={22}
          tableLoading={loading}
          items={
            history?.map((item, i) => ({
              id: item?.id ?? `${i}`,
              medicine: item?.name ?? '',
              usedFor: item?.indication ?? '',
              lastDispensed: formatDate(item?.lastDispensationDate),
              numberOfDispensations: item.dispensationCount,
              children: (
                <Box padding={1} background="blue100">
                  <DispensingContainer
                    backgroundColor="blue"
                    label={formatMessage(messages.dispenseHistory)}
                    data={(dispensations && dispensations.id === item.atcCode
                      ? dispensations.data
                      : item.dispensations
                    )?.map((subItem, subIndex) => {
                      return {
                        id:
                          subItem.id ??
                          subItem.name + '-' + subIndex.toString(),
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
                        date: subItem.date
                          ? formatDate(new Date(subItem.date))
                          : '',
                        strength: subItem.strength ?? '',
                        medicine:
                          subItem?.name ??
                          item.name ??
                          formatMessage(messages.notRegistered),
                        number: (subIndex + 1).toString(),
                        quantity: subItem.quantity ?? '',
                        button: {
                          text: formatMessage(messages.detail),
                          onClick: () => {
                            setActiveDispensation({
                              id:
                                subItem.id ||
                                subItem.name + '-' + subIndex.toString(),
                              dispensationNumber: subIndex + 1,
                              activeDispensation: subItem,
                            })
                            setOpenModal(true)
                          },
                        },
                      }
                    })}
                  />
                  {(dispensations?.data.length ??
                    MAX_DISPENSATIONS < MAX_DISPENSATIONS + 1) &&
                    item.atcCode &&
                    (item.dispensationCount || 0) > MAX_DISPENSATIONS && (
                      <Box
                        display="flex"
                        justifyContent={[
                          'flexStart',
                          'flexStart',
                          'flexStart',
                          'center',
                        ]}
                        marginBottom={[0, 0, 0, 1, 2]}
                        marginTop={[2, 2, 2, 0, 0]}
                      >
                        <Button
                          variant="text"
                          size="small"
                          loading={atcLoading}
                          disabled={
                            atcCode === item.atcCode &&
                            dispensations?.id === item.atcCode
                          }
                          onClick={() => {
                            if (item.atcCode) {
                              setAtcCode(item.atcCode)
                              getMedicineDispensationsATC({
                                variables: {
                                  input: { atcCode: item.atcCode },
                                  locale: lang,
                                },
                              })
                            }
                          }}
                        >
                          {formatMessage(messages.fetchMore)}
                        </Button>
                      </Box>
                    )}
                </Box>
              ),
            })) ?? []
          }
        />
      )}
      {activeDispensation && (
        <DispensingDetailModal
          id={activeDispensation.id}
          activeDispensation={activeDispensation.activeDispensation}
          toggleClose={openModal}
          isVisible={openModal}
          closeModal={() => {
            setOpenModal(false)
            setActiveDispensation(undefined)
          }}
        />
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}

      {!error && !loading && history && history.length === 0 && (
        <EmptyTable
          message={formatMessage(messages.noDataFound, {
            arg: formatMessage(messages.medicineTitle).toLowerCase(),
          })}
        />
      )}
    </IntroWrapper>
  )
}

export default MedicinePrescriptionHistory
