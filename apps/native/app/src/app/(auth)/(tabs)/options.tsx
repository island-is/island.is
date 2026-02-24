import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Platform, SafeAreaView, ScrollView, Switch } from 'react-native'
import { useTheme } from 'styled-components'

import { Heading, TableViewCell, Typography } from '@/ui'
import {
  preferencesStore,
  usePreferencesStore,
} from '@/stores/preferences-store'

export default function HomeOptionsScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const vehiclesWidgetEnabled = usePreferencesStore(
    ({ vehiclesWidgetEnabled }) => vehiclesWidgetEnabled,
  )
  const inboxWidgetEnabled = usePreferencesStore(
    ({ inboxWidgetEnabled }) => inboxWidgetEnabled,
  )
  const licensesWidgetEnabled = usePreferencesStore(
    ({ licensesWidgetEnabled }) => licensesWidgetEnabled,
  )
  const applicationsWidgetEnabled = usePreferencesStore(
    ({ applicationsWidgetEnabled }) => applicationsWidgetEnabled,
  )
  const airDiscountWidgetEnabled = usePreferencesStore(
    ({ airDiscountWidgetEnabled }) => airDiscountWidgetEnabled,
  )
  const graphicWidgetEnabled = usePreferencesStore(
    ({ graphicWidgetEnabled }) => graphicWidgetEnabled,
  )
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
            defaultMessage="Hér er hægt að stilla hvað birtist á heimaskjá."
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
                graphicWidgetEnabled: value,
              })
            }}
            value={graphicWidgetEnabled}
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
                inboxWidgetEnabled: value,
              })
            }}
            value={inboxWidgetEnabled}
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
                licensesWidgetEnabled: value,
              })
            }}
            value={licensesWidgetEnabled}
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
                applicationsWidgetEnabled: value,
              })
            }}
            value={applicationsWidgetEnabled}
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
                vehiclesWidgetEnabled: value,
              })
            }}
            value={vehiclesWidgetEnabled}
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
                airDiscountWidgetEnabled: value,
              })
            }}
            value={airDiscountWidgetEnabled}
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
