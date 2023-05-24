import { CaseStatuses, MapCaseStatuses } from '../../../types/enums'

const getTagVariants = (status: string) => {
  switch (status) {
    case MapCaseStatuses[CaseStatuses.forReview]:
      return 'purple'
    case MapCaseStatuses[CaseStatuses.inProgress]:
      return 'darkerBlue'
    case MapCaseStatuses[CaseStatuses.published]:
      return 'mint'
  }
}
export default getTagVariants
