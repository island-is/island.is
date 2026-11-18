import { useMutation } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { FileUploadStatus, InputFileUpload } from '@island.is/island-ui/core'
import { act, render } from '@testing-library/react'
import { ReactNode } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { ApplicationState } from '../../../lib'
import { uploadToS3 } from '../../../lib/s3Upload'
import { FileUpload } from './FileUpload'

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: jest.fn(),
}))

jest.mock('@island.is/island-ui/core', () => ({
  InputFileUpload: jest.fn(() => null),
  FileUploadStatus: { done: 'done', uploading: 'uploading', error: 'error' },
}))

jest.mock('../../../lib/s3Upload', () => ({
  uploadToS3: jest.fn(),
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
  mutate.mockReset()
  jest
    .mocked(useMutation)
    .mockReturnValue([mutate, {}] as unknown as ReturnType<typeof useMutation>)
})

it.each([
  { state: undefined, valueIndex: 0 },
  { state: { currentScreen: undefined }, valueIndex: 1 },
])(
  'selects and removes preview files locally for row $valueIndex without mutations',
  async ({ state, valueIndex }) => {
    const dispatch = jest.fn()
    const latestProps = () => {
      const calls = jest.mocked(InputFileUpload).mock.calls
      return calls[calls.length - 1][0]
    }
    render(
      <FileUpload
        item={item}
        state={state}
        valueIndex={valueIndex}
        dispatch={dispatch}
      />,
      {
        wrapper: Wrapper,
      },
    )
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
      payload: { id: item.id, value: [latestProps().files[0].key], valueIndex },
    })

    await act(async () => {
      latestProps().onRetry?.(latestProps().files[0])
      latestProps().onRemove?.(latestProps().files[0])
    })

    expect(mutate).not.toHaveBeenCalled()
    expect(latestProps().files).toEqual([])
    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'SET_FILES',
      payload: { id: item.id, value: [], valueIndex },
    })
  },
)

it('keeps saved files and form values isolated between repeated rows', async () => {
  const repeatedItem = {
    ...item,
    isPartOfMultiset: true,
    values: [
      { id: 'value-0', json: { s3Key: ['preview/first_first.pdf'] } },
      { id: 'value-1', json: { s3Key: ['preview/second_second.pdf'] } },
    ],
  }
  let getFormValues: ReturnType<typeof useForm>['getValues']
  const ObserveForm = () => {
    getFormValues = useFormContext().getValues
    return null
  }
  render(
    <>
      <ObserveForm />
      <FileUpload item={repeatedItem} valueIndex={0} />
      <FileUpload item={repeatedItem} valueIndex={1} />
    </>,
    { wrapper: Wrapper },
  )
  const rowProps = (valueIndex: number) => {
    const calls = jest.mocked(InputFileUpload).mock.calls
    return calls
      .filter(([props]) => props.name === `fileUpload-${item.id}-${valueIndex}`)
      .pop()![0]
  }

  expect(rowProps(0).files[0].name).toBe('first.pdf')
  expect(rowProps(1).files[0].name).toBe('second.pdf')
  expect(getFormValues!(`${item.id}.0`)).toEqual(['preview/first_first.pdf'])
  expect(getFormValues!(`${item.id}.1`)).toEqual(['preview/second_second.pdf'])

  await act(async () => {
    rowProps(1).onRemove?.(rowProps(1).files[0])
  })
  await act(async () => {
    rowProps(1).onChange?.([new File(['test'], 'replacement.pdf')])
  })

  expect(rowProps(0).files[0].name).toBe('first.pdf')
  expect(getFormValues!(`${item.id}.0`)).toEqual(['preview/first_first.pdf'])
  expect(getFormValues!(`${item.id}.1`)).toEqual([rowProps(1).files[0].key])
  expect(mutate).not.toHaveBeenCalled()
})

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

