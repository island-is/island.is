import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, screen } from '@testing-library/react'
import { RadioController } from './RadioController'

const Wrapper: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const hookFormData = useForm({ defaultValues: { values: [] } })
  return <FormProvider {...hookFormData}>{children}</FormProvider>
}

describe('RadioController', () => {
  it('should render properly', () => {
    const options = [
      { label: 'some checkbox', value: 'off' },
      { label: 'another checkbox', value: 'on' },
    ]
    render(
      <Wrapper>
        <RadioController id="values" options={options} />
      </Wrapper>,
    )
    expect(screen.getByText('some checkbox')).toBeInTheDocument()
    expect(screen.getByText('another checkbox')).toBeInTheDocument()
  })

  it('should render an error message', () => {
    const options = [
      { label: 'some checkbox', value: 'off' },
      { label: 'another checkbox', value: 'on' },
    ]
    render(
      <Wrapper>
        <RadioController id="values" error="error indeed" options={options} />
      </Wrapper>,
    )
    expect(screen.getByText('error indeed')).toBeInTheDocument()
  })

  it('should render a tooltip next to an option if wished', () => {
    const options = [
      { label: 'some checkbox', value: 'off', tooltip: 'nice tooltip' },
      { label: 'another checkbox', value: 'on' },
    ]
    render(
      <Wrapper>
        <RadioController id="values" options={options} />
      </Wrapper>,
    )
    expect(screen.getByText('nice tooltip')).toBeInTheDocument()
  })

  it('should render a sublabel below an option if wished and largeButtons is set to true', () => {
    const options = [
      { label: 'some checkbox', value: 'off', subLabel: 'nice sublabel' },
      { label: 'another checkbox', value: 'on' },
    ]
    render(
      <Wrapper>
        <RadioController id="values" options={options} />
      </Wrapper>,
    )
    expect(screen.getByText('nice sublabel')).toBeInTheDocument()
  })

  it('should not render a sublabel below an option if wished and largeButtons is set to false', () => {
    const options = [
      { label: 'some checkbox', value: 'off', subLabel: 'nice sublabel' },
      { label: 'another checkbox', value: 'on' },
    ]
    render(
      <Wrapper>
        <RadioController id="values" largeButtons={false} options={options} />
      </Wrapper>,
    )
    expect(screen.queryByText('nice sublabel')).not.toBeInTheDocument()
  })
})
