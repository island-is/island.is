import { useMutation } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { FileUploadStatus, InputFileUpload } from '@island.is/island-ui/core'
import { act, render } from '@testing-library/react'
import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { ApplicationState } from '../../../lib'
import { FileUpload } from './FileUpload'

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: jest.fn(),
}))

jest.mock('@island.is/island-ui/core', () => ({
  InputFileUpload: jest.fn(() => null),
  FileUploadStatus: { done: 'done' },
}))

const item: FormSystemField = {
  id: 'file-upload',
  screenId: 'preview-screen',
  isPartOfMultiset: false,
  isRequired: false,
  name: { is: 'File' },
  values: [],
  fieldSettings: { fileTypes: '.pdf', fileMaxSize: 1024, maxFiles: 1 },
}

const Wrapper = ({ children }: { children: ReactNode }) => {
  const methods = useForm()
  return (
    <IntlProvider locale="is" defaultLocale="is" messages={{}}>
      <FormProvider {...methods}>{children}</FormProvider>
    </IntlProvider>
  )
}

const mutate = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  jest
    .mocked(useMutation)
    .mockReturnValue([mutate, {}] as unknown as ReturnType<typeof useMutation>)
})

it.each([undefined, { currentScreen: undefined }])(
  'selects and removes preview files locally without mutations: %p',
  async (state) => {
    const dispatch = jest.fn()
    const latestProps = () => {
      const calls = jest.mocked(InputFileUpload).mock.calls
      return calls[calls.length - 1][0]
    }
    render(<FileUpload item={item} state={state} dispatch={dispatch} />, {
      wrapper: Wrapper,
    })
    expect(latestProps().disabled).toBe(false)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    await act(async () => {
      latestProps().onChange?.([file])
    })

    expect(latestProps().files).toEqual([
      expect.objectContaining({
        name: file.name,
        originalFileObj: file,
        status: FileUploadStatus.done,
        percent: 100,
        key: expect.stringMatching(/^preview\/.*_test\.pdf$/),
      }),
    ])
    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'SET_FILES',
      payload: { id: item.id, value: [latestProps().files[0].key] },
    })

    await act(async () => {
      latestProps().onRetry?.(latestProps().files[0])
      latestProps().onRemove?.(latestProps().files[0])
    })

    expect(mutate).not.toHaveBeenCalled()
    expect(latestProps().files).toEqual([])
    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'SET_FILES',
      payload: { id: item.id, value: [] },
    })
  },
)

it.each([
  ['oversized files', [new File(['x'.repeat(1025)], 'large.pdf')]],
  [
    'too many files',
    [new File(['a'], 'first.pdf'), new File(['b'], 'second.pdf')],
  ],
] as const)('rejects %s in preview without mutations', async (_, files) => {
  const dispatch = jest.fn()
  render(<FileUpload item={item} dispatch={dispatch} />, { wrapper: Wrapper })
  const calls = jest.mocked(InputFileUpload).mock.calls

  await act(async () => {
    calls[calls.length - 1][0].onChange?.([...files])
  })

  const props = calls[calls.length - 1][0]
  expect(props.files).toEqual([])
  expect(props.errorMessage).toBeTruthy()
  expect(dispatch).not.toHaveBeenCalled()
  expect(mutate).not.toHaveBeenCalled()
})

it('keeps uploads enabled for an application', () => {
  render(
    <FileUpload
      item={item}
      state={{
        application: { id: 'application' } as ApplicationState['application'],
      }}
    />,
    { wrapper: Wrapper },
  )
  const calls = jest.mocked(InputFileUpload).mock.calls
  expect(calls[calls.length - 1][0].disabled).toBe(false)
})
