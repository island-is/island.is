import React from 'react'
import { useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import airplaneIcon from '../../assets/icons/airplane.png'
import assetsIcon from '../../assets/icons/assets.png'
import familyIcon from '../../assets/icons/family.png'
import financeIcon from '../../assets/icons/finance.png'
import healthIcon from '../../assets/icons/health.png'
import vehicleIcon from '../../assets/icons/vehicle.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { ExternalLinks } from '../../components/external-links/external-links'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { navigateTo } from '../../lib/deep-linking'
import { getMyPagesLinks } from '../../lib/my-pages-links'
import { MoreCard, Typography } from '../../ui'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'
import {
  ButtonRegistry,
  ComponentRegistry,
} from '../../utils/component-registry'

const Row = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing[1]}px;
  column-gap: ${({ theme }) => theme.spacing[2]}px;
  flex-direction: row;
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'profile.screenTitle' }),
        },
        rightButtons: getRightButtons({ icons: ['settings'], theme }),
        leftButtons: [
          {
            id: ButtonRegistry.ProfileAvatarButton,
            component: {
              id: ButtonRegistry.ProfileAvatarButton,
              name: ButtonRegistry.ProfileAvatarButton,
              passProps: {
                onPress: () =>
                  Navigation.showModal({
                    stack: {
                      children: [
                        {
                          component: {
                            name: ComponentRegistry.PersonalInfoScreen,
                          },
                        },
                      ],
                    },
                  }),
              },
            },
          },
        ],
      },
      bottomTab: {
        iconColor: theme.color.blue400,
        text: intl.formatMessage({ id: 'profile.bottomTabText' }),
      },
    }),
    {
      topBar: {
        scrollEdgeAppearance: {
          active: true,
          noBorder: true,
        },
      },
      bottomTab: {
        testID: testIDs.TABBAR_TAB_PROFILE,
        iconInsets: {
          bottom: -4,
        },
        icon: require('../../assets/icons/tabbar-more.png'),
        selectedIcon: require('../../assets/icons/tabbar-more.png'),
      },
    },
  )

export const MoreScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)

  const intl = useIntl()
  const theme = useTheme()
  const myPagesLinks = getMyPagesLinks()

  useConnectivityIndicator({
    componentId,
    rightButtons: getRightButtons({ icons: ['settings'] }),
  })

  const externalLinks = [
    {
      link: myPagesLinks.accessControl,
      title: intl.formatMessage({ id: 'profile.accessControl' }),
      icon: require('../../assets/icons/lock.png'),
    },
    {
      link: myPagesLinks.supportPayments,
      title: intl.formatMessage({ id: 'profile.supportPayments' }),
      icon: require('../../assets/icons/cardSuccess.png'),
    },
    {
      link: myPagesLinks.education,
      title: intl.formatMessage({ id: 'profile.education' }),
      icon: require('../../assets/icons/education.png'),
    },
    {
      link: myPagesLinks.lawAndOrder,
      title: intl.formatMessage({ id: 'profile.lawAndOrder' }),
      icon: require('../../assets/icons/lawAndOrder.png'),
    },
    {
      link: myPagesLinks.occupationalLicenses,
      title: intl.formatMessage({ id: 'profile.occupationalLicenses' }),
      icon: require('../../assets/icons/scroll.png'),
    },
  ]

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.family' })}
            icon={familyIcon}
            onPress={() => navigateTo('/family')}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.vehicles' })}
            icon={vehicleIcon}
            onPress={() => navigateTo('/vehicles')}
          />
        </Row>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.assets' })}
            icon={assetsIcon}
            onPress={() => navigateTo('/assets')}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.finance' })}
            icon={financeIcon}
            onPress={() => navigateTo('/finance')}
          />
        </Row>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.health' })}
            icon={healthIcon}
            onPress={() => navigateTo('/health-overview')}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.airDiscount' })}
            icon={airplaneIcon}
            onPress={() => navigateTo('/air-discount')}
          />
        </Row>
        <View
          style={{
            marginTop: theme.spacing[3],
          }}
        >
          <Typography variant="heading5">
            {intl.formatMessage({ id: 'profile.moreInfo' })}
          </Typography>
          <View style={{ marginHorizontal: -16 }}>
            {externalLinks.map((link) => (
              <ExternalLinks
                links={link}
                key={link.title}
                componentId={componentId}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomTabsIndicator index={4} total={5} />
    </>
  )
}

MoreScreen.options = getNavigationOptions
