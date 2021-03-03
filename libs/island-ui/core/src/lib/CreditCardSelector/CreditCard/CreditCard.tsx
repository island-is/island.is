import * as React from 'react'
import cn from 'classnames'
import * as styles from './CreditCard.treat'
import { Box } from '../../Box/Box'
import * as icons from '../icons'
import { Text } from '../../Text/Text'

type ValidCard = 'Mastercard' | 'Visa'

interface CreditCardProps {
  name: ValidCard
  lastFourDigits: string
  active?: boolean
  disabled?: boolean
}

type RadioProps = {
  name?: string
  id?: string
  value?: string | number
  checked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Radio: React.FC<RadioProps> = ({
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

const getIcon = (name: ValidCard) => icons[name]

const MaskedNumbers = ({ total = 4 }) => {
  return (
    <Box component="span" paddingRight={1}>
      {Array.from({ length: total }, () => '*')}
    </Box>
  )
}

export const CreditCard: React.FC<CreditCardProps> = ({
  name = 'Mastercard',
  lastFourDigits,
  active,
  disabled = false,
}) => {
  const onChange = () => {}
  const Icon = getIcon(name)

  return (
    <div className={cn(styles.root)}>
      <Radio
        onChange={onChange}
        disabled={disabled}
        checked={active}
        value={name}
        id={name}
      />
      <Box
        background="white"
        borderColor={active ? 'blue400' : 'blue200'}
        borderWidth="standard"
        borderRadius="large"
        marginY={2}
        padding={2}
        display="flex"
        alignItems="center"
        flexGrow={1}
      >
        <Box marginRight={5}>
          <Icon />
        </Box>
        <Box display="flex" flexDirection="column">
          <Text fontWeight={active ? 'semiBold' : 'regular'}>{name}</Text>
          <Text fontWeight={active ? 'semiBold' : 'regular'}>
            <MaskedNumbers /> <MaskedNumbers /> {lastFourDigits}
          </Text>
        </Box>
      </Box>
    </div>
  )
}
