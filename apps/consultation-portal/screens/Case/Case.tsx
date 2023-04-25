import {
  Box,
  Breadcrumbs,
  Bullet,
  BulletList,
  Button,
  Divider,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  Inline,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import SubscriptionBox from '../../components/SubscriptionBox/SubscriptionBox'
import { CaseOverview, CaseTimeline, WriteReviewCard } from '../../components'
import Layout from '../../components/Layout/Layout'
import { SimpleCardSkeleton } from '../../components/Card'
import StackedTitleAndDescription from '../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import { getTimeLineDate } from '../../utils/helpers/dateFormatter'
import Link from 'next/link'
import { useFetchAdvicesById, useLogIn } from '../../utils/helpers'
import { useContext, useState } from 'react'
import { UserContext } from '../../context'
import Advices from '../../components/Advices/Advices'
import { Case } from '../../types/interfaces'

interface Props {
  chosenCase: Case
  caseId: number
}

const CaseScreen = ({ chosenCase, caseId }: Props) => {
  const { contactEmail, contactName } = chosenCase
  const { isAuthenticated, user } = useContext(UserContext)
  const [showStakeholders, setShowStakeholders] = useState(false)
  const LogIn = useLogIn()

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
                  <Advices advices={advices} advicesLoading={advicesLoading} />
                  <WriteReviewCard
                    card={chosenCase}
                    isLoggedIn={isAuthenticated}
                    username={user?.name}
                    caseId={chosenCase.id}
                    refetchAdvices={refetchAdvices}
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
                  {chosenCase.documents.length > 0 ? (
                    chosenCase.documents.map((doc, index) => {
                      return (
                        <LinkV2
                          href={`https://samradapi-test.devland.is/api/Documents/${doc.id}`}
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
              <SimpleCardSkeleton>
                <StackedTitleAndDescription
                  headingColor="blue400"
                  title="Viltu senda umsögn?"
                >
                  <Text>
                    Öllum er frjálst að taka þátt í samráðinu.
                    {!isAuthenticated && ' Skráðu þig inn og sendu umsögn.'}
                  </Text>
                </StackedTitleAndDescription>
                <Box paddingTop={2}>
                  {isAuthenticated ? (
                    <Link href="#write-review" shallow>
                      <Button fluid iconType="outline" nowrap as="a">
                        Senda umsögn
                      </Button>
                    </Link>
                  ) : (
                    <Button fluid iconType="outline" nowrap onClick={LogIn}>
                      Skrá mig inn
                    </Button>
                  )}
                </Box>
              </SimpleCardSkeleton>
              <SimpleCardSkeleton>
                <StackedTitleAndDescription
                  headingColor="blue400"
                  title="Aðilar sem hafa fengið boð um samráð á máli."
                >
                  {chosenCase?.stakeholders.length < 1 ? (
                    <Text>Engir aðilar hafa fengið boð.</Text>
                  ) : (
                    <Inline justifyContent="spaceBetween" alignY="center">
                      <Text>
                        Samtals: {chosenCase?.stakeholders?.length}{' '}
                        {chosenCase?.stakeholders?.length === 1
                          ? 'aðili'
                          : 'aðilar'}
                      </Text>
                      <FocusableBox
                        component="button"
                        onClick={() => setShowStakeholders(!showStakeholders)}
                      >
                        <Icon
                          icon={showStakeholders ? 'close' : 'open'}
                          type="outline"
                          size="small"
                          color="blue400"
                        />
                      </FocusableBox>
                    </Inline>
                  )}
                  {showStakeholders && (
                    <Box padding="smallGutter">
                      <BulletList type="ul">
                        {chosenCase?.stakeholders.map((stakeholder, index) => {
                          return <Bullet key={index}>{stakeholder.name}</Bullet>
                        })}
                      </BulletList>
                    </Box>
                  )}
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
