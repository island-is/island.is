import * as React from 'react'

import { DetailedInfoCard, DetailedProps } from './DetailedInfoCard'
import { SimpleInfoCard } from './SimpleInfoCard'

export interface BaseProps {
  title: string
  description: string
  eyebrow: string
  size: 'large' | 'medium' | 'small'
  link: {
    label: string
    href: string
  }
}

export type InfoCardProps =
  | (BaseProps & {
      variant?: 'simple'
    })
  | (DetailedProps & {
      variant: 'detailed'
    })

export const InfoCard = (props: InfoCardProps) => {
  if (props.variant === 'detailed') {
    return <DetailedInfoCard {...props} />
  } else {
    return <SimpleInfoCard {...props} />
  }
}
