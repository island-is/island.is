import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  SortableTable,
  m,
} from '@island.is/portals/my-pages/core'
import { useState } from 'react'
import { messages } from '../../lib/messages'
import DelegationModal from './components/DelegationModal'
import { delegationData } from './utils/mockdata'

const MedicineDelegation = () => {
  const { formatMessage } = useLocale()
  const [newDelegationModelOpen, setNewDelegationModelOpen] = useState<{
    id: string
    open: boolean
  } | null>(null)

  const openModal = (id: string) => {
    setNewDelegationModelOpen({ id, open: true })
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
      <Box>
        <Text as="h2" fontWeight="medium" marginBottom={2}>
          {formatMessage(messages.myDelegations)}
        </Text>
        {delegationData.length === 0 ? (
          <EmptyTable />
        ) : (
          <SortableTable
            labels={{
              name: formatMessage(m.name),
              kennitala: formatMessage(m.natreg),
              delegationType: formatMessage(messages.delegationType),
              date: formatMessage(m.dateShort),
            }}
            defaultSortByKey="name"
            mobileTitleKey="name"
            items={delegationData.map((item, i) => ({
              id: item.id ?? `${i}`,
              name: item.name,
              kennitala: item.nationalId,
              delegationType: item.delegationType,
              date: item.date.toDateString(),
              lastNode: {
                type: 'action',
                label: formatMessage(m.buttonEdit),
                icon: { icon: 'pencil', type: 'outline' },
                action: () => openModal(item.id),
              },
            }))}
          />
        )}
        {delegationData.map((item, i) => {
          return (
            <DelegationModal
              key={i}
              id={`delegationRegistrationModal-${item.id}`}
              activeDelegation={item}
              visible={
                newDelegationModelOpen?.id === item.id &&
                newDelegationModelOpen.open
              }
            />
          )
        })}
      </Box>
    </IntroWrapper>
  )
}

export default MedicineDelegation
