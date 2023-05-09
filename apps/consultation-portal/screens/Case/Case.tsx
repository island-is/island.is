import {
  Box,
  Breadcrumbs,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { CaseOverview, CaseTimeline, WriteReviewCard } from '../../components'
import Layout from '../../components/Layout/Layout'
import { SimpleCardSkeleton } from '../../components/Card'
import StackedTitleAndDescription from '../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import { useFetchAdvicesById, useIsMobile } from '../../utils/helpers'
import { useContext } from 'react'
import { UserContext } from '../../context'
import Advices from '../../components/Advices/Advices'
import { Case } from '../../types/interfaces'
import CaseEmailBox from '../../components/CaseEmailBox/CaseEmailBox'
import env from '../../lib/environment'
import StakeholdersCard from './components/Stakeholders'
import { AdviceCTACard } from './components/AdviceCTA'

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
      <Hidden above={'md'}>
        <Box paddingBottom={3}>
          <Divider />
        </Box>
      </Hidden>
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
              <SimpleCardSkeleton>
                <StackedTitleAndDescription
                  headingColor="blue400"
                  title="Skjöl til samráðs"
                >
                  {chosenCase.documents.length > 0 ? (
                    chosenCase.documents.map((doc, index) => {
                      return (
                        <LinkV2
                          href={`${env.backendDownloadUrl}${doc.id}`}
                          color="blue400"
                          underline="normal"
                          underlineVisibility="always"
                          newTab
                          key={index}
                        >
                          {doc.fileName}
                        </LinkV2>
                      )
                    })
                  ) : (
                    <Text>Engin skjöl fundust.</Text>
                  )}
                </StackedTitleAndDescription>
              </SimpleCardSkeleton>
              <CaseEmailBox
                caseId={caseId}
                caseNumber={chosenCase?.caseNumber}
              />
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
                  {chosenCase.statusName === 'Til umsagnar' && (
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

              <SimpleCardSkeleton>
                <StackedTitleAndDescription
                  headingColor="blue400"
                  title="Umsjónaraðili"
                >
                  {contactName || contactEmail ? (
                    <>
                      {contactName && <Text>{contactName}</Text>}
                      {contactEmail && <Text>{contactEmail}</Text>}
                    </>
                  ) : (
                    <Text>Engin skráður umsjónaraðili.</Text>
                  )}
                </StackedTitleAndDescription>
              </SimpleCardSkeleton>
            </Stack>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default CaseScreen
