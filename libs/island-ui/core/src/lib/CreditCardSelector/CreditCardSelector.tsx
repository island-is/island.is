import * as React from 'react'
import cn from 'classnames'
import { CreditCard } from './CreditCard/CreditCard'
import * as styles from './CreditCardSelector.treat'

interface CreditCardSelectorProps {
}

export const CreditCardSelector: React.FC<CreditCardSelectorProps> = ({
}) => (
  <div className={cn(styles.root)}>
    <CreditCard name="Mastercard" lastFourDigits="1234" active />
    <CreditCard name="Visa" lastFourDigits="1337" />
  </div>
)
