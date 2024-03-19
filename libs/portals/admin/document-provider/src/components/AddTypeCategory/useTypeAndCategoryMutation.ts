import { DocumentProviderCategoriesAndTypesPutInput } from '@island.is/api/schema'
import { TabOptions } from '../../screens/CategoriesAndTypes/TypeCategoryContext'
import {
  usePutDocumentProvidedCategoryMutation,
  usePostDocumentProvidedCategoryMutation,
  usePutDocumentProvidedTypeMutation,
  usePostDocumentProvidedTypeMutation,
} from './MutateTypeCategory.generated'
import { toast } from 'react-toastify'
import {
  useGetDocumentProvidedCategoriesQuery,
  useGetDocumentProvidedTypesQuery,
} from '../../screens/CategoriesAndTypes/CategoriesAndTypes.generated'

export const useTypeAndCategoryMutation = (group: TabOptions | undefined) => {
  const [putCategory, { loading: putCategoryLoading }] =
    usePutDocumentProvidedCategoryMutation()
  const [postCategory, { loading: postCategoryLoading }] =
    usePostDocumentProvidedCategoryMutation()
  const [putType, { loading: putTypeLoading }] =
    usePutDocumentProvidedTypeMutation()
  const [postType, { loading: postTypeLoading }] =
    usePostDocumentProvidedTypeMutation()

  const { refetch: refetchCategories } = useGetDocumentProvidedCategoriesQuery()
  const { refetch: refetchTypes } = useGetDocumentProvidedTypesQuery()

  const mutationFunction = (
    input: Partial<DocumentProviderCategoriesAndTypesPutInput>,
    success?: string,
    error?: string,
  ) => {
    const payload = {
      variables: {
        input,
      },
      onCompleted: () => {
        if (group === 'types') {
          refetchTypes()
        } else {
          refetchCategories()
        }
        toast.success(success ?? 'Saved')
      },
      onError: () => {
        toast.error(error ?? 'Error')
      },
    }

    if (typeof input.id === 'number') {
      const updatePayload = {
        ...payload,
        variables: {
          input: {
            ...input,
            id: input.id,
          },
        },
      }
      if (group === 'types') {
        return putType(updatePayload)
      } else {
        return putCategory(updatePayload)
      }
    }

    if (group === 'types') {
      return postType(payload)
    }
    return postCategory(payload)
  }

  const isLoading =
    putTypeLoading ||
    putCategoryLoading ||
    postTypeLoading ||
    postCategoryLoading

  return { mutationFunction, isLoading }
}
