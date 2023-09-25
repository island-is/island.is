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
import { FieldDescription } from '@island.is/shared/form-fields'
import { childPensionFormMessage } from '../../lib/messages'

const ChooseChildren: FC<FieldBaseProps> = ({ field, application }) => {
  const { id } = field
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const selectedCustodyKidsFieldId = `${id}.custodyKids`
  const selectedChildrenInCustodyFieldId = `${id}.selectedChildrenInCustody`

  const { selectedChildrenInCustody } = getApplicationAnswers(
    application.answers,
  )

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
    const newSelectedChildren: ChildPensionRow[] = []
    newChoices.forEach((choice) => {
      const childSelected = selectedChildrenInCustody?.find(
        (info) => info.nationalIdOrBirthDate === choice,
      )

      if (childSelected) {
        newSelectedChildren.push(childSelected)
      } else {
        const newSelectedChild = custodyInformation.find(
          (info) => info.nationalId === choice,
        )
        if (newSelectedChild) {
          const newChild: ChildPensionRow = {
            nationalIdOrBirthDate: newSelectedChild.nationalId,
            name: newSelectedChild.fullName,
            childDoesNotHaveNationalId: false,
          }
          newSelectedChildren.push(newChild)
        }
      }
    })
    setValue(selectedChildrenInCustodyFieldId, newSelectedChildren)
  }

  function handleSelect(option: Option, checkedValues: string[]) {
    let newChoices = []
    newChoices = checkedValues?.includes(option.value)
      ? checkedValues?.filter((val) => val !== option.value)
      : [...checkedValues, option.value]

    updateSelectedChildren(newChoices)
    return newChoices
  }

  return (
    <>
      <FieldDescription
        description={formatMessage(
          childPensionFormMessage.info.chooseChildrenDescription,
        )}
      />
      <Controller
        name={selectedCustodyKidsFieldId}
        render={({ field: { value, onChange } }) => (
          <GridRow marginTop={2}>
            {options().map((option, index) => (
              <GridColumn
                span="1/1"
                paddingBottom={index !== options.length - 1 ? 2 : undefined}
                key={`option-${option.value}`}
              >
                <Checkbox
                  large={true}
                  onChange={() => {
                    const newChoices = handleSelect(option, value || [])
                    onChange(newChoices)
                    setValue(selectedCustodyKidsFieldId, newChoices)
                  }}
                  checked={value && value.includes(option.value)}
                  name={selectedCustodyKidsFieldId}
                  id={`${selectedCustodyKidsFieldId}[${index}]`}
                  label={formatText(option.label, application, formatMessage)}
                  value={option.value}
                  backgroundColor="blue"
                />
              </GridColumn>
            ))}
          </GridRow>
        )}
      />
    </>
  )
}

export default ChooseChildren
