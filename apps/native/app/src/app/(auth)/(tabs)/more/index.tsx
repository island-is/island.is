import { useIntl } from 'react-intl'
import {
  Animated,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'

import airplaneIcon from '@/assets/icons/airplane.png'
import assetsIcon from '@/assets/icons/assets.png'
import familyIcon from '@/assets/icons/family.png'
import financeIcon from '@/assets/icons/finance.png'
import vehicleIcon from '@/assets/icons/vehicle.png'
import { MoreInfoContiner } from '@/components/more-info-container/more-info-container'
import { useMyPagesLinks } from '@/lib/my-pages-links'
import { blue400, MoreCard } from '@/ui'
import { testIDs } from '@/utils/test-ids'
import { StackScreen } from '../../../../components/stack-screen'

const Row = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing[1]}px;
  column-gap: ${({ theme }) => theme.spacing[2]}px;
  flex-direction: row;
`

export default function MoreScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const router = useRouter()
  const myPagesLinks = useMyPagesLinks()

  const externalLinks = [
    {
      link: myPagesLinks.accessControl,
      title: intl.formatMessage({ id: 'profile.accessControl' }),
      icon: require('@/assets/icons/lock.png'),
    },
    {
      link: myPagesLinks.supportPayments,
      title: intl.formatMessage({ id: 'profile.supportPayments' }),
      icon: require('@/assets/icons/cardSuccess.png'),
    },
    {
      link: myPagesLinks.education,
      title: intl.formatMessage({ id: 'profile.education' }),
      icon: require('@/assets/icons/education.png'),
    },
    {
      link: myPagesLinks.lawAndOrder,
      title: intl.formatMessage({ id: 'profile.lawAndOrder' }),
      icon: require('@/assets/icons/lawAndOrder.png'),
    },
    {
      link: myPagesLinks.occupationalLicenses,
      title: intl.formatMessage({ id: 'profile.occupationalLicenses' }),
      icon: require('@/assets/icons/scroll.png'),
    },
  ]

  return (
    <>
      <StackScreen
        options={{
          headerRightItems: [
            {
              label: intl.formatMessage({ id: 'setting.screenTitle' }),
              type: 'button',
              icon: {
                type: 'image',
                source: require('@/assets/icons/settings.png'),
              },
              onPress: () => router.navigate('/settings'),
              tintColor: blue400
            },
          ],
        }}
      />
      <Animated.ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <Row>
          <MoreCard
            testID={testIDs.MORE_CARD_FAMILY}
            title={intl.formatMessage({ id: 'profile.family' })}
            icon={familyIcon}
            onPress={() => router.navigate('/more/family')}
          />
          <MoreCard
            testID={testIDs.MORE_CARD_VEHICLES}
            title={intl.formatMessage({ id: 'profile.vehicles' })}
            icon={vehicleIcon}
            onPress={() => router.navigate('/more/vehicles')}
          />
        </Row>
        <Row>
          <MoreCard
            testID={testIDs.MORE_CARD_ASSETS}
            title={intl.formatMessage({ id: 'profile.assets' })}
            icon={assetsIcon}
            onPress={() => router.navigate('/more/assets')}
          />
          <MoreCard
            testID={testIDs.MORE_CARD_FINANCE}
            title={intl.formatMessage({ id: 'profile.finance' })}
            icon={financeIcon}
            onPress={() => router.navigate('/more/finance')}
          />
        </Row>
        <Row>
          <MoreCard
            testID={testIDs.MORE_CARD_APPLICATIONS}
            title={intl.formatMessage({ id: 'applications.title' })}
            icon={require('@/assets/icons/tabbar-applications.png')}
            onPress={() => router.navigate('/more/applications')}
          />
          <MoreCard
            testID={testIDs.MORE_CARD_AIR_DISCOUNT}
            title={intl.formatMessage({ id: 'profile.airDiscount' })}
            icon={airplaneIcon}
            onPress={() => router.navigate('/more/air-discount')}
          />
        </Row>
        <View
          style={{
            marginTop: theme.spacing[3],
          }}
        >
          <View style={{ paddingBottom: theme.spacing[4] }}>
            <MoreInfoContiner externalLinks={externalLinks} />
          </View>
        </View>
      </Animated.ScrollView>
    </>
  )
}
