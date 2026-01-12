import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { MultiSelectDropdown } from './MultiSelectDropdown'
import { Option } from './types'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'

export type OptionAndKey = {
  option: Option
  key: string
}

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
  majorGroupLength: number
}

export const MultiSelectDropdownController: FC<
  React.PropsWithChildren<MultiSelectControllerProps & FieldBaseProps>
> = (props) => {
  const { setValue } = useFormContext()
  const {
    groups,
    items,
    answerId,
    pickedValue,
    onAnswerChange,
    application,
    majorGroupLength,
  } = props
  const [answers, setAnswers] = useState<OptionWithKey>(
    getValueViaPath<OptionWithKey>(application.answers, answerId) ?? {},
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
      [pickedValue.key]: currentValue[pickedValue.key]?.some(
        (option) => option.value === pickedValue.option.value,
      )
        ? currentValue[pickedValue.key]
        : [...(currentValue[pickedValue.key] || []), pickedValue.option],
    }))

    setValue(answerId, {
      ...answers,
      [pickedValue.key]: answers[pickedValue.key]?.some(
        (option) => option.value === pickedValue.option.value,
      )
        ? answers[pickedValue.key]
        : [...(answers[pickedValue.key] || []), pickedValue.option],
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
            (item) =>
              item.code.substring(0, majorGroupLength) ===
              group.code.substring(0, majorGroupLength),
          )}
          values={answers[group.code.substring(0, majorGroupLength)]}
          key={index}
          onChange={onChange}
          {...props}
        />
      ))}
    </>
  )
}
