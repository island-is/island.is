import { CaseStatuses } from '../../../types/enums'

const getTagVariants = (status: string) => {
  switch (status) {
    case CaseStatuses.forReview:
      return 'purple'
    case CaseStatuses.inProgress:
      return 'darkerBlue'
    case CaseStatuses.published:
      return 'mint'
  }
}
export default getTagVariants
