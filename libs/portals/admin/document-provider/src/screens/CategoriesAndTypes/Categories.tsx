import React from 'react'
import { useGetDocumentProvidedCategoriesQuery } from './CategoriesAndTypes.generated'
import CategoriesAndTypesWrapper from '../../components/CategoriesAndTypesWrapper'

type Props = {
  callback: () => void
}

const DocumentCategories = (props: Props) => {
  const { data, loading, error } = useGetDocumentProvidedCategoriesQuery()
  const categoryArray = data?.documentProviderProvidedCategories ?? []

  return (
    <CategoriesAndTypesWrapper
      dataArray={categoryArray}
      error={error}
      loading={loading}
      {...props}
    />
  )
}

export default DocumentCategories
