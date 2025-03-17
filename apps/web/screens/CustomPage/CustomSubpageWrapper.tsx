import { IntlProvider } from 'react-intl'

import { HeadWithSocialSharing } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  Query,
  QueryGetCustomSubpageArgs,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { GET_CUSTOM_SUBPAGE_QUERY } from '@island.is/web/screens/queries/CustomPage'
import { Screen } from '@island.is/web/types'

import { CustomPageWrapperProps, CustomScreen } from './CustomPageWrapper'

export const withCustomSubpageWrapper = <Props,>(
  pageSlug: string,
  parentPageId: CustomPageUniqueIdentifier,
  Component: CustomScreen<
    Props & {
      customPageData?: CustomPageWrapperProps['customPageData']
    }
  >,
) => {
  const CustomSubpageWrapper: Screen<CustomPageWrapperProps> = ({
    customPageData,
    pageProps,
  }) => {
    const { activeLocale } = useI18n()
    return (
      <IntlProvider
        locale={activeLocale}
        messages={customPageData?.translationStrings}
      >
        <HeadWithSocialSharing
          title={customPageData?.ogTitle ?? ''}
          description={customPageData?.ogDescription ?? undefined}
          imageContentType={customPageData?.ogImage?.contentType}
          imageWidth={customPageData?.ogImage?.width?.toString()}
          imageHeight={customPageData?.ogImage?.height?.toString()}
          imageUrl={customPageData?.ogImage?.url}
        />
        <Component {...pageProps} customPageData={customPageData} />
      </IntlProvider>
    )
  }

  CustomSubpageWrapper.getProps = async (context) => {
    const [
      {
        data: { getCustomSubpage: customPageData },
      },
    ] = await Promise.all([
      context.apolloClient.query<Query, QueryGetCustomSubpageArgs>({
        query: GET_CUSTOM_SUBPAGE_QUERY,
        variables: {
          input: {
            lang: context.locale,
            slug: pageSlug,
            parentPageId,
          },
        },
      }),
    ])

    const [pageProps] = await Promise.all([
      Component?.getProps?.({ ...context, customPageData }),
    ])

    return {
      customPageData,
      pageProps,
      customAlertBanner: customPageData?.alertBanner,
      ...pageProps,
    }
  }

  return CustomSubpageWrapper
}
