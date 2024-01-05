import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, fireEvent } from '@testing-library/react'
import { InputController } from './InputController'

const Wrapper: React.FC<
  React.PropsWithChildren<{ defaultValues: Record<string, any> }>
> = ({ children, defaultValues = {} }) => {
  const hookFormData = useForm({ defaultValues })
  return <FormProvider {...hookFormData}>{children}</FormProvider>
}

describe('InputController', () => {
  it('should render properly', () => {
    const { getByDisplayValue } = render(
      <Wrapper defaultValues={{ id: 'some value' }}>
        <InputController id="id" />
      </Wrapper>,
    )
    expect(getByDisplayValue('some value')).toBeInTheDocument()
  })

  it('should be initialized with default value', () => {
    const { getByDisplayValue } = render(
      <Wrapper defaultValues={{ id: undefined }}>
        <InputController id="id" defaultValue="the most default value" />
      </Wrapper>,
    )
    expect(getByDisplayValue('the most default value')).toBeInTheDocument()
  })

  it('should be overwritten by default value stored in the react hook form state', () => {
    const { getByDisplayValue, queryByLabelText } = render(
      <Wrapper defaultValues={{ id: 'this should overwrite' }}>
        <InputController id="id" defaultValue="the most default value" />
      </Wrapper>,
    )
    expect(queryByLabelText('the most default value')).not.toBeInTheDocument()
    expect(getByDisplayValue('this should overwrite')).toBeInTheDocument()
  })

  it('should render an input with a label', () => {
    const { getByLabelText } = render(
      <Wrapper defaultValues={{ id: 'some value' }}>
        <InputController id="id" label="great label" />
      </Wrapper>,
    )
    expect(getByLabelText('great label')).toBeInTheDocument()
  })

  it('should render an error message', () => {
    const { getByDisplayValue, getByText } = render(
      <Wrapper defaultValues={{ id: 'some value' }}>
        <InputController id="id" error="error indeed" />
      </Wrapper>,
    )
    expect(getByDisplayValue('some value')).toBeInTheDocument()
    expect(getByText('error indeed')).toBeInTheDocument()
  })

  it('should render an input with a placeholder', () => {
    const { getByPlaceholderText } = render(
      <Wrapper defaultValues={{ id: 'some value' }}>
        <InputController id="id" placeholder="great placeholder" />
      </Wrapper>,
    )
    expect(getByPlaceholderText('great placeholder')).toBeInTheDocument()
  })

  it('should change input value on input change', () => {
    const { getByDisplayValue, getByLabelText, queryByLabelText } = render(
      <Wrapper defaultValues={{ id: 'some value' }}>
        <InputController id="id" label="great label" />
      </Wrapper>,
    )
    const input = getByLabelText('great label')
    expect(queryByLabelText('new value')).not.toBeInTheDocument()
    fireEvent.change(input, { target: { value: 'new value' } })
    expect(getByDisplayValue('new value')).toBeInTheDocument()
  })

  it('should call passed in onChange prop when changed', () => {
    const onChange = jest.fn()
    const { getByDisplayValue, getByLabelText } = render(
      <Wrapper defaultValues={{ id: undefined }}>
        <InputController
          id="id"
          label="great label"
          onChange={onChange}
          defaultValue="some value"
        />
      </Wrapper>,
    )
    const input = getByLabelText('great label')
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: 'new value' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(getByDisplayValue('new value')).toBeInTheDocument()
  })
})
