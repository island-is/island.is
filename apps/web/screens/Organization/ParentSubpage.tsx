import { useRouter } from 'next/router'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import { Query } from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'

import {
  getProps,
  StandaloneParentSubpageProps,
} from './Standalone/ParentSubpage'
import {
  getSubpageNavList,
  SubPageBottomSlices,
  SubPageContent,
} from './SubPage'
import * as styles from './ParentSubpage.css'

type OrganizationParentSubpageScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

export type OrganizationParentSubpageProps = StandaloneParentSubpageProps

const OrganizationParentSubpage: Screen<
  OrganizationParentSubpageProps,
  OrganizationParentSubpageScreenContext
> = ({
  organizationPage,
  parentSubpage,
  selectedHeadingId,
  subpage,
  tableOfContentHeadings,
  namespace,
}) => {
  const router = useRouter()
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  useLocalLinkTypeResolver()
  useContentfulId(organizationPage.id, parentSubpage.id, subpage.id)

  const showTableOfContents = parentSubpage.childLinks.length > 1

  let pageTitle = subpage?.title ?? ''
  if (showTableOfContents) {
    pageTitle = `${parentSubpage?.title ?? ''}${
      Boolean(parentSubpage?.title) && Boolean(subpage?.title) ? ' - ' : ''
    }${subpage?.title ?? ''}`
  }

  return (
    <OrganizationWrapper
      showExternalLinks={true}
      showReadSpeaker={false}
      pageTitle={pageTitle}
      organizationPage={organizationPage}
      fullWidthContent={true}
      pageFeaturedImage={
        subpage?.featuredImage ?? organizationPage?.featuredImage
      }
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage?.title ?? '',
          href: linkResolver('organizationpage', [organizationPage?.slug]).href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: getSubpageNavList(
          organizationPage,
          router,
          activeLocale === 'is' ? 3 : 4,
        ),
      }}
      mainContent={
        <Box paddingTop={4}>
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['9/9', '9/9', '7/9']}
                offset={['0', '0', '1/9']}
              >
                <Stack space={3}>
                  {showTableOfContents && (
                    <Stack space={4}>
                      <Text variant="h1" as="h1">
                        {parentSubpage.title}
                      </Text>
                      <Box
                        paddingX={4}
                        paddingY={2}
                        borderLeftWidth="standard"
                        borderColor="blue200"
                      >
                        <Stack space={1}>
                          <Text variant="h5" as="h2">
                            {namespace?.['OrganizationTableOfContentsTitle'] ??
                            activeLocale === 'is'
                              ? 'Efnisyfirlit'
                              : 'Table of contents'}
                          </Text>
                          <Stack space={1}>
                            {tableOfContentHeadings.map(
                              ({ headingTitle, headingId, href }) => (
                                <Box
                                  key={headingId}
                                  className={styles.fitContentWidth}
                                >
                                  <LinkV2 href={href}>
                                    <Text
                                      fontWeight={
                                        headingId === selectedHeadingId
                                          ? 'semiBold'
                                          : 'regular'
                                      }
                                      variant="small"
                                      color={
                                        selectedHeadingId &&
                                        headingId === selectedHeadingId
                                          ? 'blue400'
                                          : 'blue600'
                                      }
                                    >
                                      {headingTitle}
                                    </Text>
                                  </LinkV2>
                                </Box>
                              ),
                            )}
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                  )}
                </Stack>
              </GridColumn>
            </GridRow>
          </GridContainer>
          <SubPageContent
            namespace={namespace}
            organizationPage={organizationPage}
            subpage={subpage}
            subpageTitleVariant={
              parentSubpage.childLinks.length > 1 ? 'h2' : 'h1'
            }
            paddingTop={showTableOfContents ? 4 : 0}
          />
        </Box>
      }
    >
      <SubPageBottomSlices
        namespace={namespace}
        organizationPage={organizationPage}
        subpage={subpage}
      />
    </OrganizationWrapper>
  )
}

OrganizationParentSubpage.getProps = async (context) => {
  const props = await getProps(context)
  return {
    ...props,
    ...getThemeConfig(
      props.organizationPage.theme,
      props.organizationPage.organization,
    ),
  }
}

export default withMainLayout(OrganizationParentSubpage)
