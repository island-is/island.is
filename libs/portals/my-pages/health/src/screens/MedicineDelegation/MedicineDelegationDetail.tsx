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
import { delegationData } from './utils/mockdata'

const MedicineDelegationDetail = () => {
  const { formatMessage } = useLocale()
  const { id } = useParams<{ id: string }>()
  const delegation = delegationData.find((d) => d.id === id)
  const [modalVisible, setModalVisible] = useState(false)

  if (!delegation) {
    return <Problem type="not_found" />
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.medicineDelegation)}
      intro={formatMessage(messages.medicineDelegationIntroText)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicineDelegationTooltip,
      )}
    >
      <InfoLineStack label={formatMessage(m.info)} space={1}>
        <InfoLine
          label={formatMessage(messages.nameHuman)}
          content={delegation.name}
        />
        <InfoLine
          label={formatMessage(m.natreg)}
          content={`${delegation.nationalId.slice(
            0,
            -4,
          )}-${delegation.nationalId.slice(-4)}`}
        />
        {/* <InfoLine
          label={formatMessage(messages.publicationDate)}
          content={formatDateWithTime(delegation.dateFrom.toISOString())}
        /> */}
        <InfoLine
          label={formatMessage(messages.status)}
          content={
            delegation.isValid
              ? formatMessage(messages.valid)
              : formatMessage(messages.invalid)
          }
        />
        <InfoLine
          label={formatMessage(messages.validityPeriod)}
          content={
            formatDate(delegation.dateFrom) +
            ' - ' +
            formatDate(delegation.dateTo)
          }
          button={
            delegation.isValid
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
          content={delegation.delegationType}
        />
      </InfoLineStack>

      <DelegationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        id={delegation.id}
        activeDelegation={delegation}
      />
    </IntroWrapper>
  )
}

export default MedicineDelegationDetail
