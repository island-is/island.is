import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { useApplication } from '../../hooks/useUpdateApplication'
import { OJOIApplication } from '../../lib/types'
import { useFormContext } from 'react-hook-form'
import set from 'lodash/set'
import {
  Box,
  Select,
  SkeletonLoader,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { OJOI_INPUT_HEIGHT } from '../../lib/constants'
import { isBaseEntity } from '../../lib/utils'
import { getValueViaPath } from '@island.is/application/core'

type SelectOption<T> = {
  label: string
  value: T
}

type Props<T> = {
  controller?: boolean
  name: string
  label: string | MessageDescriptor
  placeholder: string | MessageDescriptor
  options?: SelectOption<T>[]
  defaultValue?: T
  loading?: boolean
  applicationId: string
  disabled?: boolean
  width?: 'full' | 'half'
  onBeforeChange?: (answers: OJOIApplication['answers'], value: T) => void
  onChange?: (value: T) => void
}

export const OJOISelectController = <T,>({
  controller = true,
  name,
  label,
  placeholder,
  options,
  defaultValue,
  loading,
  applicationId,
  disabled,
  width = 'full',
  onBeforeChange,
  onChange,
}: Props<T>) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application } = useApplication({
    applicationId,
  })

  const { setValue } = useFormContext()

  const { xs, sm, md } = useBreakpoint()
  const isSmOrSmaller = xs || (sm && !md)

  const placeholderText =
    typeof placeholder === 'string' ? placeholder : f(placeholder)

  const labelText = typeof label === 'string' ? label : f(label)

  const handleChange = (value: T) => {
    const currentAnswers = structuredClone(application.answers)
    const newAnswers = set(currentAnswers, name, value)
    onBeforeChange && onBeforeChange(newAnswers, value)

    setValue(name, value)
    updateApplication(newAnswers)

    onChange && onChange(value)
  }

  const defaultVal = getValueViaPath(application.answers, name, defaultValue)
  const defaultOpt = options?.find((opt) => {
    if (isBaseEntity(opt.value) && isBaseEntity(defaultVal)) {
      return opt.value.id === defaultVal.id
    }

    return undefined
  })

  return (
    <Box width={isSmOrSmaller ? 'full' : width}>
      {loading ? (
        <SkeletonLoader
          borderRadius="standard"
          display="block"
          height={OJOI_INPUT_HEIGHT}
        />
      ) : (
        <Select
          size="sm"
          name={name}
          label={labelText}
          isDisabled={disabled}
          placeholder={placeholderText}
          backgroundColor="blue"
          options={options}
          defaultValue={defaultOpt}
          onChange={(opt) => {
            if (!opt?.value) return
            if (controller) {
              handleChange(opt.value)
            }
            onChange && onChange(opt.value)
          }}
        />
      )}
    </Box>
  )
}
