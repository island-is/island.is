import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { MultiSelectDropdown } from './MultiSelectDropdown'
import { Option } from '../Components/types'
import { useFormContext } from 'react-hook-form'

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
  onAnswerChange: (values: OptionWithKey | undefined) => void
  answerId: string
}

export const MultiSelectDropdownController: FC<
  React.PropsWithChildren<MultiSelectControllerProps & FieldBaseProps>
> = (props) => {
  const { setValue } = useFormContext()
  const [answers, setAnswers] = useState<OptionWithKey>()
  const { groups, items, answerId, onAnswerChange } = props

  const onChange = (values: Option[], code: string) => {
    console.log('Values: ', values)

    setAnswers((currentValue) => ({
      ...currentValue,
      [code]: values,
    }))
  }

  useEffect(() => {
    setValue(answerId, answers)
    onAnswerChange(answers)
  }, [answerId, answers, onAnswerChange, setValue])

  return (
    <>
      {groups.map((group, index) => (
        <MultiSelectDropdown
          group={group}
          options={items.filter(
            (item) => item.code.substring(0, 1) === group.code.substring(0, 1),
          )}
          key={index}
          onChange={onChange}
          {...props}
        />
      ))}
    </>
  )
}
