import {
  Application,
  ApplicationResponseDtoStatusEnum,
} from '../../../graphql/types/schema'

type BadgeVariant = 'blue' | 'blueberry' | 'mint' | 'red'

export const getBadgeVariant = (application: Application): BadgeVariant => {
  switch (application.status) {
    case ApplicationResponseDtoStatusEnum.Draft:
      return 'blue'
    case ApplicationResponseDtoStatusEnum.Notstarted:
      return 'blueberry'
    case ApplicationResponseDtoStatusEnum.Inprogress:
      return 'blueberry'
    case ApplicationResponseDtoStatusEnum.Rejected:
      return 'red'
    default:
      return 'mint'
  }
}
