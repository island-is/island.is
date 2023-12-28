import {
  ChevronRight,
  Heading,
  NotificationCard,
  Typography,
  blue400,
} from '@ui'
import React from 'react'
import { useIntl } from 'react-intl'
import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native'
import vehicleIcon from '../../assets/icons/vehicle.png'
import { navigateTo } from '../../lib/deep-linking'

export const VehiclesModule = React.memo(() => {
  const intl = useIntl()

  return (
    <SafeAreaView style={{ marginHorizontal: 16, marginTop: 16 }}>
      <Heading
        button={
          <TouchableOpacity
            onPress={() => navigateTo('/vehicles')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Typography weight="400" color={blue400}>
              {intl.formatMessage({ id: 'button.seeAll' })}
            </Typography>
            <ChevronRight />
          </TouchableOpacity>
        }
      >
        {intl.formatMessage({ id: 'profile.vehicles' })}
      </Heading>
      <NotificationCard
        id="VehicleNotification"
        onPress={() => navigateTo('/vehicles')}
        icon={
          <View
            style={{
              borderRadius: 32,
              backgroundColor: 'white',
              padding: 3,
              marginRight: 8,
            }}
          >
            <Image
              source={vehicleIcon as any}
              style={{
                width: 16,
                height: 16,
              }}
              resizeMode="contain"
            />
          </View>
        }
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
