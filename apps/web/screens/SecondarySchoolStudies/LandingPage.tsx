import { useState } from 'react'
import { useWindowSize } from 'react-use'

import { Box, GridColumn, GridContainer, GridRow,Stack,Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { HeadWithSocialSharing, Webreader } from '@island.is/web/components'
import { CustomPageUniqueIdentifier, GetNamespaceQuery, GetNamespaceQueryVariables } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks/useNamespace'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { withCustomPageWrapper } from '../CustomPage/CustomPageWrapper'
import { GET_NAMESPACE_QUERY } from '../queries/Namespace'
import * as styles from './SecondarySchoolStudies.css'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SecondarySchoolStudiesLandingPageProps {
  studies: any[]
  namespace: Record<string, string>
}

const SecondarySchoolStudiesLandingPage: Screen<
  SecondarySchoolStudiesLandingPageProps
> = ({studies, namespace}) => {
  const n = useNamespace(namespace)
  const [isMounted, setIsMounted] = useState(false)
  // const n = useNamespace(namespace)
  const { width } = useWindowSize()

  const isTablet = isMounted && width <= theme.breakpoints.lg

  return <Box paddingTop={8} paddingBottom={6}>
      <HeadWithSocialSharing title={''}
        // title={ogTitle}
        // description={n(
        //   'ogDescription',
        //   'Á Starfatorginu er að finna upplýsingar um laus störf hjá ríkinu.',
        // )}
        // imageUrl={n(
        //   'ogImageUrl',
        //   'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
        // )}
      />
      
      {/* Header */}
      <GridContainer>
        <Box>
          <GridRow marginBottom={5}>
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
              {/* <Breadcrumbs
                items={[
                  { title: 'Ísland.is', href: '/' },
                  SHOW_CURRENT_BREADCRUMB
                    ? {
                        title: n('breadcrumbTitle', 'Starfatorg'),
                        href: linkResolver('vacancies').href,
                      }
                    : undefined,
                ].filter(isDefined)}
              /> */}
              <Box className="rs_read" marginTop={2}>
                <Text variant="h1" as="h1">
                  {'Titill'}
                </Text>
              </Box>
              <Webreader
                marginBottom={[0, 0, 0, 4]}
                readId={undefined}
                readClass="rs_read"
              />
            </GridColumn>
            {!isTablet && (
              <GridColumn span="1/2">
                <Box display="flex" justifyContent="center" width="full">
                  <img
                    src={n(
                      'starfatorgIcon',
                      'https://images.ctfassets.net/8k0h54kbe6bj/1SY4juL47FNJT7kBNIsdqv/5e51b2319665a832549e6d0813dcd984/LE_-_Jobs_-_S3__1_.svg',
                    )}
                    alt=""
                  />
                </Box>
              </GridColumn>
            )}
          </GridRow>

        </Box>
      </GridContainer>
     {/* Header ends */} 

     {/* Main */} 
      <Box>
        {!isTablet && (
          <GridContainer>
            <Box
              display="flex"
              flexDirection="row"
              height="full"
              paddingY={6}
              position="relative"
            >
              {/* Sidebar */}
              <Box
                printHidden
                display={['none', 'none', 'block']}
                position="sticky"
                alignSelf="flexStart"
                className={styles.sidebar}
                style={{ top: 72 }}
              >
                <Stack space={3}>
                  <></>
                </Stack>
              </Box>

              {/* Content */}
              <Box
                flexGrow={1}
                paddingLeft={2}
                className={styles.contentWrapper}
              >
              </Box>
            </Box>
          </GridContainer>
        )}
          {/* Tablet content, no sidebar ? */}
        {isTablet && (
          <Box marginX={3} paddingTop={3}>
          </Box>
        )}
      </Box>
     {/* Main ends */} 
    </Box>
}
SecondarySchoolStudiesLandingPage.getProps = async ({
  apolloClient,
  locale,
}) => {
    const namespaceResponse = await apolloClient.query<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >({
    query: GET_NAMESPACE_QUERY,
    variables: {
      input: {
        lang: locale,
        namespace: 'Framhaldsskolanam',
      },
    },
  })

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>
  const studies: any[] = []

  return {
    studies,
    namespace

  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.SecondarySchoolStudies,
    SecondarySchoolStudiesLandingPage,
  ),
  {
    footerVersion: 'organization',
  },
)
