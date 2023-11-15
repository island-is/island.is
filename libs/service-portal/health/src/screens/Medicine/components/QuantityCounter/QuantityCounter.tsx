import { Box, Text, Icon } from '@island.is/island-ui/core'
import * as styles from './QuantityCounter.css'

type Props = {
  quantity: number
  handleIncrement: () => void
  handleDecrement: () => void
}

const MININUM_VALUE = 1

export const QuantityCounter: React.FC<Props> = ({
  quantity,
  handleDecrement,
  handleIncrement,
}) => {
  return (
    <Box className={styles.quantityCounterWrapper}>
      <button
        disabled={quantity <= MININUM_VALUE}
        className={styles.quantityCounterButton}
        onClick={handleDecrement}
      >
        <Icon
          color={quantity <= MININUM_VALUE ? 'blue300' : 'blue400'}
          size="small"
          icon="remove"
          type="outline"
        ></Icon>
      </button>
      <Text variant="default">{quantity}</Text>
      <button
        className={styles.quantityCounterButton}
        onClick={handleIncrement}
      >
        <Icon color="blue400" size="small" icon="add" type="outline"></Icon>
      </button>
    </Box>
  )
}
