import React, { FC, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  Button,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { useEffect } from '@storybook/addons'

interface Props extends FieldBaseProps {
  field: CustomField
}
type Country = { name: string; region: string }
// This component is a pure example of how flexible the application system engine truly is
// It shows how to update multiple schema values, async, hidden, and shows how to access
// already answered questions and other fields even
const ExampleCountryField: FC<React.PropsWithChildren<Props>> = ({
  error,
  field,
  application,
}) => {
  const { answers: formValue } = application
  const { clearErrors, register, setValue } = useFormContext()
  const { id } = field
  const [options, setOptions] = useState<AsyncSearchOption[]>([])
  const [pending, setPending] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<
    { name: string; region: string } | undefined
  >(undefined)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [age, setAge] = useState(formValue.person?.age || 0)

  function fetchCountries(query = '') {
    if (query.length === 0) {
      return
    }
    setPending(true)
    fetch(`https://restcountries.eu/rest/v2/name/${query}`)
      .then((res) => res.json())
      .then((data: Country[]) => {
        setPending(false)
        if (data.length) {
          setOptions(
            data.map(({ name, region }) => ({
              label: name,
              value: name,
              region,
            })),
          )
        }
      })
  }

  useEffect(() => {
    setValue('person.age', age)
  }, [age, setValue])

  return (
    <>
      <Text>
        We can easily implement custom fields that might only be used in a
        single application. You could render anything you like in these kinds of
        fields. But do try to use the existing components and patterns as much
        as you can
      </Text>
      <Box paddingTop={2}>
        <Controller
          name={`${id}`}
          defaultValue=""
          render={({ field: { onChange, value } }) => {
            return (
              <AsyncSearch
                options={options}
                placeholder="Start typing to search for your country"
                initialInputValue={value}
                onChange={(selection: { value: string } | null) => {
                  clearErrors(id)
                  const selectedValue =
                    selection === null ? undefined : selection.value
                  const selectedOption = options.find(
                    (option) => option.value === selectedValue,
                  )
                  setSelectedCountry(selectedOption as unknown as Country)
                  onChange(selection === null ? undefined : selection.value)
                }}
                onInputValueChange={(newValue) => {
                  fetchCountries(newValue)
                }}
                loading={pending}
              />
            )
          }}
        />
      </Box>
      {error && (
        <Box color="red400" padding={2}>
          <Text color="red400">{error}</Text>
        </Box>
      )}
      {selectedCountry && (
        <Box color="blue200" padding={4}>
          <Text>
            {selectedCountry?.name} is in {selectedCountry.region}
          </Text>{' '}
        </Box>
      )}
      <Text> You can even access the answers to past questions: </Text>
      {Object.keys(formValue).map((k) => (
        <Text key={k}>
          <strong>{k}:</strong> {formValue.k ? formValue.k.toString() : ''}
        </Text>
      ))}
      <Text>
        And you can also manipulate other schema entries, this one is the first
        question you already answered:
      </Text>
      <Input
        id={'person.name'}
        {...register('person.name')}
        label={'Name again'}
      />
      <Text>
        Finally, use setValue to update form values with atypical UI elements
      </Text>
      <Button onClick={() => setAge(age + 1)}>+++Increment age+++ {age}</Button>
    </>
  )
}

export default ExampleCountryField
