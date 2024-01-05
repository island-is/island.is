import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render } from '@testing-library/react'
import { SelectController } from './SelectController'

const Wrapper: React.FC<
  React.PropsWithChildren<{ defaultValues: Record<string, any> }>
> = ({ children, defaultValues = {} }) => {
  const hookFormData = useForm({ defaultValues })
  return <FormProvider {...hookFormData}>{children}</FormProvider>
}

describe('SelectController', () => {
  it('should render properly', async () => {
    const { getByText } = render(
      <Wrapper defaultValues={{ id: 'some value' }}>
        <SelectController
          id="id"
          label="Question"
          options={[{ label: 'some value', value: 'value1' }]}
        />
      </Wrapper>,
    )
    expect(getByText('Question')).toBeInTheDocument()
  })

  it('should render an error message', () => {
    const { getByText } = render(
      <Wrapper defaultValues={{ id: 'some value' }}>
        <SelectController id="id" error="error indeed" label="Question" />
      </Wrapper>,
    )
    expect(getByText('error indeed')).toBeInTheDocument()
  })

  it('should render a select with a placeholder', () => {
    const { getByText } = render(
      <Wrapper defaultValues={{ id: 'some value' }}>
        <SelectController
          id="id"
          placeholder="great placeholder"
          label="Question"
        />
      </Wrapper>,
    )
    expect(getByText('great placeholder')).toBeInTheDocument()
  })
})
