import React from 'react'
import { Preview, Parameters } from '@storybook/react'
import { IntlProvider } from 'react-intl'
import { FormProvider, useForm } from 'react-hook-form'
import { ApolloClient, ApolloProvider } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'

export const parameters: Parameters = {
  viewMode: 'docs',
  previewTabs: { 'storybook/docs/panel': { index: -1 } },
  apolloClient: {
    MockedProvider,
  },
}

const preview: Preview = {
  decorators: [
    (Story) => {
      const hookFormData = useForm({ defaultValues: {} })

      return (
        <IntlProvider
          locale="is"
          messages={{}}
          defaultLocale="is"
          // We don't want to show errors in the storybook since it doesn't fetch real translations
          onError={() => undefined}
        >
          <FormProvider {...hookFormData}>
            <ApolloProvider client={{} as ApolloClient<any>}>
              {Story()}
            </ApolloProvider>
          </FormProvider>
        </IntlProvider>
      )
    },
  ],
}

export default preview
