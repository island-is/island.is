import React from 'react'
import { useIntl } from 'react-intl'
import { View } from 'react-native'
import { StackScreen } from '@/components/stack-screen'

import { MedicineDelegationTab } from '@/components/health-tabs/medicine-delegation-tab'

export default function MedicineDelegationScreen() {
  const intl = useIntl()

  return (
    <View style={{ flex: 1 }}>
      <StackScreen
        options={{
          title: intl.formatMessage({
            id: 'health.medicineDelegation.screenTitle',
          }),
        }}
      />
      {/* The tab owns its query, pull-to-refresh, skeletons and error state, so
          this route is only responsible for giving it a screen to live on. */}
      <MedicineDelegationTab />
    </View>
  )
}
