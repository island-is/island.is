import { useFetchAdvicesById, useIsMobile } from '../../hooks'
import { Case } from '../../types/interfaces'
import { CaseStatuses } from '../../types/enums'
import Error404 from '../Error404/Error404'
import CaseMobile from './CaseMobile'
import CaseDesktop from './CaseDesktop'
import { getStakeholdersList, shouldShowStakeholdersBox } from './utils'

interface Props {
  chosenCase: Case
  caseId: number
}

const CaseScreen = ({ chosenCase, caseId }: Props) => {
  const { isMobile } = useIsMobile()
  const { advices, advicesLoading, refetchAdvices } = useFetchAdvicesById({
    caseId: caseId,
  })

  const stakeholders = getStakeholdersList({
    stakeholders: chosenCase?.stakeholders,
    extraStakeholderList: chosenCase?.extraStakeholderList,
  })

  const isStakeholdersNotEmpty = stakeholders?.length > 0
  const isRelatedCasesNotEmpty = chosenCase?.relatedCases?.length > 0
  const isDocumentsNotEmpty = chosenCase?.documents?.length > 0
  const isAdditionalDocumentsNotEmpty =
    chosenCase?.additionalDocuments?.length > 0
  const isStatusNameNotPublished =
    chosenCase?.statusName !== CaseStatuses.published
  const isStatusNameForReview =
    chosenCase?.statusName === CaseStatuses.forReview
  const isChosenCaseNull = Object.values(chosenCase).every(
    (value) => value === null,
  )
  const isStakeholdersBoxVisible = shouldShowStakeholdersBox({ chosenCase })
  const shouldDisplayHidden = chosenCase.allowUsersToSendPrivateAdvices && chosenCase.advicePublishTypeId !== 3

  const expressions = {
    isDocumentsNotEmpty,
    isAdditionalDocumentsNotEmpty,
    isStatusNameNotPublished,
    isStatusNameForReview,
    isStakeholdersNotEmpty,
    isRelatedCasesNotEmpty,
    isStakeholdersBoxVisible,
    shouldDisplayHidden
  }

  if (isChosenCaseNull) {
    return <Error404 />
  }

  if (isMobile) {
    return (
      <CaseMobile
        chosenCase={chosenCase}
        stakeholders={stakeholders}
        expressions={expressions}
        advices={advices}
        advicesLoading={advicesLoading}
        refetchAdvices={refetchAdvices}
      />
    )
  }

  return (
    <CaseDesktop
      chosenCase={chosenCase}
      stakeholders={stakeholders}
      expressions={expressions}
      advices={advices}
      advicesLoading={advicesLoading}
      refetchAdvices={refetchAdvices}
    />
  )
}

export default CaseScreen
