import * as React from 'react'
import { CreditCard } from './CreditCard/CreditCard'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'

interface CreditCardSelectorProps {
  onAddCard?: () => void
}

export const CreditCardSelector: React.FC<CreditCardSelectorProps> = ({
  onAddCard = () => {},
}) => (
  <Box position="relative">
    <CreditCard cardType="Mastercard" lastFourDigits="1234" active />
    <CreditCard cardType="Visa" lastFourDigits="1337" />
    <Box marginTop={1} marginBottom={4}>
      <Button fluid variant="ghost" onClick={onAddCard}>
        Nota annað kort
      </Button>
    </Box>
  </Box>
)
