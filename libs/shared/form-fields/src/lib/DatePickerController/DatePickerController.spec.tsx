import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, fireEvent } from '@testing-library/react'
import { DatePickerController } from './DatePickerController'

const Wrapper: React.FC<
  React.PropsWithChildren<{ defaultValues: Record<string, any> }>
> = ({ children, defaultValues = {} }) => {
  const hookFormData = useForm({ defaultValues })
  return <FormProvider {...hookFormData}>{children}</FormProvider>
}

describe('DatePickerController', () => {
  it('should render properly', () => {
    const { getByDisplayValue } = render(
      <Wrapper defaultValues={{ id: '2020-10-02' }}>
        <DatePickerController id="id" label="date" />
      </Wrapper>,
    )
    expect(getByDisplayValue('02/10/2020')).toBeInTheDocument()
  })

  it('should render an error message', () => {
    const { getByText, getByDisplayValue } = render(
      <Wrapper defaultValues={{ id: '2020-10-02' }}>
        <DatePickerController id="id" label="date" error="error indeed" />
      </Wrapper>,
    )
    expect(getByDisplayValue('02/10/2020')).toBeInTheDocument()

    expect(getByText('error indeed')).toBeInTheDocument()
  })

  it('should render with a placeholder', () => {
    const { getByPlaceholderText } = render(
      <Wrapper defaultValues={{ id: undefined }}>
        <DatePickerController
          id="id"
          label="date"
          placeholder="great placeholder"
        />
      </Wrapper>,
    )
    expect(getByPlaceholderText('great placeholder')).toBeInTheDocument()
  })

  it('should render no placeholder if the datepicker has a selected value', () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <Wrapper defaultValues={{ id: '2020-10-02' }}>
        <DatePickerController
          id="id"
          label="date"
          placeholder="great placeholder"
        />
      </Wrapper>,
    )
    expect(queryByDisplayValue('great placeholder')).not.toBeInTheDocument()
    expect(getByDisplayValue('02/10/2020')).toBeInTheDocument()
  })

  it('should change date value on date select', () => {
    const { getByDisplayValue, getByText } = render(
      <Wrapper defaultValues={{ id: '2020-10-02' }}>
        <DatePickerController id="id" label="date" />
      </Wrapper>,
    )
    fireEvent.click(getByDisplayValue('02/10/2020'))
    fireEvent.click(getByText('15'))
    expect(getByDisplayValue('15/10/2020')).toBeInTheDocument()
  })
})
