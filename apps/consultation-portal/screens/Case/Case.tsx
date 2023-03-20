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

const CaseScreen = ({ chosenCase, advices, isLoggedIn }) => {
  // Remove following lines after connecting to API
  const { contactEmail, contactName } = chosenCase
  const card = {
    caseNumber: '76/2022',
    nameOfReviewer: 'Jon Jonsson',
    reviewPeriod: '01.08.2022 – 01.12.2022',
  }

  isLoggedIn = true // remove when functionality for logged in has been implemented

  return (
    <Layout
      seo={{
        title: `Mál: ${chosenCase?.caseNumber}`,
        url: `mal/${chosenCase?.caseNumber}`,
      }}
    >
      <GridContainer>
        <Box paddingY={[3, 3, 3, 5, 5]}>
          <Breadcrumbs
            items={[
              { title: 'Öll mál', href: '/' },
              { title: `Mál nr. ${chosenCase?.caseNumber}` },
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
                updatedDate={chosenCase.changed}
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
                  <WriteReviewCard card={card} isLoggedIn={isLoggedIn} />
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
                  {chosenCase.shortDescription}
                </StackedTitleAndDescription>
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
