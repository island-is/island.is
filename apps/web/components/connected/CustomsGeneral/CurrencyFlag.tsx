import * as styles from './CurrencyFlag.css'
import { hasCurrencyFlag } from './currencyFlags'

interface CurrencyFlagProps {
  currencyCode: string
}

/**
 * Decorative flag for a currency. The currency code is always rendered next to
 * it, so the flag itself is hidden from screen readers.
 */
export const CurrencyFlag = ({ currencyCode }: CurrencyFlagProps) => {
  const code = currencyCode.toUpperCase()

  if (!hasCurrencyFlag(code)) {
    return null
  }

  return (
    <span
      aria-hidden="true"
      className={`${styles.flag} ${styles.flagPosition[code]}`}
    />
  )
}

export default CurrencyFlag
