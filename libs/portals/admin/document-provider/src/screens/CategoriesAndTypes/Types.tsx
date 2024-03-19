import React from 'react'
import { useGetDocumentProvidedTypesQuery } from './CategoriesAndTypes.generated'
import CategoriesAndTypesWrapper from '../../components/CategoriesAndTypesWrapper'

type Props = {
  callback: () => void
}

const DocumentTypes = (props: Props) => {
  const { data, loading, error } = useGetDocumentProvidedTypesQuery()
  const TypeArray = data?.documentProviderProvidedTypes ?? []

  return (
    <CategoriesAndTypesWrapper
      dataArray={TypeArray}
      error={error}
      loading={loading}
      {...props}
    />
  )
}

export default DocumentTypes
