import { SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DatePickerController } from '@island.is/shared/form-fields'
import { MessageDescriptor } from 'react-intl'
import { OJOJ_INPUT_HEIGHT } from '../../lib/constants'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'

type Props = {
  name: string
  label: string | MessageDescriptor
  placeholder: string | MessageDescriptor
  defaultValue?: string
  loading?: boolean
  applicationId: string
  disabled?: boolean
  excludeDates?: Date[]
  minDate?: Date
  maxDate?: Date
  onChange?: (value: string) => void
}

export const OJOIDateController = ({
  name,
  label,
  placeholder,
  defaultValue,
  loading,
  applicationId,
  disabled,
  excludeDates,
  minDate,
  maxDate,
  onChange,
}: Props) => {
  const { formatMessage: f } = useLocale()
  const { debouncedOnUpdateApplicationHandler, application } = useApplication({
    applicationId,
  })

  const placeholderText =
    typeof placeholder === 'string' ? placeholder : f(placeholder)

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
        height={OJOJ_INPUT_HEIGHT}
      />
    )
  }

  return (
    <DatePickerController
      id={name}
      name={name}
      label={labelText}
      placeholder={placeholderText}
      size="sm"
      locale="is"
      backgroundColor="blue"
      defaultValue={defaultValue}
      disabled={disabled}
      excludeDates={excludeDates}
      minDate={minDate}
      maxDate={maxDate}
      onChange={(e) =>
        debouncedOnUpdateApplicationHandler(
          handleChange(e),
          onChange && (() => onChange(e)),
        )
      }
    />
  )
}
