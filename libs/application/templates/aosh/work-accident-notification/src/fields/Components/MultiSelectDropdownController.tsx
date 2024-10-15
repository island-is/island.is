import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { MultiSelectDropdown } from './MultiSelectDropdown'
import { Option } from '../Components/types'
import { useFormContext } from 'react-hook-form'
import { OptionAndKey } from '../Circumstance'
import { getValueViaPath } from '@island.is/application/core'

export type Group = {
  code: string
  name: string
  validToSelect: boolean
}

export type Item = {
  code: string
  name: string
  validToSelect: boolean
  isSelected: boolean
}

export type OptionWithKey = {
  [key: string]: Option[]
}

type MultiSelectControllerProps = {
  groups: Group[]
  items: Item[]
  answerId: string
  onAnswerChange: (answers: OptionWithKey) => void
  pickedValue?: OptionAndKey
}

export const MultiSelectDropdownController: FC<
  React.PropsWithChildren<MultiSelectControllerProps & FieldBaseProps>
> = (props) => {
  const { setValue } = useFormContext()
  const { groups, items, answerId, pickedValue, onAnswerChange, application } =
    props
  const [answers, setAnswers] = useState<OptionWithKey>(
    (getValueViaPath(application.answers, answerId) as OptionWithKey) || {},
  )

  const [stateItems, setStateItems] = useState<Array<Item>>(
    items.map((x) => ({ ...x, isSelected: false })),
  )

  const onChange = (
    values: Option[],
    code: string,
    checked: boolean,
    fullItemCode: string,
  ) => {
    if (values === undefined) return
    if (checked) {
      setAnswers((currentValue) => ({
        ...currentValue,
        [code]: values,
      }))

      const updatedStateItems = stateItems.map((item) =>
        item.code === fullItemCode ? { ...item, isSelected: true } : item,
      )
      setStateItems(updatedStateItems)
      setValue(answerId, {
        ...answers,
        [code]: values,
      })
    } else {
      const valueToRemove = values[0]
      setAnswers((currentValue) => ({
        ...currentValue,
        [code]: (currentValue[code] || []).filter(
          (value) => value.value !== valueToRemove.value,
        ),
      }))
      const updatedStateItems = stateItems.map((item) =>
        item.code === fullItemCode ? { ...item, isSelected: false } : item,
      )
      setStateItems(updatedStateItems)
      setValue(answerId, {
        ...answers,
        [code]: (answers[code] || []).filter(
          (value) => value !== valueToRemove,
        ),
      })
    }
  }

  useEffect(() => {
    if (!pickedValue || !pickedValue.key || !pickedValue.option) return
    setAnswers((currentValue) => ({
      ...currentValue,
      [pickedValue.key]: [
        ...(currentValue[pickedValue.key] || []),
        pickedValue.option,
      ],
    }))
    setValue(answerId, {
      ...answers,
      [pickedValue.key]: [
        ...(answers[pickedValue.key] || []),
        pickedValue.option,
      ],
    })
  }, [pickedValue])

  useEffect(() => {
    onAnswerChange(answers)
  }, [answers])

  return (
    <>
      {groups.map((group, index) => (
        <MultiSelectDropdown
          group={group}
          options={stateItems.filter(
            // TODO(balli) Need to change this logic, since not all data for VER is consistant in the code structure
            // Get as props the lenght of major group vs subgroup for example...
            (item) => item.code.substring(0, 1) === group.code.substring(0, 1),
          )}
          values={answers[group.code.substring(0, 1)]}
          key={index}
          onChange={onChange}
          {...props}
        />
      ))}
    </>
  )
}
