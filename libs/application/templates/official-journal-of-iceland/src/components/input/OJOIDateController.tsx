import { SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DatePickerController,
  InputController,
} from '@island.is/shared/form-fields'
import { MessageDescriptor } from 'react-intl'
import { DEBOUNCE_INPUT_TIMER, OJOJ_INPUT_HEIGHT } from '../../lib/constants'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'
import debounce from 'lodash/debounce'

type Props = {
  name: string
  label: string | MessageDescriptor
  placeholder: string | MessageDescriptor
  defaultValue?: string
  loading?: boolean
  applicationId: string
  disabled?: boolean
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
  onChange,
}: Props) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application } = useApplication({ applicationId })

  const placeholderText =
    typeof placeholder === 'string' ? placeholder : f(placeholder)

  const labelText = typeof label === 'string' ? label : f(label)

  const handleChange = (value: string) => {
    const currentAnswers = structuredClone(application.answers)
    const newAnswers = set(currentAnswers, name, value)

    updateApplication(newAnswers)

    onChange && onChange(value)
  }

  const debounceHandleChange = debounce(handleChange, DEBOUNCE_INPUT_TIMER)

  const onChangeHandler = (value: string) => {
    debounceHandleChange.cancel()

    debounceHandleChange(value)
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
      onChange={onChangeHandler}
    />
  )
}
