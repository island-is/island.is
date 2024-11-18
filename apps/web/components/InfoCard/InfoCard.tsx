import * as React from 'react'

import { DetailedInfoCard, DetailedProps } from './DetailedInfoCard'

export interface BaseProps {
  title: string
  text: string
  eyebrow: string
  type: 'wide' | 'default'
  link: {
    label: string
    href: string
  }
}

type Props =
  | (BaseProps & {
      variant: 'simple'
    })
  | (DetailedProps & {
      variant: 'detailed'
    })

export const InfoCard = (props: Props) => {
  if (props.variant === 'detailed') {
    return <DetailedInfoCard {...props} />
  }
}
