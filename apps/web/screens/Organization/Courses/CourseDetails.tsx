import { useRouter } from 'next/router'

import {
  Box,
  type NavigationItem,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { formatCurrency } from '@island.is/shared/utils'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import type {
  Course,
  OrganizationPage,
  Query,
  QueryGetCourseByIdArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { GET_COURSE_BY_ID_QUERY } from '../../queries/Courses'

type CourseDetailsScreenContext = ScreenContext & {
  organizationPage: Query['getOrganizationPage']
}

export interface CourseDetailsProps {
  course: Course
  organizationPage: OrganizationPage
  namespace: Record<string, string>
}

const CourseDetails: Screen<CourseDetailsProps, CourseDetailsScreenContext> = ({
  course,
  organizationPage,
  namespace,
}) => {
  const router = useRouter()
  const pathWithoutQueryParams = router.asPath.split('?')[0]
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()
  const { format } = useDateUtils()

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text ?? '',
      href: primaryLink?.url ?? '',
      active:
        primaryLink?.url === pathWithoutQueryParams ||
        childrenLinks.some((link) => link.url === pathWithoutQueryParams),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === pathWithoutQueryParams,
      })),
    }),
  )

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      pageTitle={course.title}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      showReadSpeaker={false}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage?.title,
          href: linkResolver('organizationpage', [organizationPage?.slug]).href,
        },
        {
          title: n(
            'courseListPageTitle',
            activeLocale === 'is' ? 'Námskeið' : 'Courses',
          ),
          href: linkResolver('organizationcourseoverview', [
            organizationPage.slug,
          ]).href,
        },
      ]}
    >
      <Stack space={3}>
        <Text variant="h1" as="h1">
          {course.title}
        </Text>
        <Box>{webRichText(course.description)}</Box>
        {course.instances.length > 0 && (
          <Stack space={3}>
            <Text variant="h2" as="h2">
              {n(
                'courseInstancesLabel',
                activeLocale === 'is' ? 'Dagsetningar' : 'Dates',
              )}
            </Text>
            <Stack space={3}>
              {course.instances.map((instance) => (
                <Box
                  key={instance.id}
                  padding={2}
                  border="standard"
                  borderRadius="large"
                >
                  <Stack space={3}>
                    <Stack space={2}>
                      <Text variant="h3" as="h3">
                        {format(new Date(instance.startDate), 'do MMMM yyyy')}
                      </Text>
                      <Text>{instance.description}</Text>
                    </Stack>
                    {Boolean(instance.price?.amount) && (
                      <Text>{formatCurrency(instance.price?.amount ?? 0)}</Text>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </OrganizationWrapper>
  )
}

CourseDetails.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  const querySlugs = (query.slugs ?? []) as string[]
  const [organizationPageSlug, _, courseId] = querySlugs

  if (!courseId) {
    throw new CustomNextError(404, 'Course ID is required')
  }

  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
    {
      data: { getCourseById },
    },
  ] = await Promise.all([
    !organizationPage
      ? apolloClient.query<Query, QueryGetOrganizationPageArgs>({
          query: GET_ORGANIZATION_PAGE_QUERY,
          variables: {
            input: {
              slug: organizationPageSlug,
              lang: locale,
              subpageSlugs: querySlugs.slice(1),
            },
          },
        })
      : {
          data: { getOrganizationPage: organizationPage },
        },
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
    apolloClient.query<Query, QueryGetCourseByIdArgs>({
      query: GET_COURSE_BY_ID_QUERY,
      variables: {
        input: {
          id: courseId,
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }
  if (!getCourseById) {
    throw new CustomNextError(404, 'Course not found')
  }

  if (getCourseById.organizationId !== getOrganizationPage?.organization?.id) {
    throw new CustomNextError(404, 'Course belongs to another organization')
  }

  return {
    organizationPage: getOrganizationPage,
    course: getCourseById,
    namespace,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(CourseDetails)
