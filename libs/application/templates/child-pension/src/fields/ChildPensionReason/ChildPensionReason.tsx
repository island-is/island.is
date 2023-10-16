import { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { formatText } from '@island.is/application/core'
import {
  Checkbox,
  GridRow,
  GridColumn,
  Text,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { childPensionFormMessage } from '../../lib/messages'
import {
  FieldBaseProps,
  Option,
  Application,
} from '@island.is/application/types'
import { getChildPensionReasonOptions } from '../../lib/childPensionUtils'
import { ChildPensionReason as ChildPensionReasonEnum } from '../../lib/constants'
import ParentIsDead from './ParentIsDead'
import { FieldDescription } from '@island.is/shared/form-fields'
import ParentsPenitentiary from './ParentsPenitentiary'

type ChildRepeaterProps = {
  field: {
    props: {
      showDescription: boolean
      childName?: (application: Application) => string
    }
  }
}

const ChildPensionReason: FC<
  React.PropsWithChildren<FieldBaseProps & ChildRepeaterProps>
> = ({ error, field, application, errors }) => {
  const { id } = field
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const showDescription = field.props.showDescription ?? false
  const options = getChildPensionReasonOptions()

  function handleSelect(option: Option, checkedValues: string[]) {
    let newChoices = []
    newChoices = checkedValues?.includes(option.value)
      ? checkedValues?.filter((val) => val !== option.value)
      : [...checkedValues, option.value]

    return newChoices
  }

  return (
    <>
      {showDescription && (
        <FieldDescription
          description={formatMessage(
            childPensionFormMessage.info.childPensionReasonDescription,
          )}
        />
      )}
      <Text variant="h4" marginTop={showDescription ? 3 : undefined}>
        {field.props.childName
          ? field.props.childName(application)
          : formatText(
              childPensionFormMessage.info.childPensionReasonTitle,
              application,
              formatMessage,
            )}
      </Text>
      <Controller
        name={id}
        defaultValue={[]}
        render={({ field: { value, onChange } }) => (
          <GridRow marginTop={2}>
            {options.map((option, index) => (
              <GridColumn
                span="1/1"
                paddingBottom={index !== options.length - 1 ? 2 : undefined}
                key={`option-${option.value}-${index}`}
              >
                <Checkbox
                  large={true}
                  onChange={() => {
                    const newChoices = handleSelect(option, value || [])
                    onChange(newChoices)
                    setValue(id, newChoices)
                  }}
                  checked={value && value.includes(option.value)}
                  name={id}
                  id={`${id}[${index}]`}
                  label={formatText(option.label, application, formatMessage)}
                  value={option.value}
                  hasError={error !== undefined}
                  backgroundColor="blue"
                />
                {value &&
                  value.includes(ChildPensionReasonEnum.PARENT_IS_DEAD) &&
                  option.value === ChildPensionReasonEnum.PARENT_IS_DEAD && (
                    <ParentIsDead
                      id={id}
                      application={application}
                      errors={errors}
                    />
                  )}
                {value &&
                  value.includes(ChildPensionReasonEnum.PARENTS_PENITENTIARY) &&
                  option.value ===
                    ChildPensionReasonEnum.PARENTS_PENITENTIARY && (
                    <ParentsPenitentiary id={id} application={application} />
                  )}
              </GridColumn>
            ))}

            {error && (
              <GridColumn span="1/1" paddingBottom={2}>
                <InputError errorMessage={error} />
              </GridColumn>
            )}
          </GridRow>
        )}
      />
    </>
  )
}

export default ChildPensionReason
