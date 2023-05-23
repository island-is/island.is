import {
  Box,
  Breadcrumbs,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  CaseOverview,
  CaseTimeline,
  Coordinator,
  Stakeholders,
  AdviceCTA,
  CaseDocuments,
  CaseEmailBox,
  AdviceForm,
  AdviceList,
  AdviceSkeletonLoader,
} from './components'
import Layout from '../../components/Layout/Layout'
import { useFetchAdvicesById, useIsMobile } from '../../hooks'
import { Case } from '../../types/interfaces'
import { CaseStatusFilterOptions } from '../../types/enums'
import { useContext } from 'react'
import UserContext from '../../context/UserContext'

interface Props {
  chosenCase: Case
  caseId: number
}

const CaseScreen = ({ chosenCase, caseId }: Props) => {
  const { contactEmail, contactName } = chosenCase
  const { isMobile } = useIsMobile()
  const { isAuthenticated, user } = useContext(UserContext)

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
              {chosenCase?.documents?.length > 0 && (
                <CaseDocuments
                  title="Skjöl til samráðs"
                  documents={chosenCase?.documents}
                />
              )}
              {chosenCase?.additionalDocuments?.length > 0 && (
                <CaseDocuments
                  title="Fylgiskjöl"
                  documents={chosenCase?.additionalDocuments}
                />
              )}
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
              <Stack space={3}>
                <Text variant="h1" color="blue400">
                  {`Innsendar umsagnir (${
                    chosenCase.adviceCount ? chosenCase.adviceCount : 0
                  })`}
                </Text>
                {advicesLoading ? (
                  <AdviceSkeletonLoader />
                ) : (
                  <AdviceList advices={advices} chosenCase={chosenCase} />
                )}
                {chosenCase?.statusName ===
                  CaseStatusFilterOptions.forReview && (
                  <AdviceForm
                    card={chosenCase}
                    isLoggedIn={isAuthenticated}
                    username={user?.name}
                    caseId={chosenCase?.id}
                    refetchAdvices={refetchAdvices}
                  />
                )}
              </Stack>
            </Stack>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '3/12', '3/12']}
            order={[2, 2, 2, 3, 3]}
          >
            <Stack space={3}>
              {!isMobile && <AdviceCTA chosenCase={chosenCase} />}
              {chosenCase?.stakeholders?.length > 0 && (
                <Stakeholders chosenCase={chosenCase} />
              )}
              <Coordinator
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
