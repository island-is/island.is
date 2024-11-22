import { SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import { MessageDescriptor } from 'react-intl'
import { OJOI_INPUT_HEIGHT } from '../../lib/constants'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'
import { InputFields } from '../../lib/types'

type OJOISelectControllerOption = {
  label: string
  value: string
}

type Props = {
  name: string
  label: string | MessageDescriptor
  placeholder: string | MessageDescriptor
  options?: OJOISelectControllerOption[]
  defaultValue?: string
  loading?: boolean
  applicationId: string
  disabled?: boolean
  onChange?: (label: string, value: string) => void
}

export const OJOISelectController = ({
  name,
  label,
  placeholder,
  options,
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

  const handleChange = (label: string, value: string) => {
    const currentAnswers = structuredClone(application.answers)
    const newAnswers = set(currentAnswers, name, value)

    // we must reset the selected typeId if the department changes
    if (name === InputFields.advert.departmentId) {
      set(newAnswers, InputFields.advert.typeId, '')
    }

    updateApplication(newAnswers)

    onChange && onChange(label, value)
  }

  if (loading) {
    return (
      <SkeletonLoader
        borderRadius="xs"
        display="block"
        height={OJOI_INPUT_HEIGHT}
      />
    )
  }

  return (
    <SelectController
      id={name}
      name={name}
      label={labelText}
      placeholder={placeholderText}
      size="sm"
      backgroundColor="blue"
      options={options}
      defaultValue={defaultValue}
      disabled={disabled}
      onSelect={(opt) => handleChange(opt.label, opt.value)}
    />
  )
}
