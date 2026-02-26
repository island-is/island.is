import {
  Application,
  ApplicationResponseDtoStatusEnum,
} from '@/graphql/types/schema'

type ApplicationType = 'incomplete' | 'completed' | 'inProgress'

export const getApplicationType = (
  application: Application,
): ApplicationType => {
  switch (application.status) {
    case ApplicationResponseDtoStatusEnum.Draft:
      return 'incomplete'
    case ApplicationResponseDtoStatusEnum.Notstarted:
      return 'incomplete'
    case ApplicationResponseDtoStatusEnum.Inprogress:
      return 'inProgress'
    default:
      return 'completed'
  }
}
