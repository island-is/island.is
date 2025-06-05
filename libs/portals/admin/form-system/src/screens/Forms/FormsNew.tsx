import { useLoaderData } from "react-router-dom"
import { FormsLoaderResponse } from '@island.is/form-system/graphql'
import { FormsProvider } from "../../context/FormsProvider"
import { FormsHeader } from "../../components/FormsLayout/components/FormsHeader"
import { FormsLayout } from "../../components/FormsLayout/FormsLayout"

export const FormsNew = () => {
  const formsLoader = useLoaderData() as FormsLoaderResponse
  console.log('formsLoader', formsLoader)
  if (formsLoader) {
    return (
      <FormsProvider formsLoader={formsLoader}>
        <FormsLayout />
      </FormsProvider>

    )
  }
  return null
}