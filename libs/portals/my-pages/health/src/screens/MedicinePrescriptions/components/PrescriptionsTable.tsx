import { HealthDirectoratePrescription } from '@island.is/api/schema'
import { Box, Icon, LoadingDots, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate, SortableTable } from '@island.is/portals/my-pages/core'
import React, { useEffect, useState } from 'react'
import DispensingContainer from '../../../components/DispensingContainer/DispensingContainer'
import NestedInfoLines from '../../../components/NestedInfoLines/NestedInfoLines'
import { messages } from '../../../lib/messages'
import { PrescriptionItem } from '../../../utils/types'
import { useGetPrescriptionDocumentsLazyQuery } from '../Prescriptions.generated'
import RenewPrescriptionModal from './RenewPrescriptionModal/RenewPrescriptionModal'

const STRING_MAX_LENGTH = 22

interface Props {
  data?: HealthDirectoratePrescription[]
  loading?: boolean
}

const PrescriptionsTable: React.FC<Props> = ({ data, loading }) => {
  const { formatMessage } = useLocale()

  const [activePrescription, setActivePrescription] =
    useState<PrescriptionItem | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [prescriptions, setPrescriptions] = useState<
    Array<PrescriptionItem> | undefined
  >(data)

  const [getDocuments] = useGetPrescriptionDocumentsLazyQuery()

  useEffect(() => {
    if (data) {
      setPrescriptions(data)
    }
  }, [data])

  const fetchPDFlink = async (id: string) => {
    if (pdfLoading) return
    setPdfLoading(true)

    try {
      const response = await getDocuments({ variables: { input: { id } } })

      const currentPrescription = prescriptions?.find((item) => item.id === id)

      const documents =
        response.data?.healthDirectoratePrescriptionDocuments.documents

      if (currentPrescription) {
        const updatedPrescription: PrescriptionItem = {
          ...currentPrescription,
          documents: documents?.map((doc) => ({
            id: doc.id ?? '',
            url: doc.url ?? '',
            name: doc.name ?? '',
          })),
        }

        setPrescriptions((prevPrescriptions) =>
          prevPrescriptions?.map((prescription) =>
            prescription.id === id ? updatedPrescription : prescription,
          ),
        )
      }
    } catch (error) {
      console.error('Error fetching URL:', error)
    } finally {
      setPdfLoading(false)
    }
  }

  console.log('activePrescription', activePrescription)
  console.log('is Modal open? ', openModal)
  return (
    <>
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
        ellipsisLength={STRING_MAX_LENGTH}
        emptyTableMessage={formatMessage(messages.noSearchResults)}
        tableLoading={loading}
        items={
          prescriptions?.map((item, i) => ({
            id: `${item.id}-${i}`,
            medicine: item?.name ?? '',
            usedFor: item?.indication ?? '',
            process: item?.amountRemaining ?? '',
            validTo: formatDate(item?.expiryDate) ?? '',
            status: undefined,
            lastNode: true //item?.isRenewable // TODO: Add this back when the API is ready
              ? {
                  type: 'action',
                  label: formatMessage(messages.renew),
                  action: () => {
                    setActivePrescription(item)
                    setOpenModal(true)
                  },
                  icon: { icon: 'reload', type: 'outline' },
                }
              : {
                  type: 'info',
                  label: item.renewalBlockedReason?.toString() ?? '',
                  text: formatMessage(messages.notValidForRenewal),
                },

            onExpandCallback: () => {
              fetchPDFlink(item.id)
            },

            children: (
              <Box background="blue100" paddingBottom={1}>
                <Stack space={2}>
                  {pdfLoading &&
                  (!item.documents || item.documents.length === 0) ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      padding={3}
                    >
                      <LoadingDots />
                    </Box>
                  ) : (
                    <>
                      <NestedInfoLines
                        backgroundColor="blue"
                        label={formatMessage(messages.moreDetailedInfo)}
                        data={[
                          {
                            title: formatMessage(messages.medicineTitle),
                            value: item?.name ?? '',
                            href: item?.url ?? '',
                            type: 'link',
                          },

                          ...(item.documents?.map((doc, index) => ({
                            title: `Fylgiskjal ${index + 1}`,
                            value: `Opna fylgiskjal ${index + 1}`,
                            type: 'link' as const,
                            href: doc.url ?? '',
                          })) ?? []),
                          {
                            title: formatMessage(messages.type),
                            value: item?.type ?? '',
                          },
                          {
                            title: formatMessage(messages.medicineForm),
                            value: item?.form ?? '',
                          },
                          {
                            title: formatMessage(messages.usedFor),
                            value: item?.indication ?? '',
                          },
                          {
                            title: formatMessage(messages.prescribedAmount),
                            value: item?.totalPrescribedAmount ?? '',
                          },
                          {
                            title: formatMessage(messages.usage),
                            value: item?.dosageInstructions ?? '',
                          },
                        ]}
                      />
                      <NestedInfoLines
                        backgroundColor="blue"
                        label={formatMessage(messages.version)}
                        data={[
                          {
                            title: formatMessage(messages.publicationDate),
                            value: formatDate(item?.issueDate) ?? '',
                          },
                          {
                            title: formatMessage(messages.doctor),
                            value: item?.prescriberName ?? '',
                          },
                          {
                            title: formatMessage(messages.medicineValidTo),
                            value: formatDate(item?.expiryDate) ?? '',
                          },
                        ]}
                      />
                      {item.dispensations.length > 0 && (
                        <DispensingContainer
                          backgroundColor="blue"
                          label={formatMessage(messages.dispenseHistory)}
                          data={item.dispensations.map((dispensation, di) => ({
                            date: formatDate(dispensation?.date),
                            icon: (
                              <Icon
                                icon={
                                  dispensation?.date ? 'checkmark' : 'remove'
                                }
                                size="medium"
                                color={
                                  dispensation?.date ? 'mint600' : 'dark300'
                                }
                                type="outline"
                              />
                            ),
                            number: (di + 1).toString() ?? '',
                            pharmacy: dispensation?.agentName ?? '',
                            quantity: dispensation?.count.toString() ?? '',
                          }))}
                        />
                      )}
                    </>
                  )}
                </Stack>
              </Box>
            ),
            subTitleFirstCol: item?.dosageInstructions ?? '',
          })) ?? []
        }
      />

      {activePrescription && (
        <RenewPrescriptionModal
          id={`renewPrescriptionModal-${activePrescription.id}`}
          activePrescription={activePrescription}
          toggleClose={openModal}
          isVisible={openModal}
          setVisible={(visible: boolean) => setOpenModal(visible)}
          setActivePrescription={(prescription: PrescriptionItem | null) =>
            setActivePrescription(prescription)
          }
        />
      )}
    </>
  )
}

export default PrescriptionsTable
