import { useRouter } from 'next/router'

import { Box, Icon, Stack, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  ActionCategoryCard,
  getThemeConfig,
  OrganizationWrapper,
} from '@island.is/web/components'
import type {
  ChargeItemCodeByCourseIdItem,
  Course,
  OrganizationPage,
  Query,
  QueryGetChargeItemCodesByCourseIdArgs,
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
import { formatCurrency } from '@island.is/web/utils/currency'
import { webRichText } from '@island.is/web/utils/richText'

import { GET_NAMESPACE_QUERY } from '../../queries'
import {
  GET_CHARGE_ITEM_CODES_BY_COURSE_ID_QUERY,
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
  chargeItems: ChargeItemCodeByCourseIdItem[]
}

const CourseDetails: Screen<CourseDetailsProps, CourseDetailsScreenContext> = ({
  course,
  organizationPage,
  namespace,
  courseListPage,
  chargeItems,
}) => {
  const router = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()
  const { format } = useDateUtils()

  const chargeItemMap = new Map(chargeItems.map((item) => [item.code, item]))
  const instanceCards = course.instances.map((instance) => {
    const title = instance.displayedTitle?.trim() || course.title
    const startDateLabel = `${n(
      'courseInstanceStartDatePrefix',
      activeLocale === 'is' ? 'Hefst' : 'Starts',
    )} ${format(new Date(instance.startDate), 'do MMMM yyyy')}`

    let startDateTimeDuration = ''
    if (instance.startDateTimeDuration?.startTime) {
      startDateTimeDuration = instance.startDateTimeDuration.startTime
      if (instance.startDateTimeDuration.endTime) {
        startDateTimeDuration += ` ${n(
          'timeDurationSeparator',
          activeLocale === 'is' ? 'til' : '-',
        )} ${instance.startDateTimeDuration.endTime}`
      }
    }

    const dateLabel = [startDateLabel, startDateTimeDuration]
      .filter(Boolean)
      .join(' - ')

    let priceLabel: string | undefined
    if (instance.chargeItemCode) {
      const chargeItem = chargeItemMap.get(instance.chargeItemCode)
      if (chargeItem) {
        priceLabel =
          chargeItem.priceAmount > 0
            ? `${n(
                'courseInstancePricePrefix',
                activeLocale === 'is' ? 'Verð' : 'Price',
              )}: ${formatCurrency(chargeItem.priceAmount)}`
            : n(
                'courseInstanceFreeLabel',
                activeLocale === 'is' ? 'Ókeypis' : 'Free',
              )
      }
    }

    const registrationHref = `/umsoknir/hh-namskeid?selection=${JSON.stringify({
      courseId: course.id,
      courseInstanceId: instance.id,
    })}`

    return {
      id: instance.id,
      title,
      description: instance.description ?? '',
      location: instance.location ?? '',
      startDateLabel,
      startDateTimeDuration,
      dateLabel,
      priceLabel,
      registrationHref,
    }
  })

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
            <Stack space={3}>
              {instanceCards.map((instance) => (
                <ActionCategoryCard
                  heading={instance.title}
                  subHeading={instance.location}
                  text={instance.description}
                  href={instance.registrationHref}
                  stackWidth={theme.breakpoints.sm}
                  autoStack={true}
                  sidePanelConfig={{
                    paddingLeft: [0, 0, 0, 0, 5],
                    paddingTop: [3, 3, 3, 3, 0],
                    items: [
                      {
                        icon: (
                          <Icon
                            icon="calendar"
                            type="outline"
                            color="blue400"
                          />
                        ),
                        title: instance.dateLabel,
                      },
                      ...(instance.priceLabel
                        ? [
                            {
                              icon: (
                                <Icon
                                  icon="wallet"
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: instance.priceLabel,
                            },
                          ]
                        : []),
                    ],
                    cta: {
                      href: instance.registrationHref,
                      label: n(
                        'courseInstanceRegistrationButtonLabel',
                        activeLocale === 'is' ? 'Skráning' : 'Registration',
                      ),
                      variant: 'primary',
                      size: 'medium',
                    },
                  }}
                />
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
    chargeItemsResponse,
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
    apolloClient
      .query<Query, QueryGetChargeItemCodesByCourseIdArgs>({
        query: GET_CHARGE_ITEM_CODES_BY_COURSE_ID_QUERY,
        variables: {
          input: {
            courseId,
          },
        },
      })
      .catch(() => null),
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
    chargeItems:
      chargeItemsResponse?.data?.getChargeItemCodesByCourseId?.items ?? [],
    languageToggleHrefOverride: {
      is: getCourseById.activeLocales?.is ? languageToggleHrefOverride?.is : '',
      en: getCourseById.activeLocales?.en ? languageToggleHrefOverride?.en : '',
    },
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(CourseDetails)
