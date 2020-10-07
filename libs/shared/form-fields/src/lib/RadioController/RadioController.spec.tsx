import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render } from '@testing-library/react'
import { RadioController } from './RadioController'

const Wrapper: React.FC = ({ children }) => {
  const hookFormData = useForm({ defaultValues: { values: [] } })
  return <FormProvider {...hookFormData}>{children}</FormProvider>
}

describe('RadioController', () => {
  it('should render properly', () => {
    const options = [
      { label: 'some checkbox', value: 'off' },
      { label: 'another checkbox', value: 'on' },
    ]
    const { getByText } = render(
      <Wrapper>
        <RadioController id="values" options={options} />
      </Wrapper>,
    )
    expect(getByText('some checkbox')).toBeInTheDocument()
    expect(getByText('another checkbox')).toBeInTheDocument()
  })

  it('should render an error message', () => {
    const options = [
      { label: 'some checkbox', value: 'off' },
      { label: 'another checkbox', value: 'on' },
    ]
    const { getByText } = render(
      <Wrapper>
        <RadioController id="values" error="error indeed" options={options} />
      </Wrapper>,
    )
    expect(getByText('error indeed')).toBeInTheDocument()
  })

  it('should render a tooltip next to an option if wished', () => {
    const options = [
      { label: 'some checkbox', value: 'off', tooltip: 'nice tooltip' },
      { label: 'another checkbox', value: 'on' },
    ]
    const { getByText } = render(
      <Wrapper>
        <RadioController id="values" error="error indeed" options={options} />
      </Wrapper>,
    )
    expect(getByText('nice tooltip')).toBeInTheDocument()
  })
})
