import React, { FC, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CustomField, FieldBaseProps } from '@island.is/application/core'
import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  Button,
  Input,
  Text,
} from '@island.is/island-ui/core'

interface Props extends FieldBaseProps {
  field: CustomField
}
type Country = { name: string; region: string }
// This component is a pure example of how flexible the application system engine truly is
// It shows how to update multiple schema values, async, hidden, and shows how to access
// already answered questions and other fields even
const ExampleCountryField: FC<Props> = ({ error, field, application }) => {
  const { answers: formValue } = application
  const { clearErrors, register } = useFormContext()
  const { id } = field
  const [options, setOptions] = useState<AsyncSearchOption[]>([])
  const [pending, setPending] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<
    { name: string; region: string } | undefined
  >(undefined)

  // call dataprovieder

  // get from from dataprovider

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

  return (
    <>
      <Text>
        We can easily implement custom fields that might only be used in a
        single application. You could render anything you like in these kinds of
        fields.
      </Text>
      <Box paddingTop={2}>
        <Controller
          name={`${id}`}
          defaultValue=""
          render={({ value, onChange }) => {
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
                  setSelectedCountry((selectedOption as unknown) as Country)
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
          <strong>{k}:</strong> {formValue[k].toString()}
        </Text>
      ))}
      <Text>
        {' '}
        And you can also manipulate other schema entries, this one is the first
        question you already answered:
      </Text>
      <Input
        id={'person.name'}
        name={'person.name'}
        label={'Name again'}
        ref={register}
      />
      <Text>
        {' '}
        Finally, use hidden inputs to update form values with atypical UI
        elements
      </Text>
      <Button onClick={() => setAge(age + 1)}>+++Increment age+++ {age}</Button>
      <input type="hidden" value={age} ref={register} name={'person.age'} />
    </>
  )
}

export default ExampleCountryField
