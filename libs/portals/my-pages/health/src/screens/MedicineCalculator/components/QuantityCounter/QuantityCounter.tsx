import { Box, Text, Icon, Hidden } from '@island.is/island-ui/core'
import * as styles from './QuantityCounter.css'

type Props = {
  quantity: number
  incrementLabel: string
  decrementLabel: string
  handleIncrement: () => void
  handleDecrement: () => void
}

const MININUM_VALUE = 1

export const QuantityCounter: React.FC<Props> = ({
  quantity,
  incrementLabel,
  decrementLabel,
  handleDecrement,
  handleIncrement,
}) => {
  return (
    <Box className={styles.quantityCounterWrapper}>
      <Hidden print>
        <button
          disabled={quantity <= MININUM_VALUE}
          className={styles.quantityCounterButton}
          onClick={handleDecrement}
          aria-label={decrementLabel}
        >
          <Icon
            color={quantity <= MININUM_VALUE ? 'blue300' : 'blue400'}
            size="small"
            icon="remove"
            type="outline"
          ></Icon>
        </button>
      </Hidden>
      <span aria-live="polite">
        <Text variant="default">{quantity}</Text>
      </span>
      <Hidden print>
        <button
          className={styles.quantityCounterButton}
          onClick={handleIncrement}
          aria-label={incrementLabel}
        >
          <Icon color="blue400" size="small" icon="add" type="outline"></Icon>
        </button>
      </Hidden>
    </Box>
  )
}
