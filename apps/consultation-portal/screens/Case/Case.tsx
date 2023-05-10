import {
  Box,
  Breadcrumbs,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { CaseOverview, CaseTimeline, WriteReviewCard } from '../../components'
import Layout from '../../components/Layout/Layout'
import { useFetchAdvicesById, useIsMobile } from '../../utils/helpers'
import { useContext } from 'react'
import { UserContext } from '../../context'
import Advices from '../../components/Advices/Advices'
import { Case } from '../../types/interfaces'
import CaseEmailBox from '../../components/CaseEmailBox/CaseEmailBox'
import StakeholdersCard from './components/Stakeholders'
import { AdviceCTACard } from './components/AdviceCTA'
import { CaseStatusFilterOptions } from '../../types/enums'
import { RenderDocumentsBox } from './components/RenderDocumentsBox'
import { CoOrdinator } from './components/CoOrdinator'

interface Props {
  chosenCase: Case
  caseId: number
}

const CaseScreen = ({ chosenCase, caseId }: Props) => {
  const { contactEmail, contactName } = chosenCase
  const { isAuthenticated, user } = useContext(UserContext)
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
              <Box>
                <Stack space={3}>
                  {advices.length !== 0 && (
                    <>
                      <Text variant="h1" color="blue400">
                        Innsendar umsagnir ({chosenCase.adviceCount})
                      </Text>

                      <Advices
                        advices={advices}
                        advicesLoading={advicesLoading}
                      />
                    </>
                  )}
                  {chosenCase.statusName ===
                    CaseStatusFilterOptions.forReview && (
                    <WriteReviewCard
                      card={chosenCase}
                      isLoggedIn={isAuthenticated}
                      username={user?.name}
                      caseId={chosenCase.id}
                      refetchAdvices={refetchAdvices}
                    />
                  )}
                </Stack>
              </Box>
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
