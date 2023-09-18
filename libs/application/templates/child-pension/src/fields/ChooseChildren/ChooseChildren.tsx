import { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { formatText } from '@island.is/application/core'
import { Checkbox, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, Option } from '@island.is/application/types'
import {
  getApplicationExternalData,
  getApplicationAnswers,
} from '../../lib/childPensionUtils'
import { ChildPensionRow } from '../../types'

const ChooseChildren: FC<FieldBaseProps> = ({
  error,
  field,
  application,
  errors,
}) => {
  const { id } = field
  const { setValue, register, getValues } = useFormContext()
  const { formatMessage } = useLocale()

  const { selectChildInCustody } = getApplicationAnswers(application.answers)

  const { custodyInformation } = getApplicationExternalData(
    application.externalData,
  )
  function options() {
    const applying: Array<Option> = []

    custodyInformation.map((i) =>
      applying.push({
        label: i.fullName,
        value: i.nationalId,
      }),
    )

    return applying
  }

  function updateSelectedChildren(newChoices: string[]) {
    console.log(
      '========> (updateSelectedChildren) custodyInformation: ',
      custodyInformation,
    )
    console.log(
      '========> (updateSelectedChildren) selectChildInCustody: ',
      selectChildInCustody,
    )
    console.log('========> (updateSelectedChildren) newChoices: ', newChoices)

    const newSelectedChildren: ChildPensionRow[] = []
    newChoices.forEach((choice) => {
      const supAns = selectChildInCustody?.find(
        (info) => info.nationalIdOrBirthDate === choice,
      )
      console.log('========> (updateSelectedChildren) supAns: ', supAns)

      const newSelectedChild = custodyInformation.find((info) => info.nationalId === choice)
      console.log('========> (updateSelectedChildren) newSelectedChild: ', newSelectedChild)

      if (newSelectedChild) {
        const newChild = {
          nationalIdOrBirthDate: newSelectedChild.nationalId,
          name: newSelectedChild.fullName,
          childDoesNotHaveNationalId: false,
          reason: [],
        }
        newSelectedChildren.push(newChild)
        console.log('========> (updateSelectedChildren) newChild: ', newChild)
      }
    })
    console.log('========> (updateSelectedChildren) newSelectedChildren: ', newSelectedChildren)

    setValue('selectChildInCustody', newSelectedChildren)
  }

  function handleSelect(option: Option, checkedValues: string[]) {
    let newChoices = []
    newChoices = checkedValues?.includes(option.value)
      ? checkedValues?.filter((val) => val !== option.value)
      : [...checkedValues, option.value]

    updateSelectedChildren(newChoices)
    return newChoices
  }

  console.log('=======> getValues(): ', getValues())
  return (
    <>
      <Controller
        name={id}
        render={({ field: { value, onChange } }) => (
          <GridRow marginTop={2}>
            {options().map((option, index) => {
              console.log('======> option: ', option)
              return (
                <GridColumn
                  span="1/1"
                  paddingBottom={index !== options.length - 1 ? 2 : undefined}
                  key={`option-${option.value}`} // TODO: Laga key (kemur villa um að ehv með sama key??)
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
                </GridColumn>
              )
            })}
          </GridRow>
        )}
      />
      {/* <input
        readOnly
        type="hidden"
        value={selectChildInCustody}
        {...register(`selectChildInCustody`)}
      /> */}
      <input type="hidden" {...register(`selectChildInCustody`)} />
    </>
  )
}

export default ChooseChildren
