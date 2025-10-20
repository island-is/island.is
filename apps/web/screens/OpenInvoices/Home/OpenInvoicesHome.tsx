import { useIntl } from 'react-intl'
import NextLink from 'next/link'

import { Box, Breadcrumbs } from '@island.is/island-ui/core'
import { CustomPageUniqueIdentifier, Locale } from '@island.is/shared/types'
import { CustomPageLayoutHeader } from '@island.is/web/components'
import {  Query } from "@island.is/web/graphql/schema"
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from "@island.is/web/layouts/main"

import { CustomScreen, withCustomPageWrapper } from "../../CustomPage"
import { m } from '../messages'

const OpenInvoicesHomePage: CustomScreen<OpenInvoicesHomeProps> = ({
  locale,
  customPageData,
}) => {
  useLocalLinkTypeResolver()
  useContentfulId(customPageData?.id)
  const { formatMessage} = useIntl()
  const { linkResolver } = useLinkResolver()

  const baseUrl = linkResolver('openinvoices', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.home.title),
      href: baseUrl,
      isTag: true,
    },
  ]

  return (
    <Box>
      <CustomPageLayoutHeader
        title={formatMessage(m.home.title)}
        description={formatMessage(m.home.description)}
        featuredImage={formatMessage(m.home.featuredImage)}
        featuredImageAlt={formatMessage(m.home.featuredImageAlt)}
        offset
        breadcrumbs={
          breadcrumbItems && (
            <Breadcrumbs
              items={breadcrumbItems ?? []}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href} legacyBehavior>
                    {link}
                  </NextLink>
                ) : (
                  link
                )
              }}
            />
          )
        }
      />
    </Box>
  )

}

interface OpenInvoicesHomeProps {
  organization?: Query['getOrganization']
  locale: Locale
}

const OpenInvoicesHome: CustomScreen<OpenInvoicesHomeProps> = ({
  organization, locale, customPageData
}) => {
  return <OpenInvoicesHomePage
    organization={organization}
    locale={locale}
    customPageData={customPageData}
  />
}

OpenInvoicesHome.getProps = async ({locale}) => {
  return {
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(withCustomPageWrapper(CustomPageUniqueIdentifier.OpenInvoices, OpenInvoicesHome))
