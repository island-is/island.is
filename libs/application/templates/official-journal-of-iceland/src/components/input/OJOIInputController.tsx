import { SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { MessageDescriptor } from 'react-intl'
import { OJOI_INPUT_HEIGHT } from '../../lib/constants'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'

type Props = {
  name: string
  label: string | MessageDescriptor
  placeholder?: string | MessageDescriptor
  defaultValue?: string
  loading?: boolean
  applicationId: string
  disabled?: boolean
  textarea?: boolean
  onChange?: (value: string) => void
}

export const OJOIInputController = ({
  name,
  label,
  placeholder,
  defaultValue,
  loading,
  applicationId,
  disabled,
  textarea,
  onChange,
}: Props) => {
  const { formatMessage: f } = useLocale()
  const { debouncedOnUpdateApplicationHandler, application } = useApplication({
    applicationId,
  })

  const placeholderText = placeholder
    ? typeof placeholder === 'string'
      ? placeholder
      : f(placeholder)
    : ''

  const labelText = typeof label === 'string' ? label : f(label)

  const handleChange = (value: string) => {
    const currentAnswers = structuredClone(application.answers)
    const newAnswers = set(currentAnswers, name, value)

    return newAnswers
  }

  if (loading) {
    return (
      <SkeletonLoader
        borderRadius="standard"
        display="block"
        height={OJOI_INPUT_HEIGHT}
      />
    )
  }

  return (
    <InputController
      id={name}
      name={name}
      label={labelText}
      placeholder={placeholderText}
      size="sm"
      backgroundColor="blue"
      defaultValue={defaultValue}
      disabled={disabled}
      textarea={textarea}
      rows={4}
      onChange={(e) =>
        debouncedOnUpdateApplicationHandler(
          handleChange(e.target.value),
          onChange && (() => onChange(e.target.value)),
        )
      }
    />
  )
}