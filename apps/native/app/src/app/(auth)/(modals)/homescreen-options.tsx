import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Platform, SafeAreaView, ScrollView, Switch, View } from 'react-native'
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

  const items = [
    {
      enabled: graphicWidgetEnabled,
      label: intl.formatMessage({
        id: 'homeOptions.graphic',
      }),
      onValueChange: (value: boolean) => {
        preferencesStore.setState({
          graphicWidgetEnabled: value,
        })
      },
    },
    {
      enabled: inboxWidgetEnabled,
      label: intl.formatMessage({
        id: 'homeOptions.inbox',
      }),
      onValueChange: (value: boolean) => {
        preferencesStore.setState({
          inboxWidgetEnabled: value,
        })
      },
    },
    {
      enabled: licensesWidgetEnabled,
      label: intl.formatMessage({
        id: 'homeOptions.licenses',
      }),
      onValueChange: (value: boolean) => {
        preferencesStore.setState({
          licensesWidgetEnabled: value,
        })
      },
    },
    {
      enabled: applicationsWidgetEnabled,
      label: intl.formatMessage({
        id: 'homeOptions.applications',
      }),
      onValueChange: (value: boolean) => {
        preferencesStore.setState({
          applicationsWidgetEnabled: value,
        })
      },
    },
    {
      enabled: vehiclesWidgetEnabled,
      label: intl.formatMessage({
        id: 'homeOptions.vehicles',
      }),
      onValueChange: (value: boolean) => {
        preferencesStore.setState({
          vehiclesWidgetEnabled: value,
        })
      },
    },
    {
      enabled: airDiscountWidgetEnabled,
      label: intl.formatMessage({
        id: 'homeOptions.airDiscount',
      }),
      onValueChange: (value: boolean) => {
        preferencesStore.setState({
          airDiscountWidgetEnabled: value,
        })
      },
    },
  ]

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.color.white }}
      nestedScrollEnabled
      alwaysBounceVertical={false}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 48 : 0}}
    >
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
      {items.map((item) => (
        <TableViewCell
          key={item.label}
          title={item.label}
          accessory={
            <View>
              <Switch
                onValueChange={item.onValueChange}
                value={item.enabled}
                thumbColor={Platform.select({ android: theme.color.dark100 })}
                trackColor={{
                  false: theme.color.dark200,
                  true: theme.color.blue400,
                }}
              />
            </View>
          }
        />
      ))}
    </ScrollView>
  )
}
