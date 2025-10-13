import { ReactNode } from 'react'
import { Image, Pressable, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Colors } from '../../utils'
import { Typography } from '../typography/typography'
import { useBrowser } from '../../../lib/use-browser'
import externalLinkIcon from '../../../assets/icons/external-link.png'

type Variant = 'info' | 'error' | 'warning'
export type DetailLink = {
  text: string
  url: string
}

export type ProblemTemplateBaseProps = {
  variant: Variant
  title: string
  message: string | ReactNode
  withContainer?: boolean
  size?: 'small' | 'large'
  detailLink?: DetailLink
}

interface WithIconProps extends ProblemTemplateBaseProps {
  showIcon?: boolean
  tag?: never
}

interface WithTagProps extends ProblemTemplateBaseProps {
  tag?: string
  showIcon?: never
}

export type ProblemTemplateProps = WithIconProps | WithTagProps

const getIcon = (variant: Variant) => {
  switch (variant) {
    case 'warning':
      return require('../../assets/icons/warning.png')

    case 'info':
      return require('../../assets/icons/info.png')
  }
}

const getColorsByVariant = (
  variant: Variant,
): {
  borderColor: Colors
  tagBackgroundColor: Colors
  tagColor: Colors
} => {
  switch (variant) {
    case 'error':
      return {
        borderColor: 'red200',
        tagBackgroundColor: 'red100',
        tagColor: 'red600',
      }

    case 'info':
      return {
        borderColor: 'blue200',
        tagBackgroundColor: 'blue100',
        tagColor: 'blue400',
      }

    case 'warning':
      return {
        borderColor: 'yellow400',
        tagBackgroundColor: 'yellow300',
        tagColor: 'dark400',
      }
  }
}

const Host = styled.View<{
  borderColor: Colors
  noContainer?: boolean
  size: 'small' | 'large'
}>`
  border-color: ${({ borderColor, theme }) => theme.color[borderColor]};
  border-width: 1px;
  border-radius: 24px;

  justify-content: center;
  align-items: center;
  flex: 1;
  row-gap: ${({ theme, size }) =>
    size === 'small' ? theme.spacing[2] : theme.spacing[3]}px;

  padding: ${({ theme }) => theme.spacing[2]}px;
  ${({ noContainer, theme }) => noContainer && `margin: ${theme.spacing[2]}px;`}
  min-height: ${({ size }) => (size === 'large' ? '280' : '142')}px;
`

const Tag = styled(View)<{
  backgroundColor: Colors
}>`
  background-color: ${({ backgroundColor, theme }) =>
    theme.color[backgroundColor]};
  padding: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  overflow: hidden;
`

const TagText = styled(Typography)<{ color?: Colors }>`
  ${({ color, theme }) => color && `color: ${theme.color[color]};`}
`

const Icon = styled(Image)(({ theme }) => ({
  width: theme.spacing[3],
  height: theme.spacing[3],
}))

const Content = styled(View)`
  align-items: center;
  row-gap: ${({ theme }) => theme.spacing[1]}px;
`

export const ProblemTemplate = ({
  variant,
  title,
  message,
  showIcon,
  tag,
  withContainer,
  detailLink,
  size = 'large',
}: ProblemTemplateProps) => {
  const theme = useTheme()
  const { openBrowser } = useBrowser()
  const { borderColor, tagColor, tagBackgroundColor } =
    getColorsByVariant(variant)

  return (
    <Host borderColor={borderColor} noContainer={withContainer} size={size}>
      {tag && (
        <Tag backgroundColor={tagBackgroundColor}>
          <TagText variant="eyebrow" color={tagColor}>
            {tag}
          </TagText>
        </Tag>
      )}
      {showIcon && <Icon source={getIcon(variant)} />}
      <Content>
        <Typography
          variant={size === 'small' ? 'heading5' : 'heading3'}
          textAlign="center"
        >
          {title}
        </Typography>
        <Typography
          variant={size === 'small' ? 'body3' : 'body'}
          textAlign="center"
        >
          {message}
        </Typography>
        {detailLink && (
          <Pressable
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing[1],
              borderBottomWidth: 1,
              marginTop: theme.spacing[1],
              borderBottomColor: theme.color.blue400,
            }}
            onPress={() => {
              openBrowser(detailLink.url)
            }}
          >
            <Typography variant="body" color={theme.color.blue400} weight="600">
              {detailLink.text}
            </Typography>
            <Icon
              style={{ width: theme.spacing[2], height: theme.spacing[2] }}
              source={externalLinkIcon}
            />
          </Pressable>
        )}
      </Content>
    </Host>
  )
}
