import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SafeAreaView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthStore } from '@/stores/auth-store'
import { Typography } from '@/ui'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

export const HelloModule = React.memo(() => {
  const theme = useTheme()
  const { userInfo } = useAuthStore()

  return (
    <SafeAreaView
      style={{
        marginHorizontal: theme.spacing[2],
        marginTop: theme.spacing[2],
      }}
    >
      <Host>
        <Typography color={theme.color.purple400} weight="600">
          <FormattedMessage id="home.goodDay" defaultMessage="Góðan dag," />
        </Typography>
        <Typography
          variant={'heading2'}
          style={{ marginTop: theme.spacing[1] }}
        >
          {userInfo?.name}
        </Typography>
      </Host>
    </SafeAreaView>
  )
})
