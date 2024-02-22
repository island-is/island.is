import React from 'react'
import { useGetDocumentProvidedCategoriesQuery } from './CategoriesAndTypes.generated'
import CategoriesAndTypesWrapper from '../../components/CategoriesAndTypesWrapper'

const DocumentCategories = () => {
  const { data, loading, error } = useGetDocumentProvidedCategoriesQuery()
  const categoryArray = data?.getDocumentProvidedCategories ?? []

  return (
    <CategoriesAndTypesWrapper
      dataArray={categoryArray}
      error={error}
      loading={loading}
    />
  )
}

export default DocumentCategories
