import React from 'react'
import { SafeAreaView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'
import { Typography } from '../typography/typography'

interface TableViewCellProps {
  /**
   * Title of the cell
   */
  title: React.ReactNode
  /**
   * Text to display below title
   */
  subtitle?: React.ReactNode
  /**
   * Replace title/subtitle content with a react component
   */
  children?: React.ReactNode
  /**
   * Component to render on the right side
   */
  accessory?: React.ReactNode
  /**
   * Component or image to render on the left side
   */
  image?: React.ReactNode
  /**
   * Should show border. (default true)
   */
  border?: boolean
  /**
   * Component to render below title and subtitle
   */
  bottom?: React.ReactNode

  style?: ViewStyle
  disabled?: boolean
}

const Cell = styled.View<{ border: boolean; disabled: boolean }>`
  flex-direction: row;
  min-height: 56px;
  border-bottom-width: ${(props) => (props.border ? 1 : 0)}px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => ({
      dark: theme.shades.dark.shade200,
      light: theme.color.blue200,
    }),
    true,
  )};

  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`

const Left = styled.View`
  justify-content: center;
  padding-left: ${({ theme }) => theme.spacing[2]}px;
  padding-top: ${({ theme }) => theme.spacing[1]}px;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const Center = styled.View<{ accessory: boolean }>`
  flex: 1;
  justify-content: center;
  flex-direction: column;
  padding-right: ${(props) => (props.accessory ? props.theme.spacing[2] : 0)}px;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const Right = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
`

const Content = styled.View`
  flex-direction: column;
`

const Title = styled.View`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
`

const Subtitle = styled.View`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-top: 2px;
`

const SubtitleText = styled.Text`
  ${font({
    fontSize: 15,
    color: (props) => ({ light: props.theme.color.dark400, dark: '#e0e0e0' }),
    fontWeight: '300',
  })}
`

export const TableViewAccessory = styled.Text`
  ${font({
    fontSize: 14,
    color: ({ theme }) => ({
      light: theme.color.dark400,
      dark: theme.color.white,
    }),
  })}
`

export const TableViewCell = React.memo((props: TableViewCellProps) => {
  const {
    title,
    subtitle,
    image,
    accessory,
    children,
    border = true,
    disabled = false,
    bottom,
    style = {},
  } = props
  return (
    <SafeAreaView style={{ ...style }}>
      <Cell
        border={border}
        disabled={disabled}
        pointerEvents={disabled ? 'none' : undefined}
      >
        {image && <Left>{image}</Left>}
        <Center accessory={!!accessory}>
          {children !== undefined ? (
            children
          ) : (
            <Content>
              {title && (
                <Title>
                  {typeof title === 'string' ? (
                    <Typography weight={400}>{title}</Typography>
                  ) : (
                    title
                  )}
                </Title>
              )}
              {subtitle && (
                <Subtitle>
                  {typeof subtitle === 'string' ? (
                    <SubtitleText>{subtitle}</SubtitleText>
                  ) : (
                    subtitle
                  )}
                </Subtitle>
              )}
            </Content>
          )}
          {bottom}
        </Center>
        {accessory && <Right>{accessory}</Right>}
      </Cell>
    </SafeAreaView>
  )
})
