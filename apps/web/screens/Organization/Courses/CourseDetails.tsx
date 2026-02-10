import { useRouter } from 'next/router'

import {
  Box,
  InfoCardGrid,
  Stack,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import type {
  Course,
  OrganizationPage,
  Query,
  QueryGetCourseByIdArgs,
  QueryGetCourseListPageByIdArgs,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { LayoutProps, withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { GET_NAMESPACE_QUERY } from '../../queries'
import {
  GET_COURSE_BY_ID_QUERY,
  GET_COURSE_LIST_PAGE_BY_ID_QUERY,
} from '../../queries/Courses'
import { getSubpageNavList } from '../SubPage'

type CourseDetailsScreenContext = ScreenContext & {
  organizationPage: OrganizationPage
  courseListPageId: string
  courseId: string
  languageToggleHrefOverride?: {
    is: string
    en: string
  }
}

export interface Props {
  layoutProps: LayoutProps
  componentProps: CourseDetailsProps
}

export interface CourseDetailsProps {
  course: Course
  organizationPage: OrganizationPage
  namespace: Record<string, string>
  courseListPage: Query['getCourseListPageById']
}

const CourseDetails: Screen<CourseDetailsProps, CourseDetailsScreenContext> = ({
  course,
  organizationPage,
  namespace,
  courseListPage,
}) => {
  const router = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()
  const { format } = useDateUtils()

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      pageTitle={course.title}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: getSubpageNavList(
          organizationPage,
          router,
          activeLocale === 'is' ? 3 : 4,
        ),
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
          title:
            courseListPage?.title ||
            n(
              'courseListPageTitle',
              activeLocale === 'is' ? 'Námskeið' : 'Courses',
            ),
          href: router.pathname.split('/').slice(0, -1).join('/'),
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
                activeLocale === 'is'
                  ? 'Skráning á næstu námskeið'
                  : 'Registration for upcoming courses',
              )}
            </Text>
            <InfoCardGrid
              variant="detailed"
              columns={1}
              cardsBorder="standard"
              cards={course.instances.map((instance) => {
                const detailLines = [
                  {
                    icon: 'calendar',
                    text: `${n(
                      'courseInstanceStartDatePrefix',
                      activeLocale === 'is' ? 'Hefst' : 'Starts',
                    )} ${format(new Date(instance.startDate), 'do MMMM yyyy')}`,
                  },
                ]

                let startDateTimeDuration = ''
                if (instance.startDateTimeDuration?.startTime) {
                  startDateTimeDuration =
                    instance.startDateTimeDuration.startTime
                  if (instance.startDateTimeDuration.endTime) {
                    startDateTimeDuration += ` ${n(
                      'timeDurationSeparator',
                      activeLocale === 'is' ? 'til' : '-',
                    )} ${instance.startDateTimeDuration.endTime}`
                  }
                }

                if (startDateTimeDuration) {
                  detailLines.push({
                    icon: 'time',
                    text: startDateTimeDuration,
                  })
                }

                if (instance.location) {
                  detailLines.push({
                    icon: 'location',
                    text: instance.location,
                  })
                }

                const tags: { label: string; variant: TagVariant }[] = []

                const title = instance.displayedTitle?.trim() || course.title

                return {
                  id: instance.id,
                  title,
                  description: instance.description,
                  eyebrow: '',
                  link: {
                    label: title,
                    href: `/umsoknir/hh-namskeid?selection=${JSON.stringify({
                      courseId: course.id,
                      courseInstanceId: instance.id,
                    })}`,
                    openInNewTab: true,
                  },
                  detailLines,
                  tags,
                }
              })}
            />
          </Stack>
        )}
      </Stack>
    </OrganizationWrapper>
  )
}

CourseDetails.getProps = async ({
  apolloClient,
  locale,
  organizationPage,
  courseListPageId,
  courseId,
  languageToggleHrefOverride,
}) => {
  if (!courseId) {
    throw new CustomNextError(404, 'Course ID is required')
  }
  if (!courseListPageId) {
    throw new CustomNextError(404, 'Course list page id was not provided')
  }

  const [
    namespace,
    {
      data: { getCourseById },
    },
    courseListPage,
  ] = await Promise.all([
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
          lang: locale,
        },
      },
    }),
    apolloClient.query<Query, QueryGetCourseListPageByIdArgs>({
      query: GET_COURSE_LIST_PAGE_BY_ID_QUERY,
      variables: {
        input: {
          id: courseListPageId,
          lang: locale,
        },
      },
    }),
  ])

  if (!getCourseById?.course) {
    throw new CustomNextError(404, 'Course not found')
  }

  if (
    getCourseById.course?.courseListPageId &&
    getCourseById.course.courseListPageId !== courseListPageId
  ) {
    throw new CustomNextError(
      404,
      'Course belongs to a different course list page',
    )
  }

  return {
    organizationPage,
    course: getCourseById.course,
    namespace,
    courseListPage: courseListPage.data?.getCourseListPageById,
    languageToggleHrefOverride: {
      is: getCourseById.activeLocales?.is ? languageToggleHrefOverride?.is : '',
      en: getCourseById.activeLocales?.en ? languageToggleHrefOverride?.en : '',
    },
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(CourseDetails)
