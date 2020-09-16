import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, fireEvent } from '@testing-library/react'
import { InputController } from './InputController'

const Wrapper = ({ children, defaultValues = {} }) => {
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
    const { getByLabelText } = render(
      <Wrapper defaultValues={{ id: 'some value' }}>
        <InputController id="id" label="great label" onChange={onChange} />
      </Wrapper>,
    )
    const input = getByLabelText('great label')
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: 'new value' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
