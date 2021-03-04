import * as React from 'react'
import cn from 'classnames'
import * as styles from './CreditCard.treat'
import * as icons from '../icons'
import { Box } from '../../Box/Box'
import { Text } from '../../Text/Text'
import { RemoveButton } from '../RemoveButton/RemoveButton'

type ValidCard = 'Mastercard' | 'Visa'

interface CreditCardProps {
  cardType: ValidCard
  lastFourDigits: string
  active?: boolean
  disabled?: boolean
}

type RadioProps = {
  cardType?: string
  id?: string
  value?: string | number
  checked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const SelectionRadio: React.FC<RadioProps> = ({
  onChange,
  disabled,
  checked,
  value,
  id,
}) => (
  <>
    <input
      className={styles.input}
      type="radio"
      disabled={disabled}
      id={id}
      onChange={onChange}
      value={value}
      checked={checked}
    />
    <label
      className={cn(styles.label, {
        [styles.labelChecked]: checked,
        [styles.radioButtonLabelDisabled]: disabled,
      })}
      htmlFor={id}
    >
      <div
        className={cn(styles.radioButton, {
          [styles.radioButtonChecked]: checked,
          [styles.radioButtonDisabled]: disabled,
        })}
      >
        <div className={styles.checkMark} />
      </div>
    </label>
  </>
)

const getIcon = (cardType: ValidCard) => icons[cardType]

const MaskedNumbers = ({ total = 4 }) => {
  return (
    <Box component="span" className={styles.maskedNumbers}>
      {Array.from({ length: total }, () => '*')}
    </Box>
  )
}

export const CreditCard: React.FC<CreditCardProps> = ({
  cardType = 'Mastercard',
  lastFourDigits,
  active,
  disabled = false,
}) => {
  const onChange = () => null
  const onRemove = () => null
  const Icon = getIcon(cardType)

  return (
    <div className={styles.root}>
      <SelectionRadio
        onChange={onChange}
        disabled={disabled}
        checked={active}
        value={cardType}
        id={cardType}
      />
      <Box
        background="white"
        borderColor={active ? 'blue400' : 'blue200'}
        borderWidth="standard"
        borderRadius="large"
        marginY={1}
        paddingY={1}
        paddingX={2}
        display="flex"
        alignItems="center"
        flexGrow={1}
        marginX={2}
      >
        <Box marginRight={[2, 4, 5]}>
          <Icon />
        </Box>
        <Box display="flex" flexDirection="column">
          <Text fontWeight={active ? 'semiBold' : 'regular'}>{cardType}</Text>
          <Text fontWeight={active ? 'semiBold' : 'regular'}>
            <MaskedNumbers /> <MaskedNumbers /> {lastFourDigits}
          </Text>
        </Box>
      </Box>
      <RemoveButton onClick={onRemove} />
    </div>
  )
}
