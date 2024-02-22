import React from 'react'
import { useGetDocumentProvidedTypesQuery } from './CategoriesAndTypes.generated'
import CategoriesAndTypesWrapper from '../../components/CategoriesAndTypesWrapper'

const DocumentTypes = () => {
  const { data, loading, error } = useGetDocumentProvidedTypesQuery()
  const TypeArray = data?.getDocumentProvidedTypes ?? []

  return (
    <CategoriesAndTypesWrapper
      dataArray={TypeArray}
      error={error}
      loading={loading}
    />
  )
}

export default DocumentTypes
