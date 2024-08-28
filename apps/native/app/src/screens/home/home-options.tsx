import { Heading, TableViewCell, Typography } from '@ui'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Platform, SafeAreaView, ScrollView, Switch } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useTheme } from 'styled-components'

import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'homeOptions.screenTitle' }),
      },
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
    },
  }))

export const HomeOptionsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)

  const intl = useIntl()
  const theme = useTheme()
  const {
    homeScreenEnableVehicleWidget,
    homeScreenEnableAirDiscountWidget,
    homeScreenEnableApplicationsWidget,
    homeScreenEnableGraphicWidget,
    homeScreenEnableInboxWidget,
    homeScreenEnableLicenseWidget,
  } = usePreferencesStore()

  return (
    <ScrollView>
      <SafeAreaView
        style={{
          marginHorizontal: theme.spacing[2],
          marginBottom: theme.spacing[3],
        }}
      >
        <Heading>
          <FormattedMessage
            id="homeOptions.heading.title"
            defaultMessage="Stilla heimaskjá."
          />
        </Heading>
        <Typography>
          <FormattedMessage
            id="homeOptions.heading.subtitle"
            defaultMessage="Hér er hægt að stilla hvað birtist á heimaskjá.s"
          />
        </Typography>
      </SafeAreaView>
      <TableViewCell
        title={intl.formatMessage({
          id: 'homeOptions.graphic',
        })}
        accessory={
          <Switch
            onValueChange={(value) => {
              preferencesStore.setState({
                homeScreenEnableGraphicWidget: value,
              })
            }}
            value={homeScreenEnableGraphicWidget}
            thumbColor={Platform.select({ android: theme.color.dark100 })}
            trackColor={{
              false: theme.color.dark200,
              true: theme.color.blue400,
            }}
          />
        }
      />
      <TableViewCell
        title={intl.formatMessage({
          id: 'homeOptions.inbox',
        })}
        accessory={
          <Switch
            onValueChange={(value) => {
              preferencesStore.setState({
                homeScreenEnableInboxWidget: value,
              })
            }}
            value={homeScreenEnableInboxWidget}
            thumbColor={Platform.select({ android: theme.color.dark100 })}
            trackColor={{
              false: theme.color.dark200,
              true: theme.color.blue400,
            }}
          />
        }
      />
      <TableViewCell
        title={intl.formatMessage({
          id: 'homeOptions.licenses',
        })}
        accessory={
          <Switch
            onValueChange={(value) => {
              preferencesStore.setState({
                homeScreenEnableLicenseWidget: value,
              })
            }}
            value={homeScreenEnableLicenseWidget}
            thumbColor={Platform.select({ android: theme.color.dark100 })}
            trackColor={{
              false: theme.color.dark200,
              true: theme.color.blue400,
            }}
          />
        }
      />
      <TableViewCell
        title={intl.formatMessage({
          id: 'homeOptions.applications',
        })}
        accessory={
          <Switch
            onValueChange={(value) => {
              preferencesStore.setState({
                homeScreenEnableApplicationsWidget: value,
              })
            }}
            value={homeScreenEnableApplicationsWidget}
            thumbColor={Platform.select({ android: theme.color.dark100 })}
            trackColor={{
              false: theme.color.dark200,
              true: theme.color.blue400,
            }}
          />
        }
      />
      <TableViewCell
        title={intl.formatMessage({
          id: 'homeOptions.vehicles',
        })}
        accessory={
          <Switch
            onValueChange={(value) => {
              preferencesStore.setState({
                homeScreenEnableVehicleWidget: value,
              })
            }}
            value={homeScreenEnableVehicleWidget}
            thumbColor={Platform.select({ android: theme.color.dark100 })}
            trackColor={{
              false: theme.color.dark200,
              true: theme.color.blue400,
            }}
          />
        }
      />
      <TableViewCell
        title={intl.formatMessage({
          id: 'homeOptions.airDiscount',
        })}
        accessory={
          <Switch
            onValueChange={(value) => {
              preferencesStore.setState({
                homeScreenEnableAirDiscountWidget: value,
              })
            }}
            value={homeScreenEnableAirDiscountWidget}
            thumbColor={Platform.select({ android: theme.color.dark100 })}
            trackColor={{
              false: theme.color.dark200,
              true: theme.color.blue400,
            }}
          />
        }
      />
    </ScrollView>
  )
}

HomeOptionsScreen.options = getNavigationOptions
