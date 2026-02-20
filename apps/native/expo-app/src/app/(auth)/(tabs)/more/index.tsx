import { useRef } from 'react'
import { useIntl } from 'react-intl'
import { Animated, TouchableHighlight, View, SafeAreaView } from 'react-native'
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
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon={require('@/assets/icons/settings.png')} onPress={() => {
          router.push('/settings')
        }} />
      </Stack.Toolbar>
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
              router.push('/personalinfo')
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
            onPress={() => router.push('/family')}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.vehicles' })}
            icon={vehicleIcon}
            onPress={() => router.push('/vehicles')}
          />
        </Row>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.assets' })}
            icon={assetsIcon}
            onPress={() => router.push('/assets')}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.finance' })}
            icon={financeIcon}
            onPress={() => router.push('/finance')}
          />
        </Row>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.health' })}
            icon={healthIcon}
            onPress={() => router.push('/health-overview')}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.airDiscount' })}
            icon={airplaneIcon}
            onPress={() => router.push('/air-discount')}
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
