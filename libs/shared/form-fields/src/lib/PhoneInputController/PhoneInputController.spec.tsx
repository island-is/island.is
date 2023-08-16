import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, fireEvent } from '@testing-library/react'
import { PhoneInputController } from './PhoneInputController'

const DEFAULT_COUNTRY_CODE = '+354'

const Wrapper: React.FC<
  React.PropsWithChildren<{ defaultValues: Record<string, any> }>
> = ({ children, defaultValues = {} }) => {
  const hookFormData = useForm({ defaultValues })
  return <FormProvider {...hookFormData}>{children}</FormProvider>
}

describe('PhoneInputController', () => {
  it('should render properly', () => {
    const { getByDisplayValue } = render(
      <Wrapper defaultValues={{ id: '1234567' }}>
        <PhoneInputController id="id" />
      </Wrapper>,
    )
    expect(getByDisplayValue('123-4567')).toBeInTheDocument()
  })

  it('should be initialized with default value', () => {
    const { getByDisplayValue } = render(
      <Wrapper defaultValues={{ id: undefined }}>
        <PhoneInputController id="id" defaultValue={'9999999'} />
      </Wrapper>,
    )
    expect(getByDisplayValue('999-9999')).toBeInTheDocument()
  })

  it('should be initialized with default country code when no country code can be parsed from number', () => {
    const { getByDisplayValue } = render(
      <Wrapper defaultValues={{ id: undefined }}>
        <PhoneInputController id="id" />
      </Wrapper>,
    )
    expect(getByDisplayValue(DEFAULT_COUNTRY_CODE)).toBeInTheDocument()
  })

  it('should be initialized with parsed country code from default value', () => {
    const { getByDisplayValue } = render(
      <Wrapper defaultValues={{ id: undefined }}>
        <PhoneInputController id="id" defaultValue="+4558265132" />
      </Wrapper>,
    )
    expect(getByDisplayValue('+45')).toBeInTheDocument()
  })

  it('should be overwritten by default value stored in the react hook form state', () => {
    const { getByDisplayValue, queryByLabelText } = render(
      <Wrapper defaultValues={{ id: '1234567' }}>
        <PhoneInputController id="id" defaultValue="9999999" />
      </Wrapper>,
    )
    expect(queryByLabelText('999-9999')).not.toBeInTheDocument()
    expect(getByDisplayValue('123-4567')).toBeInTheDocument()
  })

  it('should render an input with a label', () => {
    const { getByLabelText } = render(
      <Wrapper defaultValues={{ id: '1234567' }}>
        <PhoneInputController id="id" label="great label" />
      </Wrapper>,
    )
    expect(getByLabelText('great label')).toBeInTheDocument()
  })

  it('should render an error message', () => {
    const { getByDisplayValue, getByText } = render(
      <Wrapper defaultValues={{ id: '1234567' }}>
        <PhoneInputController id="id" error="error indeed" />
      </Wrapper>,
    )
    expect(getByDisplayValue('123-4567')).toBeInTheDocument()
    expect(getByText('error indeed')).toBeInTheDocument()
  })

  it('should render an input with a placeholder', () => {
    const { getByPlaceholderText } = render(
      <Wrapper defaultValues={{ id: '1234567' }}>
        <PhoneInputController id="id" placeholder="great placeholder" />
      </Wrapper>,
    )
    expect(getByPlaceholderText('great placeholder')).toBeInTheDocument()
  })

  it('should change input value on input change', () => {
    const { getByDisplayValue, getByLabelText, queryByLabelText } = render(
      <Wrapper defaultValues={{ id: '1234567' }}>
        <PhoneInputController id="id" label="great label" />
      </Wrapper>,
    )
    const input = getByLabelText('great label')
    expect(queryByLabelText('999-9999')).not.toBeInTheDocument()
    fireEvent.change(input, { target: { value: '9999999' } })
    expect(getByDisplayValue('999-9999')).toBeInTheDocument()
  })

  it('should call passed in onChange prop when changed', () => {
    const onChange = jest.fn()
    const { getByDisplayValue, getByLabelText } = render(
      <Wrapper defaultValues={{ id: undefined }}>
        <PhoneInputController
          id="id"
          label="great label"
          onChange={onChange}
          defaultValue="1234567"
        />
      </Wrapper>,
    )
    const input = getByLabelText('great label')
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: '9999999' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(getByDisplayValue('999-9999')).toBeInTheDocument()
  })
})
