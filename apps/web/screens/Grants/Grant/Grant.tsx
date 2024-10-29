import { useIntl } from 'react-intl'

import { Stack } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { GrantWrapper } from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  Grant,
  Query,
  QueryGetSingleGrantArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { GET_GRANT_QUERY } from '../../queries'
import { m } from '../messages'

const GrantSinglePage: CustomScreen<GrantSingleProps> = ({ grant, locale }) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const baseUrl = linkResolver('styrkjatorg', [], locale).href
  const currentUrl = linkResolver('styrkjatorggrant', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: 'Styrkir og sjóðir',
      href: baseUrl,
    },
    {
      title: grant?.name ?? 'Styrkur',
      href: currentUrl,
    },
  ]

  if (!grant) {
    return null
  }

  return (
    <GrantWrapper
      pageTitle={'Styrkur'}
      pageDescription={grant?.description ?? ''}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
    >
      <Stack space={SLICE_SPACING}>
        <p>hgeoiag</p>
      </Stack>
    </GrantWrapper>
  )
}

interface GrantSingleProps {
  grant?: Grant
  locale: Locale
}

const GrantSingle: CustomScreen<GrantSingleProps> = ({
  grant,
  customPageData,
  locale,
}) => {
  return (
    <GrantSinglePage
      grant={grant}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

GrantSingle.getProps = async ({ apolloClient, locale, query }) => {
  const {
    data: { getSingleGrant: grant },
  } = await apolloClient.query<Query, QueryGetSingleGrantArgs>({
    query: GET_GRANT_QUERY,
    variables: {
      input: {
        lang: locale as ContentLanguage,
        id: String(query.id),
      },
    },
  })

  return {
    grant: grant ?? undefined,
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Grants, GrantSingle),
)
