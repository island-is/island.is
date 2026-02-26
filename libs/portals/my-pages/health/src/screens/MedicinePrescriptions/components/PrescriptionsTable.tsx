import { HealthDirectoratePrescription } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  LoadingDots,
  Stack,
  Tag,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate, SortableTable } from '@island.is/portals/my-pages/core'
import React, { useEffect, useState } from 'react'
import DispensingContainer from '../../../components/DispensingContainer/DispensingContainer'
import NestedInfoLines from '../../../components/NestedInfoLines/NestedInfoLines'
import { messages } from '../../../lib/messages'
import { mapBlockedStatus } from '../../../utils/mappers'
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
  // This state is used to handle errors, but currently not displayed in the UI. Will be after service fixes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)
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
      setError(formatMessage(messages.errorFetchingUrl))
    } finally {
      setPdfLoading(false)
    }
  }

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
          prescriptions?.map((item, i) => {
            const isExpired = item.expiryDate
              ? new Date(item.expiryDate) < new Date()
              : false

            const blockedStatus = !item.isRenewable
              ? mapBlockedStatus(
                  item.renewalBlockedReason?.toString() ?? '',
                  formatMessage,
                )
              : null

            return {
              id: `${item.id}-${i}`,
              medicine: item?.name + ' ' + item?.strength,
              usedFor: item?.indication ?? '',
              process: item?.amountRemaining ?? '',
              validTo: isExpired ? (
                <Tag variant="red" disabled outlined>
                  {formatMessage(messages.expired)}
                </Tag>
              ) : (
                formatDate(item?.expiryDate) ?? ''
              ),
              status: undefined,
              lastNode: item?.isRenewable
                ? {
                    type: 'action' as const,
                    label: formatMessage(messages.renew),
                    action: () => {
                      setActivePrescription(item)
                      setOpenModal(true)
                    },
                    icon: { icon: 'reload' as const, type: 'outline' as const },
                  }
                : {
                    type: 'text' as const,
                    label: blockedStatus?.status ?? '',
                    text:
                      item.renewResponseMessage || blockedStatus?.description,
                  },

              onExpandCallback: () => {
                fetchPDFlink(item.id)
              },

              children: (
                <Box background="blue100" paddingBottom={1}>
                  {blockedStatus?.showReason && (
                    <Box paddingX={[0, 0, 3]} marginBottom={[2, 2, 0]}>
                      <AlertMessage
                        type="info"
                        message={
                          item.renewResponseMessage || blockedStatus.description
                        }
                      />
                    </Box>
                  )}

                  <Stack space={2}>
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
                          {
                            title: formatMessage(messages.medicineStrength),
                            value: item?.strength ?? '',
                          },
                          {
                            title: formatMessage(messages.usedFor),
                            value: item?.indication ?? '',
                          },
                          {
                            title: formatMessage(messages.usage),
                            value: item?.dosageInstructions ?? '',
                          },
                          ...(pdfLoading
                            ? [
                                {
                                  title: formatMessage(messages.fylgiskjalNr, {
                                    arg: 1,
                                  }),
                                  value: <LoadingDots />,
                                },
                              ]
                            : item.documents?.map((doc, index) => ({
                                title: formatMessage(messages.fylgiskjalNr, {
                                  arg: index + 1,
                                }),
                                value: formatMessage(
                                  messages.openFylgiskjalNr,
                                  {
                                    arg: index + 1,
                                  },
                                ),
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
                            title: formatMessage(messages.prescribedAmount),
                            value: item?.totalPrescribedAmount ?? '',
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
                            id:
                              dispensation.id.toString() ??
                              dispensation.name + '-' + di.toString(),
                            date: formatDate(dispensation?.date),
                            medicine: dispensation.name ?? '',
                            strength: dispensation.strength ?? '',
                            number: (di + 1).toString() ?? '',
                            pharmacy: dispensation?.pharmacy ?? '',
                            quantity: dispensation?.amount ?? '',
                          }))}
                        />
                      )}
                    </>
                  </Stack>
                </Box>
              ),
              subTitleFirstCol: item?.dosageInstructions ?? '',
            }
          }) ?? []
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
