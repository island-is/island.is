import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Input } from '@island.is/island-ui/core'
import { ruling as m } from '@island.is/judicial-system-web/messages'
import { useDebouncedInput } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  rows?: number
  disabled?: boolean
  label?: string
  placeholder?: string
  required?: boolean
}

const RulingInput: FC<Props> = ({
  rows,
  disabled = false,
  label,
  placeholder,
  required = false,
}) => {
  const { formatMessage } = useIntl()
  const rulingInput = useDebouncedInput('ruling', [])

  return (
    <Input
      data-testid="ruling"
      name="ruling"
      label={label || formatMessage(m.label)}
      placeholder={placeholder || formatMessage(m.placeholder)}
      value={rulingInput.value ?? ''}
      required={required}
      onChange={(evt) => rulingInput.onChange(evt.target.value)}
      textarea
      rows={rows ?? 16}
      disabled={disabled}
    />
  )
}

export default RulingInput
