import { useMutation, useQuery } from '@apollo/client'
import {
  UPDATE_APPLICATION,
  APPLICATION_APPLICATION,
} from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { partialSchema } from '../lib/dataSchema'
import { OJOIApplication } from '../lib/types'

type OJOIUseApplicationParams = {
  applicationId?: string
}

export const useApplication = ({ applicationId }: OJOIUseApplicationParams) => {
  const { locale } = useLocale()

  const {
    data: application,
    loading: applicationLoading,
    error: applicationError,
    refetch: refetchApplication,
  } = useQuery(APPLICATION_APPLICATION, {
    variables: {
      locale: locale,
      input: {
        id: applicationId,
      },
    },
  })

  const [
    mutation,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_APPLICATION)

  const updateApplication = async (input: partialSchema) => {
    await mutation({
      variables: {
        locale,
        input: {
          id: applicationId,
          answers: {
            ...input,
          },
        },
      },
    })
  }

  return {
    application: application?.applicationApplication as OJOIApplication,
    applicationLoading,
    applicationError,
    updateData,
    updateLoading,
    updateError,
    updateApplication,
    refetchApplication,
  }
}
