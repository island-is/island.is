import { useLoaderData } from 'react-router-dom'
import { FormProvider } from '../../context/FormProvider'
import { FormLayout } from '../../components/FormLayout/FormLayout'
import { FormLoaderResponse } from '@island.is/form-system/graphql'

export const Form = () => {
  const formBuilder = useLoaderData() as FormLoaderResponse
  const { form } = formBuilder
  if (!form || !formBuilder) {
    return <div>Loading...</div>
  }
  return (
    <FormProvider formBuilder={formBuilder}>
      <FormLayout />
    </FormProvider>
  )
}

export default Form
