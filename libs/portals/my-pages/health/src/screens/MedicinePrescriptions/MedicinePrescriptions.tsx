import { Box, Icon, Pagination, Stack, Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  SortableTable,
} from '@island.is/portals/my-pages/core'
import React, { useState } from 'react'
import { messages } from '../../lib/messages'

import {} from '../../utils/mockData'
import RenewPrescriptionModal from './components/RenewPrescriptionModal/RenewPrescriptionModal'
import { useGetMedicinePrescriptionsQuery } from './Prescriptions.generated'
import { HealthDirectoratePrescribedItemCategory } from '@island.is/api/schema'
import { Problem } from '@island.is/react-spa/shared'
import NestedInfoLines from '../../components/NestedInfoLines/NestedInfoLines'
import DispensingContainer from '../../components/DispensingContainer/DispensingContainer'

const ITEMS_ON_PAGE = 10

const MedicinePrescriptions = () => {
  const { formatMessage, lang } = useLocale()
  const [activePrescription, setActivePrescription] = React.useState<any>(null)
  const [openModal, setOpenModal] = useState(false)
  const [activeTag, setActiveTag] =
    useState<HealthDirectoratePrescribedItemCategory>(
      HealthDirectoratePrescribedItemCategory.Owner,
    )
  const [page, setPage] = useState(1)

  const { data, error, loading } = useGetMedicinePrescriptionsQuery({
    variables: { locale: lang },
  })

  const prescriptionDetail: { [key: string]: string } = {
    medicine: formatMessage(messages.medicineTitle),
    type: formatMessage(messages.type),
    form: formatMessage(messages.medicineForm),
    usedFor: formatMessage(messages.usedFor),
    prescribedAmount: formatMessage(messages.prescribedAmount),
    usage: formatMessage(messages.usage),
  }
  const prescriptionPublication: { [key: string]: string } = {
    date: formatMessage(messages.publicationDate),
    doctor: formatMessage(messages.doctor),
    validTo: formatMessage(messages.medicineValidTo),
  }

  const prescriptions = data?.healthDirectoratePrescriptions.prescriptions

  const stringMaxLength = 22

  const filterList = (id: HealthDirectoratePrescribedItemCategory) => {
    if (!prescriptions) return []
    if (activeTag !== id) setActiveTag(id)
    if (id === HealthDirectoratePrescribedItemCategory.Owner)
      return prescriptions.slice(
        ITEMS_ON_PAGE * (page - 1),
        ITEMS_ON_PAGE * page,
      )
    return prescriptions
      .filter((item) => item.category === id)
      .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
  }

  const totalPages =
    prescriptions && prescriptions.length > ITEMS_ON_PAGE
      ? Math.ceil(prescriptions.length / ITEMS_ON_PAGE)
      : 0

  const tagLabels = [
    {
      label: formatMessage(messages.allMedicine),
      id: HealthDirectoratePrescribedItemCategory.Owner,
    },
    {
      label: formatMessage(messages.regularMedicine),
      id: HealthDirectoratePrescribedItemCategory.Regular,
    },
    {
      label: formatMessage(messages.temporaryMedicine),
      id: HealthDirectoratePrescribedItemCategory.Pn,
    },
    {
      label: formatMessage(messages.regimenMedicine),
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
      {error && !loading && <Problem error={error} noBorder={false} />}

      {!error && filteredData.length === 0 && (
        <EmptyTable
          loading={loading}
          message={formatMessage(messages.noDataFound, { arg: 'lyf' })}
        />
      )}
      {!loading && !error && filteredData?.length > 0 && (
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
              filteredData.map((item, i) => ({
                id: item?.id ?? `${i}`,
                medicine: item?.name ?? '',
                usedFor: item?.indication ?? '',
                process: item?.amountRemaining ?? '',
                validTo: formatDate(item?.expiryDate) ?? '',
                status: undefined,
                lastNode: item?.isRenewable
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

                children: (
                  <Box background="blue100" paddingBottom={1}>
                    <Stack space={2}>
                      <NestedInfoLines
                        backgroundColor="blue"
                        label={formatMessage(messages.moreDetailedInfo)}
                        data={[
                          {
                            title: prescriptionDetail.medicine,
                            value: item?.name ?? '',
                          },
                          {
                            title: prescriptionDetail.type,
                            value: item?.type ?? '',
                          },
                          {
                            title: prescriptionDetail.form,
                            value: item?.form ?? '',
                          },
                          {
                            title: prescriptionDetail.usedFor,
                            value: item?.indication ?? '',
                          },

                          {
                            title: prescriptionDetail.prescribedAmount,
                            value: item?.totalPrescribedAmount ?? '',
                          },
                          {
                            title: prescriptionDetail.usage,
                            value: item?.dosageInstructions ?? '',
                          },
                        ]}
                      />
                      <NestedInfoLines
                        backgroundColor="blue"
                        label={formatMessage(messages.version)}
                        data={[
                          {
                            title: prescriptionPublication.date,
                            value: formatDate(item?.issueDate) ?? '',
                          },
                          {
                            title: prescriptionPublication.doctor,
                            value: item?.prescriberName ?? '',
                          },
                          {
                            title: prescriptionPublication.validTo,
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
                    </Stack>
                  </Box>
                ),
                subTitleFirstCol: item?.dosageInstructions ?? '',
              })) ?? []
            }
          />
        </Box>
      )}

      {activePrescription && (
        <RenewPrescriptionModal
          id={`renewPrescriptionModal-${activePrescription.id}`}
          activePrescription={activePrescription}
          toggleClose={openModal}
          isVisible={openModal}
        />
      )}

      {totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(page)}
                component="button"
              >
                {children}
              </Box>
            )}
          />
        </Box>
      ) : null}
    </IntroWrapper>
  )
}

export default MedicinePrescriptions
