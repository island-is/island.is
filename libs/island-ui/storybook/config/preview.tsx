import React from 'react'
import { Preview, Parameters } from '@storybook/react-webpack5'
import { IntlProvider } from 'react-intl'
import { FormProvider, useForm } from 'react-hook-form'
import { MockedProvider } from '@apollo/client/testing'
// Stories import components directly (deep imports), so the global resets
// (button, body, etc.) must be loaded explicitly, as the apps do.
import '../../core/src/styles/global.css'
import { BffContext, createMockedInitialState } from '@island.is/react-spa/bff'

const mockBffContext = {
  ...createMockedInitialState(),
  signIn: () => undefined,
  signOut: () => undefined,
  switchUser: () => undefined,
  bffUrlGenerator: (relativePath = '') => `/bff${relativePath}`,
}

export const parameters: Parameters = {
  viewMode: 'docs',
  previewTabs: { 'storybook/docs/panel': { index: -1 } },
  apolloClient: {
    MockedProvider,
    // The addon's panel title reads `mocks.length`, so it must always be defined
    mocks: [],
  },
}

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const hookFormData = useForm({ defaultValues: {} })
      // The apollo addon ships no decorator, so apply each story's
      // `parameters.apolloClient` settings (mocks, addTypename, ...) here
      const { MockedProvider: _, ...apolloMockOptions } =
        context.parameters.apolloClient ?? {}

      return (
        <IntlProvider
          locale="is"
          messages={{}}
          defaultLocale="is"
          // We don't want to show errors in the storybook since it doesn't fetch real translations
          onError={() => undefined}
        >
          <FormProvider {...hookFormData}>
            <MockedProvider {...apolloMockOptions}>
              <BffContext.Provider value={mockBffContext}>
                {Story()}
              </BffContext.Provider>
            </MockedProvider>
          </FormProvider>
        </IntlProvider>
      )
    },
  ],
}

export default preview
