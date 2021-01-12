import React from 'react'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  Breadcrumbs,
  Stack,
  Text,
  Box,
  Navigation,
  GridColumn,
  GridRow,
  Button,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { SidebarLayout } from '../Layouts/SidebarLayout'
import { Document } from '@contentful/rich-text-types'
import { renderHtml } from '@island.is/island-ui/contentful'
import { GET_GENERIC_OVERVIEW_PAGE_QUERY } from '@island.is/web/screens/queries'
import {
  GetGenericOverviewPageQuery,
  QueryGetGenericOverviewPageArgs,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '../../hooks/useLinkResolver'
import NextLink from 'next/link'
import { Image } from '@island.is/island-ui/contentful'

interface GenericOverviewProps {
  genericOverviewPage: GetGenericOverviewPageQuery['getGenericOverviewPage']
}

export const GenericOverview: Screen<GenericOverviewProps> = ({
  genericOverviewPage,
}) => {
  const { linkResolver } = useLinkResolver()

 // console.log(overviewLinks)
console.log(genericOverviewPage)
  const introLink = (
    leftImage: boolean,
    imageUrl: string,
    title: string,
    text: string,
    link: string,
  ) => {
    return (
      <GridRow direction={leftImage ? 'row' : 'rowReverse'}>
        <GridColumn span={['8/8', '3/8', '2/8', '3/8']}>
          <Box
            paddingLeft={leftImage ? undefined : [0, 0, 0, 0, 6]}
            paddingRight={leftImage ? [30, 0, 0, 0, 6] : [30, 0, 0, 0, 0]}
            width="full"
            position="relative"
          >
            <Image
              url={imageUrl}
              title="smu"
              thumbnail={imageUrl}
              width={150}
              height={150}
            />
          </Box>
        </GridColumn>
        <GridColumn span={['8/8', '5/8', '6/8', '5/8']}>
          <Box display="flex" flexDirection="column" flexGrow={1} height="full">
            <Text variant="h2">{title}</Text>
            <Text paddingTop={2}>{text}</Text>
            <Box marginTop="auto">
              <NextLink href={'/'}>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  type="button"
                  variant="text"
                >
                  {link}
                </Button>
              </NextLink>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
    )
  }
  return (
    <SidebarLayout
      fullWidthContent={true}
      sidebarContent={
        <Navigation
          baseId="desktopNav"
          items={[
            ...genericOverviewPage.navigation.menuLinks.map((item) => ({
              title: item.title,
              typename: item.link.type,
              slug: [],
            })),
          ]}
          title={genericOverviewPage.navigation.title}
          renderLink={(link, { typename }) => {
            return (
              <NextLink {...linkResolver(typename as LinkType)} passHref>
                {link}
              </NextLink>
            )
          }}
        />
      }
    >
      <GridRow>
        <GridColumn
          offset={[null, null, null, null, '1/9']}
          span={['12/12', '12/12', '12/12', '12/12', '7/9']}
        >
          <Stack space={2}>
            <Breadcrumbs
              items={[
                {
                  title: 'Ísland.is',
                  href: '/',
                },
                {
                  title: genericOverviewPage.navigation.title,
                },
              ]}
              renderLink={(link) => {
                return (
                  <NextLink {...linkResolver('homepage')} passHref>
                    {link}
                  </NextLink>
                )
              }}
            />
            <Box display={['block', 'block', 'none']}>
              <Navigation
                baseId={'mobileNav'}
                isMenuDialog
                activeItemTitle={genericOverviewPage.navigation.title}
                title={genericOverviewPage.navigation.title}
                items={[
                  ...genericOverviewPage.navigation.menuLinks.map((item) => ({
                    title: item.title,
                    typename: item.link.type,
                    slug: [],
                  })),
                ]}
                renderLink={(link, { typename }) => {
                  return (
                    <NextLink {...linkResolver(typename as LinkType)} passHref>
                      {link}
                    </NextLink>
                  )
                }}
              />
            </Box>

            <Text variant="h1" as="h1">
              {genericOverviewPage.title}
            </Text>

            {Boolean(genericOverviewPage.intro) && (
              <Box marginBottom={10}>
                {renderHtml(genericOverviewPage.intro.document as Document)}
              </Box>
            )}
          </Stack>
          <Stack space={12}>
            {introLink(
              true,
              'https://images.ctfassets.net/8k0h54kbe6bj/UCq23qJNBTd9MFZEaoLIM/a756c96f12e6a4beb48323cbc095eb9c/T__lvuskj__r__epli_og_penni.svg?w=600',
              'Vefþjónustur',
              'Í Viskuausunni getur þú skoðað og leitað í fjölda vefþjónusta og gagnaskilgreininga hjá hinu opinbera.',
              'Skoða Viskuausuna',
            )}
            {introLink(
              false,
              'https://images.ctfassets.net/8k0h54kbe6bj/6nX6tp86HqnWgXEbV2IeZZ/b50a5260044c00529e3e0e5f19737301/T__lvuskj__r_og_kaffibolli.svg?w=600',
              'Ísland UI',
              'Fyrir forvitna forritara og þá sem vilja taka þátt í að þróa vörur fyrir Stafrænt Ísland.',
              'Skoða Ísland UI',
            )}
            {introLink(
              true,
              'https://images.ctfassets.net/8k0h54kbe6bj/1q0ebpAuKjbNwRIVMcsBPE/b6077fffac39fd7920b15fafbab9ad1c/Laufbl____.svg?w=600',
              'Hönnunarkerfi',
              'Hönnunarkerfi Ísland.is auðveldar okkur að setja nýja þjónustu í loftið á stuttum tíma, og einfaldar rekstur og viðhald stafrænnar þjónustu hins opinbera til muna. Kerfið er opið öllum sem vilja skoða.',
              'Nánar um Hönnunarkerfið',
            )}
            {introLink(
              false,
              'https://images.ctfassets.net/8k0h54kbe6bj/73hf7fNRsfx4eOKuBIu9KF/6f89b513d23480c184e77077f162f625/Spjald_og_penni.svg?w=600',
              'Efnisstefna',
              'Textinn er uppistaðan í stafrænni þjónustu hins opinbera og hér eru leiðbeiningar um það hvernig við skrifum fyrir þjónustu Ísland.is',
              'Lesa Efnisstefnuna',
            )}
          </Stack>
        </GridColumn>
      </GridRow>
    </SidebarLayout>
  )
}

GenericOverview.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getGenericOverviewPage: genericOverviewPage },
    },
  ] = await Promise.all([
    apolloClient.query<
      GetGenericOverviewPageQuery,
      QueryGetGenericOverviewPageArgs
    >({
      query: GET_GENERIC_OVERVIEW_PAGE_QUERY,
      fetchPolicy: 'no-cache',
      variables: {
        input: { lang: locale, pageIdentifier: 'throun' },
      },
    }),
  ])

  if (!genericOverviewPage) {
    throw new CustomNextError(404, 'Page not found')
  }

  return { genericOverviewPage }
}

export default withMainLayout(GenericOverview)