it('deletes the selected persisted row value rather than the first row', async () => {
  render(
    <FileUpload
      item={{
        ...item,
        values: [
          { id: 'value-0', json: { s3Key: ['application/first_first.pdf'] } },
          { id: 'value-1', json: { s3Key: ['application/second_second.pdf'] } },
        ],
      }}
      valueIndex={1}
      state={{
        application: { id: 'application' } as ApplicationState['application'],
      }}
    />,
    { wrapper: Wrapper },
  )
  const calls = jest.mocked(InputFileUpload).mock.calls
  const props = calls[calls.length - 1][0]

  await act(async () => {
    props.onRemove?.(props.files[0])
  })

  expect(mutate).toHaveBeenCalledWith({
    variables: {
      input: {
        deleteFileDto: {
          key: 'application/second_second.pdf',
          valueId: 'value-1',
        },
      },
    },
  })
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

const deferred = () => {
  let resolve!: () => void
  let reject!: (error: Error) => void
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

it('tracks concurrent uploads through permanent storage and releases failed uploads and retries', async () => {
  const dispatch = jest.fn()
  const firstUpload = deferred()
  const secondUpload = deferred()
  const firstStore = deferred()
  const retryUpload = deferred()
  mutate
    .mockResolvedValueOnce({
      data: {
        createUploadUrl: { url: 'upload-url', fields: { key: 'first' } },
      },
    })
    .mockResolvedValueOnce({
      data: {
        createUploadUrl: { url: 'upload-url', fields: { key: 'second' } },
      },
    })
    .mockReturnValueOnce(firstStore.promise)
    .mockResolvedValueOnce({
      data: {
        createUploadUrl: { url: 'upload-url', fields: { key: 'retry' } },
      },
    })
    .mockResolvedValueOnce({})
  jest
    .mocked(uploadToS3)
    .mockReturnValueOnce(firstUpload.promise)
    .mockReturnValueOnce(secondUpload.promise)
    .mockReturnValueOnce(retryUpload.promise)
  render(
    <FileUpload
      item={{ ...item, fieldSettings: { ...item.fieldSettings, maxFiles: 2 } }}
      state={{ application: { id: 'application' } }}
      dispatch={dispatch}
    />,
    { wrapper: Wrapper },
  )
  const latestProps = () =>
    jest.mocked(InputFileUpload).mock.calls.slice(-1)[0][0]
  const lifecycleActions = () =>
    dispatch.mock.calls
      .map(([action]) => action.type)
      .filter((type) => type !== 'SET_FILES')

  await act(async () => {
    latestProps().onChange?.([
      new File(['first'], 'first.pdf'),
      new File(['second'], 'second.pdf'),
    ])
  })
  expect(lifecycleActions()).toEqual(['START_FILE_UPLOAD', 'START_FILE_UPLOAD'])

  await act(async () => firstUpload.resolve())
  expect(mutate).toHaveBeenCalledTimes(3)
  expect(lifecycleActions()).not.toContain('FINISH_FILE_UPLOAD')

  await act(async () => firstStore.resolve())
  expect(lifecycleActions()).toEqual([
    'START_FILE_UPLOAD',
    'START_FILE_UPLOAD',
    'FINISH_FILE_UPLOAD',
  ])
  expect(latestProps().files[0].status).toBe(FileUploadStatus.done)

  await act(async () => secondUpload.reject(new Error('Upload failed')))
  expect(lifecycleActions()).toEqual([
    'START_FILE_UPLOAD',
    'START_FILE_UPLOAD',
    'FINISH_FILE_UPLOAD',
    'FINISH_FILE_UPLOAD',
  ])
  expect(latestProps().files[1].status).toBe(FileUploadStatus.error)

  await act(async () => latestProps().onRetry?.(latestProps().files[1]))
  expect(lifecycleActions().slice(-1)).toEqual(['START_FILE_UPLOAD'])
  await act(async () => retryUpload.resolve())
  expect(lifecycleActions().slice(-2)).toEqual([
    'START_FILE_UPLOAD',
    'FINISH_FILE_UPLOAD',
  ])
  expect(latestProps().files[1].status).toBe(FileUploadStatus.done)
})

it.each(['presigned URL', 'permanent storage'])(
  'releases the navigation lock when fetching %s fails',
  async (phase) => {
    const dispatch = jest.fn()
    if (phase === 'presigned URL') {
      mutate.mockRejectedValueOnce(new Error('Could not create upload URL'))
    } else {
      mutate
        .mockResolvedValueOnce({
          data: {
            createUploadUrl: { url: 'upload-url', fields: { key: 'file' } },
          },
        })
        .mockRejectedValueOnce(new Error('Could not store file'))
      jest.mocked(uploadToS3).mockResolvedValueOnce(undefined)
    }
    render(
      <FileUpload
        item={item}
        state={{ application: { id: 'application' } }}
        dispatch={dispatch}
      />,
      { wrapper: Wrapper },
    )
    await act(async () => {
      const calls = jest.mocked(InputFileUpload).mock.calls
      calls[calls.length - 1][0].onChange?.([new File(['test'], 'test.pdf')])
    })

    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      'START_FILE_UPLOAD',
      'FINISH_FILE_UPLOAD',
    ])
    const calls = jest.mocked(InputFileUpload).mock.calls
    expect(calls[calls.length - 1][0].files[0].status).toBe(
      FileUploadStatus.error,
    )
  },
)
