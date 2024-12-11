import { useMutation, useQuery } from '@apollo/client'
import {
  UPDATE_APPLICATION,
  APPLICATION_APPLICATION,
  SUBMIT_APPLICATION,
  CREATE_APPLICATION,
} from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { partialSchema } from '../lib/dataSchema'
import { OJOIApplication } from '../lib/types'
import debounce from 'lodash/debounce'
import { DEBOUNCE_INPUT_TIMER } from '../lib/constants'
import { ApplicationTypes } from '@island.is/application/types'
import { Application } from '@island.is/api/schema'

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
    updateApplicationMutation,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_APPLICATION)

  const [
    submitApplicationMutation,
    { data: submitData, loading: submitLoading, error: submitError },
  ] = useMutation(SUBMIT_APPLICATION)

  const [createApplicationMutation] = useMutation(CREATE_APPLICATION)

  const updateApplication = async (input: partialSchema, cb?: () => void) => {
    await updateApplicationMutation({
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

    cb && cb()
  }

  const submitApplication = async (
    event: string,
    onCompleted?: (data: { submitApplication: Application }) => void,
  ) => {
    await submitApplicationMutation({
      variables: {
        locale,
        input: {
          id: applicationId,
          event: event,
        },
      },
      onCompleted: onCompleted,
    })
  }

  const createApplication = async (
    onComplete?: (data: { createApplication: Application }) => void,
  ) => {
    await createApplicationMutation({
      variables: {
        input: {
          typeId: ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND,
          initialQuery: null,
        },
      },
      onCompleted: (data) => {
        onComplete && onComplete(data)
      },
    })
  }

  const debouncedUpdateApplication = debounce(
    updateApplication,
    DEBOUNCE_INPUT_TIMER,
  )

  const debouncedOnUpdateApplicationHandler = (
    input: partialSchema,
    cb?: () => void,
  ) => {
    debouncedUpdateApplication.cancel()
    debouncedUpdateApplication(input, cb)
  }

  return {
    application: application?.applicationApplication as OJOIApplication,
    applicationLoading,
    applicationError,
    submitData,
    submitLoading,
    submitError,
    updateData,
    updateLoading,
    updateError,
    isLoading: applicationLoading || updateLoading,
    debouncedOnUpdateApplicationHandler,
    updateApplication,
    submitApplication,
    createApplication,
    refetchApplication,
  }
}
