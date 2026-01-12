import React from 'react'
import { MutationResult, useMutation } from '@apollo/client'

import {
  TellUsAStoryForm,
  TellUsAStoryFormProps,
} from '@island.is/island-ui/contentful'
import { TELL_US_A_STORY_MUTATION } from '@island.is/web/screens/queries'

import {
  TellUsAStoryMutation,
  TellUsAStoryMutationVariables,
} from '../../graphql/schema'

const getState = (
  data: MutationResult<TellUsAStoryMutation>['data'],
  loading: MutationResult['loading'],
  error: MutationResult['error'],
) => {
  if (data?.tellUsAStory?.sent === true) return 'success'
  if (data?.tellUsAStory?.sent === false) return 'error'
  if (loading) return 'submitting'
  if (error) return 'error'
  return 'edit'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TellUsAStoryProps
  extends Omit<TellUsAStoryFormProps, 'state' | 'onSubmit'> {}

export const TellUsAStory = (props: TellUsAStoryProps) => {
  const [submit, { data, loading, error }] = useMutation<
    TellUsAStoryMutation,
    TellUsAStoryMutationVariables
  >(TELL_US_A_STORY_MUTATION)
  return (
    <TellUsAStoryForm
      {...props}
      state={getState(data, loading, error)}
      onSubmit={async (formState) => {
        await submit({ variables: { input: formState } })
      }}
    />
  )
}

export default TellUsAStory
