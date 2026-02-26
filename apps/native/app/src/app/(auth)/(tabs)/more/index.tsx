import { useRef } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  TouchableHighlight,
  View,
  SafeAreaView,
  TouchableNativeFeedback,
  Image,
} from 'react-native'
import { Stack, useRouter } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'

import airplaneIcon from '@/assets/icons/airplane.png'
import assetsIcon from '@/assets/icons/assets.png'
import familyIcon from '@/assets/icons/family.png'
import financeIcon from '@/assets/icons/finance.png'
import healthIcon from '@/assets/icons/health.png'
import vehicleIcon from '@/assets/icons/vehicle.png'
import { MoreInfoContiner } from '@/components/more-info-container/more-info-container'
import { formatNationalId } from '@/lib/format-national-id'
import { useMyPagesLinks } from '@/lib/my-pages-links'
import { useAuthStore } from '@/stores/auth-store'
import { FamilyMemberCard, MoreCard, TopLine } from '@/ui'

const Row = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing[1]}px;
  column-gap: ${({ theme }) => theme.spacing[2]}px;
  flex-direction: row;
`

export default function MoreScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const router = useRouter()
  const authStore = useAuthStore()
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
      <Stack.Screen
        options={{
          headerTitle: intl.formatMessage({ id: 'profile.screenTitle' }),
          headerRight: () => (
            <>
              <TouchableNativeFeedback
                onPress={() => router.navigate('/settings')}
              >
                <Image
                  source={require('@/assets/icons/settings.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableNativeFeedback>
            </>
          ),
        }}
      />
      <Animated.ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <SafeAreaView style={{ marginBottom: theme.spacing[1] }}>
          <TouchableHighlight
            underlayColor={
              theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
            }
            onPress={() => {
              router.navigate('/personal-info')
            }}
          >
            <FamilyMemberCard
              name={authStore.userInfo?.name ?? ''}
              nationalId={formatNationalId(authStore.userInfo?.nationalId)}
            />
          </TouchableHighlight>
        </SafeAreaView>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.family' })}
            icon={familyIcon}
            onPress={() => router.navigate('/more/family')}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.vehicles' })}
            icon={vehicleIcon}
            onPress={() => router.navigate('/more/vehicles')}
          />
        </Row>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.assets' })}
            icon={assetsIcon}
            onPress={() => router.navigate('/more/assets')}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.finance' })}
            icon={financeIcon}
            onPress={() => router.navigate('/more/finance')}
          />
        </Row>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'applications.title' })}
            icon={require('@/assets/icons/tabbar-applications.png')}
            onPress={() => router.navigate('/more/applications')}
          />
          <MoreCard
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
