import { Icon } from '@island.is/island-ui/core'

import * as styles from './ButtonPayment.css'

interface ButtonPaymentProps {
  children: React.ReactNode
  onClick: () => void
  type: 'card' | 'invoice'
  isSelected: boolean
}

export const ButtonPayment = (props: ButtonPaymentProps) => {
  let iconType = 'wallet'

  switch (props.type) {
    case 'card':
      iconType = 'card'
      break
    case 'invoice':
      iconType = 'bank'
      break
  }

  return (
    <button
      className={styles.button({
        state: props.isSelected ? 'selected' : 'default',
      })}
      onClick={props.onClick}
      type="button"
    >
      <Icon icon={iconType} type="outline" color="blue600" />
      {props.children}
    </button>
  )
}
