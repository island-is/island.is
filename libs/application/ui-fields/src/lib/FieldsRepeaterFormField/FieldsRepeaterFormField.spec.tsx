import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildFieldsRepeaterField } from '@island.is/application/core'
import { FieldsRepeaterField, FormValue } from '@island.is/application/types'
import { renderRepeater } from '../../test-utils/repeaterHarness'
import { FieldsRepeaterFormField } from './FieldsRepeaterFormField'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    formatMessage: jest.requireActual('../../test-utils/repeaterHarness')
      .formatMessage,
    lang: 'is',
  }),
}))

jest.mock('@island.is/react-spa/bff', () => ({
  useUserInfo: () => undefined,
}))

type Config = Parameters<typeof buildFieldsRepeaterField>[0]

const setup = (
  overrides: Partial<Config> = {},
  answers: FormValue = {},
  externalData = {},
) =>
  renderRepeater({
    Component: FieldsRepeaterFormField,
    field: buildFieldsRepeaterField({
      id: 'people',
      fields: { name: { component: 'input', label: 'Heiti' } },
      ...overrides,
    } as Config) as FieldsRepeaterField,
    answers,
    externalData,
  })

const inputs = () => screen.queryAllByRole('textbox')
const inputValues = () =>
  inputs().map((input) => (input as HTMLInputElement).value)
const addButton = () => screen.queryByRole('button', { name: /Bæta við/ })
const removeButton = () => screen.queryByRole('button', { name: 'Fjarlægja' })
const stored = (...names: string[]) => ({
  people: names.map((name) => ({ name })),
})

describe('FieldsRepeater', () => {
  it('starts with one empty row and Add appends another', async () => {
    setup()
    expect(inputValues()).toEqual([''])

    await userEvent.click(addButton() as HTMLElement)

    expect(inputValues()).toEqual(['', ''])
  })

  it('starts with the stored rows and Remove trims the last one from the answers', async () => {
    const { getForm } = setup({}, stored('Anna', 'Bára'))
    expect(inputValues()).toEqual(['Anna', 'Bára'])

    await userEvent.click(removeButton() as HTMLElement)

    expect(inputValues()).toEqual(['Anna'])
    expect(getForm().getValues('people')).toEqual([{ name: 'Anna' }])
  })

  it('raises the starting count to minRows and hides Remove at it', async () => {
    setup({ minRows: 3 }, stored('Anna'))

    expect(inputValues()).toEqual(['Anna', '', ''])
    expect(removeButton()).not.toBeInTheDocument()

    await userEvent.click(addButton() as HTMLElement)
    expect(removeButton()).toBeInTheDocument()
  })

  it('starts empty when minRows is 0', () => {
    setup({ minRows: 0 })

    expect(inputs()).toHaveLength(0)
  })

  it('passes answers and externalData to a minRows function', () => {
    const minRows = jest.fn(() => 2)
    setup(
      { minRows },
      {},
      {
        source: { data: 'x', date: new Date(), status: 'success' },
      },
    )

    expect(inputs()).toHaveLength(2)
    expect(minRows).toHaveBeenCalledWith(
      expect.objectContaining({
        application: expect.objectContaining({
          answers: expect.any(Object),
          externalData: expect.objectContaining({ source: expect.anything() }),
        }),
      }),
    )
  })

  it('disables Add at maxRows', async () => {
    setup({ maxRows: 2 })

    await userEvent.click(addButton() as HTMLElement)

    expect(inputs()).toHaveLength(2)
    expect(addButton()).toBeDisabled()
  })

  it('trims a row that was typed into from the answers on Remove', async () => {
    const { getForm } = setup({}, stored('Anna'))

    await userEvent.click(addButton() as HTMLElement)
    await userEvent.type(inputs()[1], 'Bára')
    await userEvent.click(removeButton() as HTMLElement)

    expect(inputValues()).toEqual(['Anna'])
    expect(getForm().getValues('people')).toEqual([{ name: 'Anna' }])
  })
})
