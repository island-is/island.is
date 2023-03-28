import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import SubscriptionBox from '../../components/SubscriptionBox/SubscriptionBox'
import {
  CaseOverview,
  CaseTimeline,
  ReviewCard,
  WriteReviewCard,
} from '../../components'
import Layout from '../../components/Layout/Layout'
import { Advice } from '../../types/viewModels'
import { SimpleCardSkeleton } from '../../components/Card'
import StackedTitleAndDescription from '../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import { getTimeLineDate } from '../../utils/helpers/dateFormatter'
import Link from 'next/link'
import { useUser } from '../../context/UserContext'

const CaseScreen = ({ chosenCase, advices }) => {
  const { contactEmail, contactName } = chosenCase
  const { isAuthenticated, user } = useUser()

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
              { title: 'Öll mál', href: '/' },
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
            <Stack space={2}>
              <Divider />
              <CaseTimeline
                status={chosenCase.statusName}
                updatedDate={getTimeLineDate(chosenCase)}
              />
              <Divider />
              <Box paddingLeft={1}>
                <Text variant="h3" color="purple400">
                  {`Fjöldi umsagna: ${chosenCase.adviceCount}`}
                </Text>
              </Box>
              <Divider />
              <Box paddingTop={1}>
                <SubscriptionBox />
              </Box>
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
                  <Text variant="h1" color="blue400">
                    Innsendar umsagnir
                  </Text>
                  {advices?.map((advice: Advice) => {
                    return <ReviewCard advice={advice} key={advice.number} />
                  })}
                  <WriteReviewCard
                    card={chosenCase}
                    isLoggedIn={isAuthenticated}
                    username={user?.name}
                    caseId={chosenCase.id}
                  />
                </Stack>
              </Box>
            </Stack>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '3/12', '3/12']}
            order={[2, 2, 2, 3, 3]}
          >
            <Stack space={3}>
              <SimpleCardSkeleton>
                <StackedTitleAndDescription
                  headingColor="blue400"
                  title="Skjöl til samráðs"
                >
                  {chosenCase.documents
                    ? chosenCase.documents.map((doc, index) => {
                        return (
                          <LinkV2
                            href={`https://samradapi-test.island.is/api/Documents/${doc.id}`}
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
                    : 'Engin skjöl'}
                </StackedTitleAndDescription>
              </SimpleCardSkeleton>
              <SimpleCardSkeleton>
                <StackedTitleAndDescription
                  headingColor="blue400"
                  title="Viltu senda umsögn?"
                >
                  Öllum er frjálst að taka þátt í samráðinu. Skráðu þig inn og
                  sendu umsögn.
                </StackedTitleAndDescription>
                <Box paddingTop={2}>
                  <Link href="#write-review" shallow>
                    <Button fluid iconType="outline" nowrap as="a">
                      Senda umsögn
                    </Button>
                  </Link>
                </Box>
              </SimpleCardSkeleton>
              <SimpleCardSkeleton>
                <StackedTitleAndDescription
                  headingColor="blue400"
                  title="Aðilar sem hafa fengið boð um samráð á máli."
                >
                  Viltu senda umsögn? Öllum er frjálst að taka þátt í samráðinu.
                  Skráðu þig inn og sendu umsögn.
                </StackedTitleAndDescription>
              </SimpleCardSkeleton>

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
                    'Engin skráður'
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
