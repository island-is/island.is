import { useFetchAdvicesById, useIsMobile } from '../../hooks'
import { Case } from '../../types/interfaces'
import { CaseStatuses } from '../../types/enums'
import localization from './Case.json'
import Error404 from '../Error404/Error404'
import CaseMobile from './CaseMobile'
import CaseDesktop from './CaseDesktop'

interface Props {
  chosenCase: Case
  caseId: number
}

const CaseScreen = ({ chosenCase, caseId }: Props) => {
  const loc = localization['case']
  const { isMobile } = useIsMobile()
  const { advices, advicesLoading, refetchAdvices } = useFetchAdvicesById({
    caseId: caseId,
  })

  const isStakeholdersNotEmpty = chosenCase?.stakeholders?.length > 0
  const isRelatedCasesNotEmpty = chosenCase?.relatedCases?.length > 0
  const isDocumentsNotEmpty = chosenCase?.documents?.length > 0
  const isAdditionalDocumentsNotEmpty =
    chosenCase?.additionalDocuments?.length > 0
  const isStatusNameNotPublished =
    chosenCase?.statusName !== CaseStatuses.published
  const isStatusNameForReview =
    chosenCase?.statusName === CaseStatuses.forReview
  const isChosenCaseNull = Object.values(chosenCase).every((value) =>
    Boolean(String(value).trim()),
  )

  const expressions = {
    isDocumentsNotEmpty: isDocumentsNotEmpty,
    isAdditionalDocumentsNotEmpty: isAdditionalDocumentsNotEmpty,
    isStatusNameNotPublished: isStatusNameNotPublished,
    isStatusNameForReview: isStatusNameForReview,
    isStakeholdersNotEmpty: isStakeholdersNotEmpty,
    isRelatedCasesNotEmpty: isRelatedCasesNotEmpty,
  }

  if (isChosenCaseNull) {
    return <Error404 />
  }

  if (isMobile) {
    return (
      <CaseMobile
        chosenCase={chosenCase}
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
      expressions={expressions}
      advices={advices}
      advicesLoading={advicesLoading}
      refetchAdvices={refetchAdvices}
    />
  )
}

export default CaseScreen
