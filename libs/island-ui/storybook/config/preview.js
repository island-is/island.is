import React from 'react'
import { IntlProvider } from 'react-intl'
import { FormProvider, useForm } from 'react-hook-form'
import { ApolloProvider } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'

export const parameters = {
  viewMode: 'docs',
  previewTabs: { 'storybook/docs/panel': { index: -1 } },
  apolloClient: {
    MockedProvider,
  },
}

export const decorators = [
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
          <ApolloProvider client={{}}>{Story()}</ApolloProvider>
        </FormProvider>
      </IntlProvider>
    )
  },
]
