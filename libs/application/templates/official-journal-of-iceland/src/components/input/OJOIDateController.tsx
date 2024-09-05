import { SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DatePickerController } from '@island.is/shared/form-fields'
import { MessageDescriptor } from 'react-intl'
import { OJOI_INPUT_HEIGHT } from '../../lib/constants'
import { useApplication } from '../../hooks/useUpdateApplication'
import { useFormContext } from 'react-hook-form'
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
  const {
    debouncedOnUpdateApplicationHandler,
    application,
    updateApplication,
  } = useApplication({
    applicationId,
  })

  const { setValue } = useFormContext()

  if (loading) {
    return (
      <SkeletonLoader
        borderRadius="standard"
        display="block"
        height={OJOI_INPUT_HEIGHT}
      />
    )
  }

  // if defaultValue is passed and there is no value set we must set it in the application state
  if (defaultValue && !application.answers.advert?.requestedDate) {
    setValue(name, defaultValue)
    const currentAnswers = structuredClone(application.answers)
    const updatedAnswers = set(currentAnswers, name, defaultValue)
    updateApplication(updatedAnswers)
  }

  const placeholderText =
    typeof placeholder === 'string' ? placeholder : f(placeholder)

  const labelText = typeof label === 'string' ? label : f(label)

  const handleChange = (value: string) => {
    const currentAnswers = structuredClone(application.answers)
    const newAnswers = set(currentAnswers, name, value)

    return newAnswers
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
