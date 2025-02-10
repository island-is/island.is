import { useRouter } from 'next/router'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import { Query } from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'

import {
  getProps,
  StandaloneParentSubpageProps,
} from './Standalone/ParentSubpage'
import { getSubpageNavList, SubPageContent } from './SubPage'

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
  useContentfulId(organizationPage.id, parentSubpage.id, subpage.id)

  return (
    <OrganizationWrapper
      showExternalLinks={true}
      showReadSpeaker={false}
      pageTitle={subpage?.title ?? ''}
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
        items: getSubpageNavList(organizationPage, router, 3),
      }}
    >
      <Box paddingTop={4}>
        <GridContainer>
          <GridRow>
            <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
              <Stack space={3}>
                {parentSubpage.childLinks.length > 1 && (
                  <Stack space={4}>
                    <Text variant="h1" as="h1">
                      {parentSubpage.title}
                    </Text>
                    <TableOfContents
                      headings={tableOfContentHeadings}
                      onClick={(headingId) => {
                        const href = tableOfContentHeadings.find(
                          (heading) => heading.headingId === headingId,
                        )?.href
                        if (href) {
                          router.push(href)
                        }
                      }}
                      tableOfContentsTitle={
                        namespace?.['OrganizationTableOfContentsTitle'] ??
                        activeLocale === 'is'
                          ? 'Efnisyfirlit'
                          : 'Table of contents'
                      }
                      selectedHeadingId={selectedHeadingId}
                    />
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
        />
      </Box>
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
