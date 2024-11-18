import React, { useState } from 'react'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  HEALTH_DIRECTORATE_SLUG,
  IntroHeader,
  SortableTable,
  m,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { delegationData, Delegation } from './utils/mockdata'
import DelegationModal from './components/DelegationModal'

const MedicineDelegation = () => {
  const { formatMessage } = useLocale()
  const [newDelegationModelOpen, setNewDelegationModelOpen] = useState(false)

  return (
    <>
      <IntroHeader
        title={formatMessage(messages.medicineDelegation)}
        intro={formatMessage(messages.medicineDelegationIntroText)}
        serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
        serviceProviderTooltip={formatMessage(
          messages.landlaeknirMedicineDelegationTooltip,
        )}
      />
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
            items={delegationData.map((item, i) => ({
              id: item.id ?? `${i}`,
              name: item.name,
              kennitala: item.nationalId,
              delegationType: item.delegationType,
              date: item.date.toDateString(),
              change: (
                <DelegationModal
                  id={`delegationRegistrationModal-${item.id}`}
                  activeDelegation={item}
                  disclosure={
                    <Button
                      as="span"
                      size="small"
                      variant="text"
                      unfocusable
                      icon="pencil"
                      onClick={() => {
                        console.log('clicking edit button')
                      }}
                    >
                      {formatMessage(m.buttonEdit)}
                    </Button>
                  }
                />
              ),
            }))}
          />
        )}

        <DelegationModal
          id="newDelegationRegistrationModal"
          activeDelegation={undefined}
          disclosure={
            <Box display="flex" flexDirection="rowReverse" marginTop={4}>
              <Button
                size="medium"
                icon="add"
                type="button"
                onClick={() => {
                  setNewDelegationModelOpen(true)
                }}
              >
                {formatMessage(messages.addDelegation)}
              </Button>
            </Box>
          }
        />
      </Box>
    </>
  )
}

export default MedicineDelegation
