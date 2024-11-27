import { Inline, Stack } from '@island.is/island-ui/core'

import { InfoCard, InfoCardProps } from './InfoCard'

export type CardProps = Omit<InfoCardProps, 'type' | 'variant'>

interface Props {
  cards: Array<CardProps>
  variant?: 'detailed' | 'simple'
  type?: 'default' | 'wide'
}

export const InfoCardWrapper = ({ cards, variant, type }: Props) => {
  if (type === 'wide') {
    return (
      <Inline space={3}>
        {cards.map((c) => (
          <InfoCard variant={variant} type={type} {...c} />
        ))}
      </Inline>
    )
  }

  return (
    <Stack space={3}>
      {cards.map((c) => (
        <InfoCard variant={variant} type={type} {...c} />
      ))}
    </Stack>
  )
}
