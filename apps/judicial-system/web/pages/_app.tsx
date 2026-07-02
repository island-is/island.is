import App, { AppContext, AppProps } from 'next/app'
import getConfig from 'next/config'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'

import { Query, QueryGetTranslationsArgs } from '@island.is/api/schema'
import { ToastContainer } from '@island.is/island-ui/core'
import { GET_TRANSLATIONS, LocaleProvider } from '@island.is/localization'
import { userMonitoring } from '@island.is/user-monitoring'

import client from '../graphql/client'
import {
  FeatureProvider,
  FormProvider,
  Header as HeaderContainer,
  LawyerRegistryProvider,
  ServiceInterruptionBanner,
  UserProvider,
  ViewportProvider,
} from '../src/components'

const {
  publicRuntimeConfig: { ddLogsClientToken, appVersion, environment },
} = getConfig()

if (ddLogsClientToken && typeof window !== 'undefined') {
  userMonitoring.initDdLogs({
    service: 'judicial-system-web',
    clientToken: ddLogsClientToken,
    env: environment,
    version: appVersion,
  })
}

const getTranslationStrings = (apolloClient: typeof client) => {
  if (!apolloClient) {
    return null
  }
  return apolloClient
    .query<Query, QueryGetTranslationsArgs>({
      query: GET_TRANSLATIONS,
      variables: {
        input: {
          namespaces: [
            'judicial.system.core',
            'judicial.system.restriction_cases',
            'judicial.system.investigation_cases',
            'judicial.system.indictments',
          ],
          lang: 'is',
        },
      },
    })
    .then((content) => {
      return content?.data?.getTranslations
    })
    .catch((error) => {
      console.error(`Error fetching translations: ${error}`)
    })
}

interface Props extends AppProps {
  translations: { [key: string]: string }
}

class JudicialSystemApplication extends App<Props> {
  static async getInitialProps(appContext: AppContext) {
    const { ctx } = appContext
    const pageProps = await App.getInitialProps(appContext)
    const customContext = {
      ...ctx,
      apolloClient: client,
    }
    const translations = await getTranslationStrings(customContext.apolloClient)

    return {
      ...pageProps,
      translations,
    }
  }

  render() {
    const { Component, pageProps, translations } = this.props

    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta name="robots" content="noindex" />
          <meta
            name="google-site-verification"
            content="oR2L11nBpj4nvst9FGD9qfDRrpwcXYe9WeqSFMuAYCk"
          />
        </Head>
        <ViewportProvider>
          <ApolloProvider client={client}>
            <FeatureProvider>
              <UserProvider>
                <LocaleProvider locale="is" messages={translations || {}}>
                  <LawyerRegistryProvider>
                    <ServiceInterruptionBanner />
                    <FormProvider>
                      <HeaderContainer />
                      <Component {...pageProps} />
                      <ToastContainer />
                    </FormProvider>
                    <style jsx global>{`
                      @font-face {
                        font-family: 'IBM Plex Sans';
                        font-style: normal;
                        font-weight: 300;
                        font-display: swap;
                        src: local('IBM Plex Sans Light'),
                          local('IBMPlexSans-Light'),
                          url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-300.woff2')
                            format('woff2'),
                          url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-300.woff')
                            format('woff');
                      }
                      @font-face {
                        font-family: 'IBM Plex Sans';
                        font-style: normal;
                        font-weight: 400;
                        font-display: swap;
                        src: local('IBM Plex Sans'), local('IBMPlexSans'),
                          url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-regular.woff2')
                            format('woff2'),
                          url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-regular.woff')
                            format('woff');
                      }
                      @font-face {
                        font-family: 'IBM Plex Sans';
                        font-style: italic;
                        font-weight: 400;
                        font-display: swap;
                        src: local('IBM Plex Sans Italic'),
                          local('IBMPlexSans-Italic'),
                          url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-italic.woff2')
                            format('woff2'),
                          url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-italic.woff')
                            format('woff');
                      }
                      @font-face {
                        font-family: 'IBM Plex Sans';
                        font-style: normal;
                        font-weight: 500;
                        font-display: swap;
                        src: local('IBM Plex Sans Medium'),
                          local('IBMPlexSans-Medium'),
                          url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-500.woff2')
                            format('woff2'),
                          url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-500.woff')
                            format('woff');
                      }
                      @font-face {
                        font-family: 'IBM Plex Sans';
                        font-style: normal;
                        font-weight: 600;
                        font-display: swap;
                        src: local('IBM Plex Sans SemiBold'),
                          local('IBMPlexSans-SemiBold'),
                          url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-600.woff2')
                            format('woff2'),
                          url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-600.woff')
                            format('woff');
                      }
                    `}</style>
                  </LawyerRegistryProvider>
                </LocaleProvider>
              </UserProvider>
            </FeatureProvider>
          </ApolloProvider>
        </ViewportProvider>
      </>
    )
  }
}

export default JudicialSystemApplication
