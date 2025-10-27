import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import DelegationModal from './components/DelegationModal'
import { useGetMedicineDelegationsQuery } from './MedicineDelegation.generated'

const MedicineDelegationDetail = () => {
  const { formatMessage, lang } = useLocale()
  const { id } = useParams<{ id: string }>()
  const [modalVisible, setModalVisible] = useState(false)

  const { data, loading, error } = useGetMedicineDelegationsQuery({
    variables: {
      locale: lang,
      input: {
        active: false,
      },
    },
  })
  const filteredData = data?.healthDirectorateMedicineDelegations?.items?.find(
    (item) => item.nationalId === id,
  )

  if (!filteredData) {
    return <Problem type="no_data" />
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.medicineDelegation)}
      intro={formatMessage(messages.medicineDelegationIntroText)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicineDelegationTooltip,
      )}
      loading={loading}
    >
      {!loading && !error && !filteredData && <Problem type="no_data" />}
      <InfoLineStack label={formatMessage(m.info)} space={1}>
        <InfoLine
          label={formatMessage(messages.nameHuman)}
          content={filteredData.name ?? ''}
        />
        <InfoLine
          label={formatMessage(m.natreg)}
          content={
            filteredData.nationalId
              ? `${filteredData.nationalId.slice(
                  0,
                  -4,
                )}-${filteredData.nationalId.slice(-4)}`
              : ''
          }
        />
        <InfoLine
          label={formatMessage(messages.status)}
          content={
            filteredData.isActive
              ? formatMessage(messages.valid)
              : formatMessage(messages.invalid)
          }
        />
        <InfoLine
          label={formatMessage(messages.validityPeriod)}
          content={
            formatDate(filteredData.dates?.from) +
            ' - ' +
            formatDate(filteredData.dates?.to)
          }
          button={
            filteredData.isActive
              ? {
                  type: 'action',
                  label: formatMessage(messages.deleteDelegation),
                  action: () => setModalVisible(true),
                  variant: 'text',
                  icon: 'trash',
                }
              : undefined
          }
        />
        <InfoLine
          label={formatMessage(messages.permitValidForShort)}
          content={
            filteredData.lookup
              ? formatMessage(messages.pickupMedicineAndLookup)
              : formatMessage(messages.pickupMedicine)
          }
        />
      </InfoLineStack>

      <DelegationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        id={filteredData.nationalId ?? 'medicine-delegation'}
        activeDelegation={filteredData}
      />
    </IntroWrapper>
  )
}

export default MedicineDelegationDetail
