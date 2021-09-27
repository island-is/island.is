import App, { AppProps } from 'next/app'
import getConfig from 'next/config'
import { ApolloProvider } from '@apollo/client'
import React from 'react'
import { client } from '@island.is/financial-aid-web/veita/graphql'
import { withHealthchecks } from '@island.is/financial-aid-web/veita/units/Healthchecks/withHealthchecks'

import {
  ApplicationFiltersProvider,
  AdminProvider,
  AdminLayout,
} from '@island.is/financial-aid-web/veita/src/components'

import '@island.is/financial-aid-web/veita/src/styles.css'

class FinancialAidApplication extends App<AppProps> {
  render() {
    const { Component, pageProps } = this.props

    return (
      <ApolloProvider client={client}>
        <AdminProvider>
          <ApplicationFiltersProvider>
            <AdminLayout>
              <Component {...pageProps} />
              <style jsx global>{`
                @font-face {
                  font-family: 'IBM Plex Sans';
                  font-style: normal;
                  font-weight: 300;
                  font-display: swap;
                  src: local('IBM Plex Sans Light'), local('IBMPlexSans-Light'),
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
            </AdminLayout>
          </ApplicationFiltersProvider>
        </AdminProvider>
      </ApolloProvider>
    )
  }
}

const { serverRuntimeConfig } = getConfig()
const { graphqlEndpoint, apiUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlEndpoint, apiUrl]

export default withHealthchecks(externalEndpointDependencies)(
  FinancialAidApplication,
)
