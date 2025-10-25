import {
  GridContainer,
  Text,
  Stack,
  Box,
  LoadingDots,
  Tiles,
  DropdownMenu,
  FocusableBox,
  Divider,
} from '@island.is/island-ui/core'
import {
  Breadcrumbs,
  ActionCard,
  Card,
  EmptyState,
  Pagination,
  Layout,
  SearchAndSortPartial,
} from '../../components'
import { useLogIn, useUser, useAdviceFilters } from '../../hooks'
import { useState } from 'react'
import { AdviceFilter, UserAdvice } from '../../types/interfaces'
import env from '../../lib/environment'
import { CARDS_PER_PAGE, FILTERS_ADVICE_KEY } from '../../utils/consts/consts'
import localization from './Advices.json'

export const AdvicesScreen = () => {
  const LogIn = useLogIn()
  const { isAuthenticated, userLoading } = useUser()
  const [dropdownState, setDropdownState] = useState('')
  const loc = localization['advices']

  const handleDropdown = (id: string) => {
    setDropdownState((prev) => {
      return prev === id ? null : id
    })
  }

  const { advices, total, getAdvicesLoading, filters, setFilters } =
    useAdviceFilters({ isAuthenticated: isAuthenticated })

  const renderCards = () => {
    if (userLoading || getAdvicesLoading) {
      return (
        <Box
          display="flex"
          width="full"
          alignItems="center"
          justifyContent="center"
          style={{ height: 200 }}
        >
          <LoadingDots size="large" />
        </Box>
      )
    }
    if (!getAdvicesLoading && advices?.length === 0) {
      return <EmptyState />
    }
    return (
      <>
        {advices && (
          <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
            {advices.map((item: UserAdvice, index: number) => {
              const card = {
                id: item.caseId,
                title: item._case?.name,
                tag: item._case?.statusName,
                published: item.created,
                processEnds: item._case?.processEnds,
                processBegins: item._case?.processBegins,
                eyebrows: [item._case?.typeName, item._case?.institutionName],
                caseNumber: item._case?.caseNumber,
              }
              const dropdown =
                item.adviceDocuments?.length !== 0 ? (
                  <FocusableBox
                    onClick={() => handleDropdown(item.id)}
                    component="button"
                  >
                    <DropdownMenu
                      title={loc.card.dropdownMenuTitle}
                      icon={
                        dropdownState === item.id ? 'chevronUp' : 'chevronDown'
                      }
                      items={item.adviceDocuments?.map((item) => {
                        return {
                          title: item.fileName,
                          href: `${env.backendDownloadUrl}${item.id}`,
                        }
                      })}
                    />
                  </FocusableBox>
                ) : (
                  <></>
                )
              return (
                <Card
                  key={index}
                  card={card}
                  frontPage={false}
                  showAttachment
                  dropdown={dropdown}
                >
                  <Stack space={2}>
                    <Text variant="eyebrow" color="dark400">
                      {loc.card.eyebrowText}
                    </Text>
                    <Box
                      style={{
                        wordBreak: 'break-word',
                        height: '105px',
                      }}
                      overflow="hidden"
                    >
                      <Text variant="small" color="dark400">
                        {item.content}
                      </Text>
                    </Box>
                  </Stack>
                </Card>
              )
            })}
          </Tiles>
        )}
        <Pagination
          filters={filters}
          setFilters={(arr: AdviceFilter) => setFilters(arr)}
          totalPages={Math.ceil(total / CARDS_PER_PAGE)}
          localStorageId={FILTERS_ADVICE_KEY}
        />
      </>
    )
  }

  return (
    <Layout
      seo={{
        title: loc.seo.title,
        url: loc.seo.url,
        description: loc.seo.description,
      }}
    >
      <Divider />
      <Box background="blue100">
        <Breadcrumbs
          items={[
            { title: loc.breadcrumbs[0].title, href: loc.breadcrumbs[0].href },
            { title: loc.breadcrumbs[1].title },
          ]}
        />
        <GridContainer>
          <Box paddingBottom={[3, 3, 3, 5, 5]}>
            <Stack space={[3, 3, 3, 5, 5]}>
              <Stack space={3}>
                <Text as="h1" variant="h1" dataTestId="advices_title">
                  {loc.intro.title}
                </Text>
                <Text variant="default" dataTestId="advices_text">
                  {loc.intro.text}
                </Text>
              </Stack>
              {!userLoading && !isAuthenticated && (
                <ActionCard
                  heading={loc.subscriptionActionCard.heading}
                  text={loc.subscriptionActionCard.text}
                  button={[
                    {
                      label: loc.subscriptionActionCard.buttonLabel,
                      onClick: LogIn,
                    },
                  ]}
                />
              )}
            </Stack>
          </Box>
        </GridContainer>
      </Box>
      <Divider />
      {!userLoading && isAuthenticated && (
        <GridContainer>
          <Box paddingTop={[3, 3, 3, 5, 5]}>
            <Stack space={[3, 3, 3, 5, 5]}>
              <SearchAndSortPartial filters={filters} setFilters={setFilters} />
              {renderCards()}
            </Stack>
          </Box>
        </GridContainer>
      )}
    </Layout>
  )
}

export default AdvicesScreen
