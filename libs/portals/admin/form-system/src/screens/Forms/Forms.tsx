import { useLoaderData } from 'react-router-dom'
import { FormsLoaderResponse } from '@island.is/form-system/graphql'
import { FormsProvider } from '../../context/FormsProvider'
import { FormsLayout } from '../../components/FormsLayout/FormsLayout'

export const Forms = () => {
  const formsLoader = useLoaderData() as FormsLoaderResponse
  if (formsLoader) {
    return (
      <FormsProvider formsLoader={formsLoader}>
        <FormsLayout />
      </FormsProvider>
    )
  }
  return null
}

export default Forms
