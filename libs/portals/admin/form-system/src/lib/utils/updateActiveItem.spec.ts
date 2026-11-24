import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { updateActiveItemFn } from './updateActiveItem'

type FieldMutation = Parameters<typeof updateActiveItemFn>[3]

const deferredSave = () => {
  let resolve!: () => void
  let reject!: (error: Error) => void
  const promise = new Promise<{ data: object }>(
    (resolvePromise, rejectPromise) => {
      resolve = () => resolvePromise({ data: {} })
      reject = rejectPromise
    },
  )
  return { promise, resolve, reject }
}

const field = (id: string, english: string): FormSystemField => ({
  id,
  name: { is: 'Field' },
  screenId: 'screen',
  isRequired: false,
  isPartOfMultiset: false,
  informationText: { is: 'Source text', en: english },
})

const setup = () => {
  const updateField = jest.fn(
    async (_options?: Parameters<FieldMutation[0]>[0]) => ({ data: {} }),
  )
  const mutation: FieldMutation = [
    updateField,
    {
      called: false,
      loading: false,
      reset: jest.fn(),
      client: new ApolloClient({
        cache: new InMemoryCache(),
        link: ApolloLink.empty(),
      }),
    },
  ]
  const queue = new Map<string, Promise<void>>()
  const save = (data: FormSystemField) =>
    updateActiveItemFn(
      { type: 'Field', data },
      mutation,
      mutation,
      mutation,
      queue,
    )
  return { updateField, save }
}

describe('full-field save ordering', () => {
  afterEach(() => jest.restoreAllMocks())

  it('does not let a delayed translation overwrite a later English edit', async () => {
    const { updateField, save } = setup()
    const translation = deferredSave()
    let persistedEnglish = ''
    updateField.mockImplementation(async (options) => {
      const english =
        options?.variables?.input.updateFieldDto.informationText.en
      if (english === 'Automatic translation') await translation.promise
      persistedEnglish = english
      return { data: {} }
    })

    const translationSave = save(field('field', 'Automatic translation'))
    const editedSave = save(field('field', 'User edit'))

    expect(updateField).toHaveBeenCalledTimes(1)
    translation.resolve()
    await Promise.all([translationSave, editedSave])

    expect(updateField).toHaveBeenCalledTimes(2)
    expect(persistedEnglish).toBe('User edit')
  })

  it('allows different fields to save without waiting for one another', async () => {
    const { updateField, save } = setup()
    const first = deferredSave()
    updateField.mockImplementationOnce(() => first.promise)

    const firstSave = save(field('first', 'Translation'))
    const otherSave = save(field('other', 'Other edit'))
    const laterSave = save(field('first', 'Later edit'))

    expect(
      updateField.mock.calls.map(([options]) => options?.variables?.input.id),
    ).toEqual(['first', 'other'])
    await otherSave
    first.resolve()
    await Promise.all([firstSave, laterSave])
    expect(
      updateField.mock.calls.map(([options]) => options?.variables?.input.id),
    ).toEqual(['first', 'other', 'first'])
  })

  it('logs a failed save and still persists a later edit for the same field', async () => {
    const { updateField, save } = setup()
    const translation = deferredSave()
    const error = new Error('Save failed')
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    updateField.mockImplementationOnce(() => translation.promise)

    const translationSave = save(field('field', 'Translation'))
    const editedSave = save(field('field', 'User edit'))
    translation.reject(error)
    await Promise.all([translationSave, editedSave])

    expect(log).toHaveBeenCalledWith('Error updating active item: ', error)
    expect(updateField).toHaveBeenCalledTimes(2)
    expect(updateField).toHaveBeenLastCalledWith({
      variables: {
        input: {
          id: 'field',
          updateFieldDto: expect.objectContaining({
            informationText: { is: 'Source text', en: 'User edit' },
          }),
        },
      },
    })
  })
})
