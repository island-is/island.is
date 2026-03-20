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
  padding?: BoxProps['padding']
  borderColor?: BoxProps['borderColor']
  link: {
    label: string
    href: string
    openInNewTab?: boolean
  }
}

export type InfoCardProps =
  | (BaseProps & {
      variant?: 'simple'
    })
  | (DetailedProps & {
      variant: 'detailed'
    })

export const InfoCard = ({ size, ...restOfProps }: InfoCardProps) => {
  return (
    <FocusableBox
      aria-label={restOfProps.title}
      component={LinkV2}
      href={restOfProps.link.href}
      target={restOfProps.link.openInNewTab ? '_blank' : undefined}
      rel={restOfProps.link.openInNewTab ? 'noopener noreferrer' : undefined}
      background={restOfProps.background ?? 'white'}
      borderColor={restOfProps.borderColor ?? 'white'}
      color="blue"
      borderWidth="standard"
      width="full"
      borderRadius="large"
    >
      <Box width="full" padding={restOfProps.padding ?? 3}>
        {restOfProps.variant === 'detailed' ? (
          <DetailedInfoCard size={size} {...restOfProps} />
        ) : (
          <SimpleInfoCard size={size} {...restOfProps} />
        )}
      </Box>
    </FocusableBox>
  )
}
