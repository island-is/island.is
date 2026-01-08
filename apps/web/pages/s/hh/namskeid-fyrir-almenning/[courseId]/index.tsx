import {
  Query,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import CourseDetails, {
  type Props,
} from '@island.is/web/screens/Organization/Courses/CourseDetails'
import { GET_ORGANIZATION_PAGE_QUERY } from '@island.is/web/screens/queries'
import type { Screen as ScreenType } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { extractNamespaceFromOrganization } from '@island.is/web/utils/extractNamespaceFromOrganization'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

export const Component: ScreenType<Props> = (props) => {
  return <CourseDetails {...props} />
}

Component.getProps = async (context) => {
  const organizationPageSlug = 'hh'
  const subSlug =
    context.locale === 'is'
      ? 'namskeid-fyrir-almenning'
      : 'courses-for-the-public'
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

  const courseId = context.query.courseId as string

  const modifiedContext = {
    ...context,
    organizationPage: getOrganizationPage,
    courseListPageId: (namespace?.idOfCourseListPageForThePublic ??
      '6pkONOn80xzGTGij6qtjai') as string,
    courseId,
    languageToggleHrefOverride: {
      is: `/s/hh/namskeid-fyrir-almenning/${courseId}`,
      en: `/en/o/hh/courses-for-the-public/${courseId}`,
    },
  }

  return CourseDetails.getProps(modifiedContext)
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(Component))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
