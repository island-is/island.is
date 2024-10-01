import { useLoaderData } from 'react-router-dom'
import { FormLoaderResponse } from './Form.loader'
import { FormProvider } from '../../context/FormProvider'
import { FormLayout } from '../../components/FormLayout/FormLayout'




export const Form = () => {
  const { formBuilder } = useLoaderData() as FormLoaderResponse
  const { form } = formBuilder

  if (!form) {
    return <div>Loading...</div>
  }
  return (
    <FormProvider form={formBuilder}>
      <FormLayout />
    </FormProvider>
  )
}

export default Form
