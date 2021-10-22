import React from 'react'
import { IntlProvider } from 'react-intl'
import { globalStyles } from '@island.is/island-ui/core'
import { FormProvider, useForm } from 'react-hook-form'
import { ApolloProvider } from '@apollo/client'

globalStyles()

export const parameters = {
  viewMode: 'docs',
  previewTabs: { 'storybook/docs/panel': { index: -1 } },
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
