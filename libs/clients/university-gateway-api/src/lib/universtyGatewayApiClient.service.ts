import { Injectable } from '@nestjs/common'
import { ApplicationStatus } from '@island.is/university-gateway'
import { useMutation } from '@apollo/client'

import { gql } from '@apollo/client'

export const ApplicationFragment = gql`
  fragment Application on Application {
    id
    created
    modified
    applicant
    assignees
    applicantActors
    state
    actionCard {
      title
      description
      tag {
        label
        variant
      }
      pendingAction {
        displayStatus
        content
        title
      }
      history {
        log
        date
      }
      deleteButton
      draftTotalSteps
      draftFinishedSteps
    }
    typeId
    answers
    externalData
    progress
    name
    institution
    status
  }
`

export const UPDATE_APPLICATION = gql`
  mutation UpdateApplication(
    $input: UpdateApplicationInput!
    $locale: String!
  ) {
    updateApplication(input: $input, locale: $locale) {
      ...Application
    }
  }
  ${ApplicationFragment}
`

@Injectable()
export class UniversityGatewayApiClientService {
  async updateApplicationStatus(applicationId: string) {
    const [updateApplication, { error }] = useMutation(UPDATE_APPLICATION, {
      onError: (e) => {
        console.error(e, e.message)
        return
      },
    })

    return await updateApplication({
      variables: {
        input: {
          id: applicationId,
          event: 'TEST',
        },
      },
    })
  }
}
