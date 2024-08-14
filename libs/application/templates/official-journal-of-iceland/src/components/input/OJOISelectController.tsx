import { SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import { MessageDescriptor } from 'react-intl'
import { OJOJ_INPUT_HEIGHT } from '../../lib/constants'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'

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
}

export const OJOISelectController = ({
  name,
  label,
  placeholder,
  options,
  defaultValue,
  loading,
  applicationId,
}: Props) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application } = useApplication({ applicationId })

  const placeholderText =
    typeof placeholder === 'string' ? placeholder : f(placeholder)

  const labelText = typeof label === 'string' ? label : f(label)

  const handleChange = (value: string) => {
    const { answers } = application

    const newAnswers = set({ ...answers }, name, value)

    updateApplication(newAnswers)
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
    <SelectController
      id={name}
      name={name}
      label={labelText}
      placeholder={placeholderText}
      size="sm"
      backgroundColor="blue"
      options={options}
      defaultValue={defaultValue}
      onSelect={(opt) => handleChange(opt.value)}
    />
  )
}
