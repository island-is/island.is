import {
  Box,
  Breadcrumbs,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
} from '@island.is/island-ui/core'
import { CaseOverview, CaseTimeline } from '../../components'
import Layout from '../../components/Layout/Layout'
import { useFetchAdvicesById, useIsMobile } from '../../utils/helpers'
import { Case } from '../../types/interfaces'
import CaseEmailBox from '../../components/CaseEmailBox/CaseEmailBox'
import StakeholdersCard from './components/Stakeholders'
import { AdviceCTACard } from './components/AdviceCTA'
import { CaseStatusFilterOptions } from '../../types/enums'
import { RenderDocumentsBox } from './components/RenderDocumentsBox'
import { CoOrdinator } from './components/CoOrdinator'
import { RenderAdvices } from './components/RenderAdvices'

interface Props {
  chosenCase: Case
  caseId: number
}

const CaseScreen = ({ chosenCase, caseId }: Props) => {
  const { contactEmail, contactName } = chosenCase
  const { isMobile } = useIsMobile()

  const { advices, advicesLoading, refetchAdvices } = useFetchAdvicesById({
    caseId: caseId,
  })

  return (
    <Layout
      seo={{
        title: `Mál: S-${chosenCase?.caseNumber}`,
        url: `mal/${chosenCase?.id}`,
      }}
    >
      <GridContainer>
        <Box paddingY={[3, 3, 3, 5, 5]}>
          <Breadcrumbs
            items={[
              { title: 'Öll mál', href: '/samradsgatt' },
              { title: `Mál nr. S-${chosenCase?.caseNumber}` },
            ]}
          />
        </Box>
      </GridContainer>
      {isMobile && (
        <Box paddingBottom={3}>
          <Divider />
        </Box>
      )}
      <GridContainer>
        <GridRow rowGap={3}>
          <GridColumn
            span={['12/12', '12/12', '12/12', '3/12', '3/12']}
            order={[3, 3, 3, 1, 1]}
          >
            <Stack space={3}>
              <Divider />
              <CaseTimeline chosenCase={chosenCase} />
              <Divider />
              <RenderDocumentsBox
                title="Skjöl til samráðs"
                documents={chosenCase?.documents}
              />
              <RenderDocumentsBox
                title="Fylgiskjöl"
                documents={chosenCase?.additionalDocuments}
              />
              {chosenCase?.statusName !==
                CaseStatusFilterOptions.resultsPublished && (
                <CaseEmailBox
                  caseId={caseId}
                  caseNumber={chosenCase?.caseNumber}
                />
              )}
            </Stack>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '6/12', '6/12']}
            order={[1, 1, 1, 2, 2]}
          >
            <Stack space={[3, 3, 3, 9, 9]}>
              <CaseOverview chosenCase={chosenCase} />
              <RenderAdvices
                advices={advices}
                chosenCase={chosenCase}
                refetchAdvices={refetchAdvices}
                advicesLoading={advicesLoading}
              />
            </Stack>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '3/12', '3/12']}
            order={[2, 2, 2, 3, 3]}
          >
            <Stack space={3}>
              {!isMobile && <AdviceCTACard chosenCase={chosenCase} />}
              <StakeholdersCard chosenCase={chosenCase} />
              <CoOrdinator
                contactEmail={contactEmail}
                contactName={contactName}
              />
            </Stack>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default CaseScreen
