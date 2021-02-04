import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render } from '@testing-library/react'
import { CheckboxController } from './CheckboxController'

const Wrapper: React.FC = ({ children }) => {
  const hookFormData = useForm({ defaultValues: { values: [] } })
  return <FormProvider {...hookFormData}>{children}</FormProvider>
}

describe('CheckboxController', () => {
  it('should render properly', () => {
    const options = [
      { label: 'some checkbox', value: 'off' },
      { label: 'another checkbox', value: 'on' },
    ]
    const { getByText } = render(
      <Wrapper>
        <CheckboxController id="values" options={options} />
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
        <CheckboxController
          id="values"
          error="error indeed"
          options={options}
        />
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
        <CheckboxController
          id="values"
          error="error indeed"
          options={options}
        />
      </Wrapper>,
    )
    expect(getByText('nice tooltip')).toBeInTheDocument()
  })

  it('should render a sublabel below an option if wished and when large set to true', () => {
    const options = [
      { label: 'some checkbox', value: 'off', subLabel: 'nice sublabel' },
      { label: 'another checkbox', value: 'on' },
    ]
    const { getByText } = render(
      <Wrapper>
        <CheckboxController
          id="values"
          error="error indeed"
          large={true}
          options={options}
        />
      </Wrapper>,
    )
    expect(getByText('nice sublabel')).toBeInTheDocument()
  })

  it('should NOT render a sublabel below an option if wished and when large is set to false or undefined', () => {
    const options = [
      { label: 'some checkbox', value: 'off', subLabel: 'nice sublabel' },
      { label: 'another checkbox', value: 'on' },
    ]
    const { getByText } = render(
      <Wrapper>
        <CheckboxController
          id="values"
          error="error indeed"
          options={options}
        />
      </Wrapper>,
    )
    expect(getByText('nice sublabel')).not.toBeInTheDocument()
  })
})
