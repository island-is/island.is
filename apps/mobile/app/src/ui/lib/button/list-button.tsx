import React from 'react'
import { Image, StyleSheet, TouchableHighlightProps, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import chevronForward from '../../assets/icons/chevron-forward.png'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'
import { Skeleton } from '../skeleton/skeleton'

interface ListButtonProps extends TouchableHighlightProps {
  title: string
  icon?: React.ReactNode
  isLoading?: boolean
}

type HostProps = Omit<ListButtonProps, 'title'>

const Host = styled.TouchableHighlight<HostProps>`
  padding-top: ${({ theme }) => theme.spacing[3]}px;
  padding-bottom: ${({ theme }) => theme.spacing[3]}px;
  padding-left: ${({ theme }) => theme.spacing[2]}px;
  padding-right: ${({ theme }) => theme.spacing[2]}px;
`

const Content = styled.SafeAreaView`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const IconCircle = styled.View`
  align-items: center;
  justify-content: center;
  height: 42px;
  width: 42px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
  margin-top: -${({ theme }) => theme.spacing[1]}px;
  margin-bottom: -${({ theme }) => theme.spacing[1]}px;

  background-color: ${dynamicColor(
    ({ theme }) => ({
      dark: theme.shades.dark.shade300,
      light: theme.color.blue100,
    }),
    true,
  )};
  border-radius: 30px;
`

const Text = styled.Text<{ isTransparent?: boolean; isOutlined?: boolean }>`
  ${font({
    fontWeight: '300',
  })}
`
const Arrow = styled.View`
  margin-left: auto;
`

const Divider = styled.View`
  background-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade100,
    light: theme.color.blue200,
  }))};
`

export function ListButton({
  title,
  icon,
  isLoading,
  ...rest
}: ListButtonProps) {
  const theme = useTheme()
  return (
    <View>
      <Host
        underlayColor={
          theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
        }
        {...rest}
      >
        <Content>
          {isLoading ? (
            <View style={{ width: 230 }}>
              <Skeleton active={true} error={false} />
            </View>
          ) : (
            <>
              {icon && <IconCircle>{icon}</IconCircle>}
              <Text>{title}</Text>
            </>
          )}
          {!isLoading && (
            <Arrow>
              <Image
                source={chevronForward}
                style={{ width: 24, height: 24 }}
              />
            </Arrow>
          )}
        </Content>
      </Host>
      <Divider style={{ height: StyleSheet.hairlineWidth }} />
    </View>
  )
}
