import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, fireEvent } from '@testing-library/react'
import { DatePickerController } from './DatePickerController'

const Wrapper: React.FC<{ defaultValues: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const hookFormData = useForm({ defaultValues })
  return <FormProvider {...hookFormData}>{children}</FormProvider>
}

describe('DatePickerController', () => {
  it('should render properly', () => {
    const { getByText } = render(
      <Wrapper defaultValues={{ id: '2020-10-02' }}>
        <DatePickerController id="id" label="date" />
      </Wrapper>,
    )
    expect(getByText('10/02/2020')).toBeInTheDocument()
  })

  it('should render an error message', () => {
    const { getByText } = render(
      <Wrapper defaultValues={{ id: '2020-10-02' }}>
        <DatePickerController id="id" label="date" error="error indeed" />
      </Wrapper>,
    )
    expect(getByText('10/02/2020')).toBeInTheDocument()

    expect(getByText('error indeed')).toBeInTheDocument()
  })

  it('should render with a placeholder', () => {
    const { getByText } = render(
      <Wrapper defaultValues={{}}>
        <DatePickerController
          id="id"
          label="date"
          placeholder="great placeholder"
        />
      </Wrapper>,
    )
    expect(getByText('great placeholder')).toBeInTheDocument()
  })

  it('should render no placeholder if the datepicker has a selected value', () => {
    const { getByText, queryByText } = render(
      <Wrapper defaultValues={{ id: '2020-10-02' }}>
        <DatePickerController
          id="id"
          label="date"
          placeholder="great placeholder"
        />
      </Wrapper>,
    )
    expect(queryByText('great placeholder')).not.toBeInTheDocument()
    expect(getByText('10/02/2020')).toBeInTheDocument()
  })

  it('should change date value on date select', () => {
    const { getByText } = render(
      <Wrapper defaultValues={{ id: '2020-10-02' }}>
        <DatePickerController id="id" label="date" />
      </Wrapper>,
    )
    fireEvent.click(getByText('10/02/2020'))
    fireEvent.click(getByText('15'))
    expect(getByText('10/15/2020')).toBeInTheDocument()
  })
})
