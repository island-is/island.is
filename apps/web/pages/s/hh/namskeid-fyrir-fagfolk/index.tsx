import {
  Query,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import CourseListPage, {
  type Props,
} from '@island.is/web/screens/Organization/Courses/CourseList'
import { GET_ORGANIZATION_PAGE_QUERY } from '@island.is/web/screens/queries'
import type { Screen as ScreenType } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { extractNamespaceFromOrganization } from '@island.is/web/utils/extractNamespaceFromOrganization'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

export const Component: ScreenType<Props> = (props) => {
  return <CourseListPage {...props} />
}

Component.getProps = async (context) => {
  const organizationPageSlug = 'hh'
  const subSlug =
    context.locale === 'is'
      ? 'namskeid-fyrir-fagfolk'
      : 'courses-for-professionals'
  const [
    {
      data: { getOrganizationPage },
    },
  ] = await Promise.all([
    context.apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: organizationPageSlug,
          lang: context.locale,
          subpageSlugs: [subSlug],
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  const namespace = extractNamespaceFromOrganization(
    getOrganizationPage?.organization,
  )

  const modifiedContext = {
    ...context,
    organizationPage: getOrganizationPage,
    courseListPageId: (namespace?.idOfCourseListPageForProfessionals ??
      '147YftiWFQsBcbUFFe2rj1') as string,
    languageToggleHrefOverride: {
      is: `/s/hh/namskeid-fyrir-fagfolk`,
      en: `/en/o/hh/courses-for-professionals`,
    },
  }

  return CourseListPage.getProps(modifiedContext)
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(Component))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
