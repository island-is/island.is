import { Input } from '@island.is/island-ui/core'
import NumberFormat from 'react-number-format'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'

interface Props {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
  backgroundColor?: 'blue' | 'white'
}

export const PercentageInput = ({
  id,
  name,
  value,
  onChange,
  disabled,
  required,
  backgroundColor = 'blue',
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <NumberFormat
      customInput={Input}
      id={id}
      name={name}
      label={formatMessage(m.percentageFromNextMonth)}
      placeholder={formatMessage(m.percentagePlaceholder)}
      size="xs"
      backgroundColor={backgroundColor}
      suffix="%"
      allowNegative={false}
      isAllowed={({ floatValue }) =>
        floatValue === undefined || (floatValue >= 0 && floatValue <= 100)
      }
      value={value}
      onValueChange={({ value: v }) => onChange(v)}
      disabled={disabled}
      required={required}
    />
  )
}
