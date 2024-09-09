import React, { useState } from 'react'
import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroHeader,
  LinkButton,
  SortableTable,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { m } from '@island.is/service-portal/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { delegationData } from './utils/mockdata'
import DelegationChange from './components/DelegationChange'

const MedicineDelegation = () => {
  const { formatMessage } = useLocale()
  const [modalVisible, setModalVisible] = useState<boolean>(false)

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
            kennitala: item.kennitala,
            delegationType: item.delegationType,
            date: item.date,
            change: (
              <Button
                as="span"
                size={'small'}
                variant="text"
                unfocusable
                icon={'pencil'}
                onClick={() => setModalVisible(true)}
              >
                {formatMessage(m.buttonEdit)}
              </Button>
            ),
          }))}
        />
        <Box display="flex" flexDirection="rowReverse" marginTop={4}>
          <Button
            size="medium"
            icon="add"
            type="button"
            onClick={() => setModalVisible(true)}
          >
            {formatMessage(messages.addDelegation)}
          </Button>
        </Box>
        <DelegationChange
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </Box>
    </>
  )
}

export default MedicineDelegation
