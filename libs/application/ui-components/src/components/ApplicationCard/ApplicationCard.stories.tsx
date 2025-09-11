import React from 'react'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { ApplicationCard } from './ApplicationCard'

export default {
  title: 'Cards/ApplicationCard',
  component: ApplicationCard,
}

export const Default = () => (
  <ApplicationCard
    onClick={() => null}
    application={{
      id: 'application1',
      modified: new Date(),
      status: ApplicationStatus.DRAFT,
      typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      name: 'Example Application',
      progress: 0.4,
      actionCard: {
        draftFinishedSteps: 2,
        draftTotalSteps: 5,
        description: 'This is an application',
      },
    }}
  />
)

export const Completed = () => (
  <ApplicationCard
    onClick={() => null}
    application={{
      id: 'application2',
      modified: new Date(),
      status: ApplicationStatus.COMPLETED,
      typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      name: 'Example Application',
      progress: 1,
      actionCard: {
        draftFinishedSteps: 5,
        draftTotalSteps: 5,
        description: 'This application is completed',
      },
    }}
  />
)

export const WithHistory = () => (
  <ApplicationCard
    onClick={() => null}
    application={{
      id: 'application3',
      modified: new Date(),
      status: ApplicationStatus.IN_PROGRESS,
      typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      name: 'Example Application',
      progress: 1,
      actionCard: {
        draftFinishedSteps: 5,
        draftTotalSteps: 5,
        description: 'This application is in progress and displays the history',
        pendingAction: {
          displayStatus: 'info',
          content: 'Waiting for action from third party',
          title: 'Waiting for action',
        },
        history: [
          { date: new Date(), log: 'Application was submitted' },
          { date: new Date(), log: 'Application was updated' },
          { date: new Date(), log: 'Application was created' },
        ],
      },
    }}
  />
)
