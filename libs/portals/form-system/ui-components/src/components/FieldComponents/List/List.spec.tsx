import {
  MockedProvider,
  MockedResponse,
  MockLink,
} from '@apollo/client/testing'
import { FormSystemField } from '@island.is/api/schema'
import { ListTypesEnum } from '@island.is/form-system/enums'
import { DATA_FROM_URL } from '@island.is/form-system/graphql'
import { Select, SkeletonLoader } from '@island.is/island-ui/core'
import { act, render, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { List } from './List'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: (message: { defaultMessage: string }) =>
      message.defaultMessage,
  }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  Select: jest.fn(() => null),
  SkeletonLoader: jest.fn(() => null),
  LoadingDots: () => null,
  Box: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const renderList = (
  listType: string,
  isPreview: boolean,
  cached = false,
  mocks: MockedResponse[] = [],
) => {
  const item: FormSystemField = {
    id: 'list',
    name: { is: 'List' },
    fieldSettings: { listType },
    list: cached ? [{ label: { is: 'Saved option' }, value: 'saved' }] : [],
  }
  const dispatch = jest.fn()
  const Form = () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <List
          item={item}
          isPreview={isPreview}
          slug="form"
          dispatch={dispatch}
        />
      </FormProvider>
    )
  }
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Form />
    </MockedProvider>,
  )
  return dispatch
}

beforeEach(() => jest.clearAllMocks())

describe.each([
  ListTypesEnum.LIST_FROM_URL,
  ListTypesEnum.ZENDESK_FIELD_OPTIONS,
  ListTypesEnum.ZENDESK_CUSTOM_OBJECT,
])('%s', (listType) => {
  it.each([false, true])(
    'skips preview requests with cached options: %s',
    async (cached) => {
      const requestSpy = jest.spyOn(MockLink.prototype, 'request')
      try {
        const dispatch = renderList(listType, true, cached)
        await act(async () => {
          await Promise.resolve()
        })

        expect(requestSpy).not.toHaveBeenCalled()
        expect(SkeletonLoader).not.toHaveBeenCalled()
        expect(dispatch).not.toHaveBeenCalled()
        expect(jest.mocked(Select).mock.calls.at(-1)?.[0].options).toEqual(
          cached
            ? [
                {
                  label: 'Saved option',
                  value: { label: { is: 'Saved option' }, value: 'saved' },
                },
              ]
            : [],
        )
      } finally {
        requestSpy.mockRestore()
      }
    },
  )

  it('still fetches outside preview', async () => {
    const result = jest.fn(() => ({
      data: {
        formSystemDataFromUrl: { list: [], placeholder: null, isError: false },
      },
    }))
    renderList(listType, false, false, [
      {
        request: {
          query: DATA_FROM_URL,
          variables: {
            input: { slug: 'form', isTest: false, fieldId: 'list' },
          },
        },
        result,
      },
    ])

    await waitFor(() => expect(result).toHaveBeenCalledTimes(1))
  })
})
