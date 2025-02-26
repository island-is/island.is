import { DetailedInfoCard, DetailedProps } from './DetailedInfoCard'
import { SimpleInfoCard } from './SimpleInfoCard'
import { Box, BoxProps, FocusableBox, LinkV2 } from '../..'

export interface BaseProps {
  id: string
  title: string
  description: string
  eyebrow: string
  background?: BoxProps['background']
  size: 'large' | 'medium' | 'small'
  borderColor?: BoxProps['borderColor']
  link: {
    label: string
    href: string
  }
  linkType?: 'card' | 'title'
}

export type InfoCardProps =
  | (BaseProps & {
      variant?: 'simple'
    })
  | (DetailedProps & {
      variant: 'detailed'
    })

export const InfoCard = ({
  size,
  linkType = 'card',
  ...restOfProps
}: InfoCardProps) => {
  const Wrapper = linkType === 'card' ? FocusableBox : Box

  return (
    <Wrapper
      aria-label={restOfProps.title}
      component={linkType === 'card' ? LinkV2 : undefined}
      href={linkType === 'card' ? restOfProps.link.href : undefined}
      background={restOfProps.background ?? 'white'}
      borderColor={restOfProps.borderColor ?? 'white'}
      color="blue"
      borderWidth="standard"
      width="full"
      borderRadius="large"
    >
      <Box width="full" padding={2}>
        {restOfProps.variant === 'detailed' ? (
          <DetailedInfoCard size={size} linkType={linkType} {...restOfProps} />
        ) : (
          <SimpleInfoCard size={size} linkType={linkType} {...restOfProps} />
        )}
      </Box>
    </Wrapper>
  )
}
