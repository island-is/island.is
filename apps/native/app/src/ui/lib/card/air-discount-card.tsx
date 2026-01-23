import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Clipboard from '@react-native-clipboard/clipboard'
import styled, { useTheme } from 'styled-components/native'

import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'
import { Typography } from '../typography/typography'
import { ViewStyle } from 'react-native'
import { testIDs } from '../../../utils/test-ids'

const Host = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
`
const Content = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]}px;
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const Message = styled.View`
  align-items: flex-start;
  flex: 1;
`

const Right = styled.View`
  align-items: flex-end;
`

const CopyCodeContainer = styled.View`
  border-top-width: ${({ theme }) => theme.border.width.standard}px;
  border-top-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
`

const CopyCodeButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]}px;
`

const ValidUntil = styled.Text`
  border-radius: ${({ theme }) => theme.border.radius.large};
  background-color: ${dynamicColor(
    ({ theme }) => ({
      dark: theme.shades.dark.shade300,
      light: theme.color.blue100,
    }),
    true,
  )};
  padding: ${({ theme }) => theme.spacing[1]}px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;

  ${font({
    fontWeight: '600',
    color: ({ theme }) => ({
      light: theme.color.blue400,
      dark: theme.color.blue300,
    }),
    fontSize: 12,
    lineHeight: 16,
  })};
`

interface AirDiscountProps {
  name: string
  credit?: number | null
  code?: string | null
  text?: string | null
  validUntil?: string | Date | null
  style?: ViewStyle
}

export function AirDiscountCard({
  name,
  code,
  text,
  validUntil,
  credit,
  style,
}: AirDiscountProps) {
  const intl = useIntl()
  const theme = useTheme()
  const discountCode = credit === 0 ? undefined : code ?? '0'
  return (
    <Host style={style} testID={testIDs.AIR_DISCOUNT_ITEM}>
      <Content>
        <Message>
          <Typography
            variant="heading4"
            style={{ marginBottom: theme.spacing[1] }}
          >
            {name}
          </Typography>
          <Typography
            style={{
              paddingRight: theme.spacing[2],
              marginBottom: theme.spacing[2],
            }}
          >
            {text}
          </Typography>
        </Message>
        <Right>
          {validUntil && (
            <ValidUntil>
              <FormattedMessage
                id="airDiscount.validTo"
                values={{
                  date: intl.formatDate(validUntil),
                  time: intl.formatTime(validUntil),
                }}
              />
            </ValidUntil>
          )}
          <Typography
            style={{
              paddingRight: theme.spacing[2],
              marginBottom: theme.spacing[2],
            }}
          >
            {discountCode}
          </Typography>
        </Right>
      </Content>
      {credit !== 0 && (
        <CopyCodeContainer>
          <CopyCodeButton onPress={() => Clipboard.setString(code ?? '')}>
            <Typography variant="heading5" color={theme.color.blue400}>
              <FormattedMessage
                id="airDiscount.copyDiscountCode"
                defaultMessage="Afrita kóða"
              />
            </Typography>
          </CopyCodeButton>
        </CopyCodeContainer>
      )}
    </Host>
  )
}
