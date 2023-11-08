import {
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
} from '@island.is/island-ui/core'
import {
  AdviceResult,
  Case,
  CaseExpressions,
  Stakeholder,
} from '../../types/interfaces'
import {
  BlowoutList,
  CaseDocuments,
  CaseOverview,
  CaseStatusBox,
  CaseTimeline,
  Coordinator,
} from './components'
import CaseSkeleton from './components/CaseSkeleton/CaseSkeleton'
import localization from './Case.json'
import dynamic from 'next/dynamic'

const CaseEmailBox = dynamic(
  () => import('./components/CaseEmailBox/CaseEmailBox'),
  { ssr: false },
)
const RenderAdvices = dynamic(
  () => import('./components/RenderAdvices/RenderAdvices'),
  { ssr: false },
)

interface Props {
  chosenCase: Case
  stakeholders: Array<Stakeholder>
  expressions: CaseExpressions
  advices: Array<AdviceResult>
  advicesLoading: boolean
  refetchAdvices: any
}

const CaseDesktop = ({
  chosenCase,
  stakeholders,
  expressions,
  advices,
  advicesLoading,
  refetchAdvices,
}: Props) => {
  const loc = localization['case']
  const {
    caseNumber,
    id,
    documents,
    additionalDocuments,
    statusName,
    relatedCases,
    contactEmail,
    contactName,
    shortDescription,
    advicePublishTypeId,
  } = chosenCase
  const {
    isDocumentsNotEmpty,
    isAdditionalDocumentsNotEmpty,
    isStatusNameNotPublished,
    isStatusNameForReview,
    isStakeholdersNotEmpty,
    isRelatedCasesNotEmpty,
    isStakeholdersBoxVisible,
  } = expressions

  return (
    <CaseSkeleton
      caseNumber={caseNumber}
      caseId={id}
      caseDescription={shortDescription}
    >
      <GridContainer>
        <GridRow rowGap={3}>
          <GridColumn span={'3/12'}>
            <Stack space={3}>
              <Divider />
              <CaseTimeline chosenCase={chosenCase} />
              <Divider />
              {isDocumentsNotEmpty && (
                <CaseDocuments
                  title={loc.documentsBox.documents.title}
                  documents={documents}
                />
              )}
              {isAdditionalDocumentsNotEmpty && (
                <CaseDocuments
                  title={loc.documentsBox.additional.title}
                  documents={additionalDocuments}
                />
              )}
              {isStatusNameNotPublished && (
                <CaseEmailBox caseId={id} caseNumber={caseNumber} />
              )}
            </Stack>
          </GridColumn>
          <GridColumn span={'6/12'}>
            <Stack space={9}>
              <CaseOverview chosenCase={chosenCase} />
              <RenderAdvices
                advicesLoading={advicesLoading}
                isStatusNameForReview={isStatusNameForReview}
                advices={advices}
                chosenCase={chosenCase}
                refetchAdvices={refetchAdvices}
              />
            </Stack>
          </GridColumn>
          <GridColumn span={'3/12'}>
            <Stack space={3}>
              <CaseStatusBox
                status={statusName}
                advicePublishTypeId={advicePublishTypeId}
              />
              {isStakeholdersBoxVisible && (
                <BlowoutList
                  list={stakeholders}
                  isStakeholder
                  isEmpty={!isStakeholdersNotEmpty}
                />
              )}
              {isRelatedCasesNotEmpty && <BlowoutList list={relatedCases} />}
              <Coordinator
                contactEmail={contactEmail}
                contactName={contactName}
              />
            </Stack>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </CaseSkeleton>
  )
}

export default CaseDesktop
