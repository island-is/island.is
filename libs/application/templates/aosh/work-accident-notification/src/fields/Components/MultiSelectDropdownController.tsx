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

  const onChange = (values: Option[], code: string, checked: boolean) => {
    if (values === undefined) return
    if (checked) {
      setAnswers((currentValue) => ({
        ...currentValue,
        [code]: values,
      }))
      setValue(answerId, {
        ...answers,
        [code]: values,
      })
    } else {
      const valueToRemove = values[0]
      setAnswers((currentValue) => ({
        ...currentValue,
        [code]: (currentValue[code] || []).filter(
          (value) => value !== valueToRemove,
        ),
      }))
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
          options={items.filter(
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
