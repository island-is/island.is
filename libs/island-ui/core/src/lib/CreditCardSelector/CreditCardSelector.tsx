// Mockup of a CreditCard selection flow.
// Not production code.

import * as React from 'react'
import { CreditCard } from './CreditCard/CreditCard'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'

type Card = {
  cardType: 'Mastercard' | 'Visa'
  lastFourDigits: string
  active: boolean
}
interface CreditCardSelectorProps {
  onAddCard?: () => void
  availableCards: Card[]
}

export const CreditCardSelector: React.FC<CreditCardSelectorProps> = ({
  onAddCard = () => null,
  availableCards,
}) => (
  <Box position="relative">
    {availableCards.map((card) => (
      <CreditCard
        cardType={card.cardType}
        lastFourDigits={card.lastFourDigits}
        active={card.active}
      />
    ))}
    <Box marginTop={1} marginBottom={4}>
      <Button fluid variant="ghost" onClick={onAddCard}>
        Nota annað kort
      </Button>
    </Box>
  </Box>
)
