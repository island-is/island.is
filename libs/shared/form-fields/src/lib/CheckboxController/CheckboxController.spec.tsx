import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, screen } from '@testing-library/react'
import { CheckboxController } from './CheckboxController'

const Wrapper: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const hookFormData = useForm({ defaultValues: { values: [] } })
  return <FormProvider {...hookFormData}>{children}</FormProvider>
}

describe('CheckboxController', () => {
  it('should render properly', () => {
    const options = [
      { label: 'some checkbox', value: 'off' },
      { label: 'another checkbox', value: 'on' },
    ]
    render(
      <Wrapper>
        <CheckboxController id="values" options={options} />
      </Wrapper>,
    )
    expect(screen.getAllByText('some checkbox')[0]).toBeInTheDocument()
    expect(screen.getAllByText('another checkbox')[0]).toBeInTheDocument()
  })

  it('should render an error message', () => {
    const options = [
      { label: 'some checkbox', value: 'off' },
      { label: 'another checkbox', value: 'on' },
    ]
    render(
      <Wrapper>
        <CheckboxController
          id="values"
          error="error indeed"
          options={options}
        />
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
        <CheckboxController id="values" options={options} />
      </Wrapper>,
    )
    expect(screen.getByText('nice tooltip')).toBeInTheDocument()
  })

  it('should render a sublabel below an option if wished and when large set to true', () => {
    const options = [
      { label: 'some checkbox', value: 'off', subLabel: 'nice sublabel' },
      { label: 'another checkbox', value: 'on' },
    ]
    render(
      <Wrapper>
        <CheckboxController id="values" large={true} options={options} />
      </Wrapper>,
    )
    expect(screen.getByText('nice sublabel')).toBeInTheDocument()
  })

  it('should NOT render a sublabel below an option if wished and when large is set to false or undefined', () => {
    const options = [
      { label: 'some checkbox', value: 'off', subLabel: 'nice sublabel' },
      { label: 'another checkbox', value: 'on' },
    ]
    render(
      <Wrapper>
        <CheckboxController id="values" options={options} />
      </Wrapper>,
    )
    expect(screen.queryByText('nice sublabel')).not.toBeInTheDocument()
  })
})
