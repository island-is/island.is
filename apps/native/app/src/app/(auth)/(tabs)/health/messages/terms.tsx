import React from 'react'
import { useIntl } from 'react-intl'
import { Platform, ScrollView, View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { Typography } from '@/ui'

export default function HealthMessageTermsScreen() {
  const intl = useIntl()
  const theme = useTheme()

  const items = intl
    .formatMessage({ id: 'health.messages.compose.termsBody' })
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean)

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.color.white }}
      alwaysBounceVertical={false}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing[2],
        paddingTop: Platform.OS === 'android' ? theme.spacing[3] : 0,
        paddingBottom: theme.spacing[4],
        rowGap: theme.spacing[3],
      }}
    >
      <Typography variant="heading3">
        {intl.formatMessage({ id: 'health.messages.compose.termsTitle' })}
      </Typography>
      <View style={{ rowGap: theme.spacing[2] }}>
        {items.map((item, index) => (
          <View
            key={index}
            style={{ flexDirection: 'row', columnGap: theme.spacing[1] }}
          >
            <Typography variant="body">{'•'}</Typography>
            <Typography variant="body" style={{ flex: 1 }}>
              {item}
            </Typography>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
