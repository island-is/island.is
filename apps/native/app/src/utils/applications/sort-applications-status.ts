import {
  Application,
  ApplicationResponseDtoStatusEnum,
} from '@/graphql/types/schema'

interface SortedApplication {
  incomplete: Application[]
  inProgress: Application[]
  completed: Application[]
}

export const sortApplicationsStatus = (
  applications: Application[],
): SortedApplication => {
  const incomplete: Application[] = []
  const inProgress: Application[] = []
  const completed: Application[] = []

  applications.forEach((application) => {
    if (
      application.status === ApplicationResponseDtoStatusEnum.Draft ||
      application.status === ApplicationResponseDtoStatusEnum.Notstarted
    ) {
      incomplete.push(application)
    } else if (
      application.status === ApplicationResponseDtoStatusEnum.Inprogress
    ) {
      inProgress.push(application)
    } else {
      completed.push(application)
    }
  })

  return {
    incomplete,
    inProgress,
    completed,
  }
}
