import { IntlProvider } from 'react-intl'

import {
  CustomPage,
  CustomPageUniqueIdentifier,
  Query,
  QueryGetCustomPageArgs,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { GET_CUSTOM_PAGE_QUERY } from '@island.is/web/screens/queries/CustomPage'
import { Screen, ScreenContext } from '@island.is/web/types'

export type CustomScreen<Props> = Screen<Props> & {
  customPageData?: CustomPage | null
  getProps?: (
    ctx: ScreenContext & {
      customPageData: CustomPageWrapperProps['customPageData']
    },
  ) => Promise<Props>
}

interface CustomPageWrapperProps {
  customPageData?: CustomPage | null
  pageProps: any // TODO: find better type
}

export function withCustomPageWrapper<Props>(
  uniqueIdentifier: CustomPageUniqueIdentifier,
  Component: CustomScreen<
    Props & {
      customPageData?: CustomPageWrapperProps['customPageData']
    }
  >,
) {
  const CustomPageWrapper: Screen<CustomPageWrapperProps> = ({
    customPageData,
    pageProps,
  }) => {
    const { activeLocale } = useI18n()
    return (
      <IntlProvider
        locale={activeLocale}
        messages={customPageData?.translationStrings}
      >
        <Component {...pageProps} customPageData={customPageData} />
      </IntlProvider>
    )
  }

  CustomPageWrapper.getProps = async (context) => {
    const [
      pageProps,
      {
        data: { getCustomPage: customPageData },
      },
    ] = await Promise.all([
      Component?.getProps?.(context),
      context.apolloClient.query<Query, QueryGetCustomPageArgs>({
        query: GET_CUSTOM_PAGE_QUERY,
        variables: {
          input: {
            lang: context.locale,
            uniqueIdentifier,
          },
        },
      }),
    ])

    return {
      customPageData,
      pageProps,
      customAlertBanner: customPageData?.alertBanner,
    }
  }

  return CustomPageWrapper
}
