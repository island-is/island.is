import { Icon } from '@island.is/island-ui/core'
import type { IconProps } from '@island.is/island-ui/core'

import * as styles from './ButtonPayment.css'

interface ButtonPaymentProps {
  children: React.ReactNode
  onClick: () => void
  type: 'card' | 'invoice'
  isSelected: boolean
}

const getIconType = (
  paymentType: ButtonPaymentProps['type'],
): IconProps['icon'] => {
  let iconType: IconProps['icon'] = 'wallet'

  switch (paymentType) {
    case 'card':
      iconType = 'card'
      break
    case 'invoice':
      iconType = 'bank'
      break
  }

  return iconType
}

export const ButtonPayment = (props: ButtonPaymentProps) => {
  return (
    <button
      className={styles.button({
        state: props.isSelected ? 'selected' : 'default',
      })}
      onClick={props.onClick}
      type="button"
    >
      <Icon icon={getIconType(props.type)} type="outline" color="blue400" />
      {props.children}
    </button>
  )
}
