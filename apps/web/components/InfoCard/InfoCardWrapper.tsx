import { Inline, Stack } from '@island.is/island-ui/core'

import { InfoCard, InfoCardProps } from './InfoCard'

export type CardProps = Omit<InfoCardProps, 'type' | 'variant'>

interface Props {
  cards: Array<CardProps>
  variant?: 'detailed' | 'simple'
  layout?: 'default' | 'wide'
}

export const InfoCardWrapper = ({ cards, variant, layout }: Props) => {
  if (layout === 'wide') {
    return (
      <Stack space={3}>
        {cards.map((c) => (
          <InfoCard variant={variant} type={layout} {...c} />
        ))}
      </Stack>
    )
  }

  return (
    <Inline space={3}>
      {cards.map((c) => (
        <InfoCard variant={variant} type={layout} {...c} />
      ))}
    </Inline>
  )
}
