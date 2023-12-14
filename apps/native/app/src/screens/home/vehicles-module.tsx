import { ChevronRight, Heading, NotificationCard } from '@ui'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { useIntl } from 'react-intl'
import { navigateTo } from 'src/lib/deep-linking'

export const VehiclesModule = React.memo(() => {
  const intl = useIntl()

  return (
    <SafeAreaView style={{ marginHorizontal: 16, marginTop: 16 }}>
      <Heading
        button={
          <TouchableOpacity onPress={() => navigateTo('/vehicles')}>
            {intl.formatMessage({ id: 'button.seeAll' })}
            <ChevronRight />
          </TouchableOpacity>
        }
      >
        {intl.formatMessage({ id: 'profile.vehicles' })}
      </Heading>
      <NotificationCard
        id="VehicleNotification"
        onPress={() => navigateTo('/vehicles')}
        title={intl.formatMessage({ id: 'vehicleDetail.odometer' })}
        message={intl.formatMessage({ id: 'home.vehicleModule.summary' })}
        actions={[
          {
            text: intl.formatMessage({ id: 'home.vehicleModule.button' }),
            onPress: () => navigateTo('/vehicles'),
          },
        ]}
      />
    </SafeAreaView>
  )
})
