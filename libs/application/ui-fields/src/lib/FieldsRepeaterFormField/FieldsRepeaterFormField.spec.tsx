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
  it('F1: starts with one empty row by default', () => {
    setup()

    expect(inputValues()).toEqual([''])
  })

  it('F1: starts with as many rows as the answers hold', () => {
    setup({}, stored('Anna', 'Bára'))

    expect(inputValues()).toEqual(['Anna', 'Bára'])
  })

  it('F1: minRows raises the starting count', () => {
    setup({ minRows: 3 }, stored('Anna'))

    expect(inputValues()).toEqual(['Anna', '', ''])
  })

  it('F1: minRows 0 starts empty', () => {
    setup({ minRows: 0 })

    expect(inputs()).toHaveLength(0)
  })

  it('F1: minRows as a function receives answers and externalData', () => {
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
      expect.any(Object),
      expect.objectContaining({ source: expect.anything() }),
    )
  })

  it('F2: Add adds an empty row', async () => {
    setup()

    await userEvent.click(addButton() as HTMLElement)

    expect(inputValues()).toEqual(['', ''])
  })

  it('F2: maxRows disables Add at the limit', async () => {
    setup({ maxRows: 2 })

    await userEvent.click(addButton() as HTMLElement)

    expect(inputs()).toHaveLength(2)
    expect(addButton()).toBeDisabled()
  })

  it('F2: maxRows as a function', () => {
    setup({ maxRows: () => 1 })

    expect(addButton()).toBeDisabled()
  })

  it('F3: Remove removes the last row', async () => {
    setup({}, stored('Anna', 'Bára'))

    await userEvent.click(removeButton() as HTMLElement)

    expect(inputValues()).toEqual(['Anna'])
  })

  it('F3: Remove is hidden at minRows', async () => {
    setup({ minRows: 1 })

    expect(removeButton()).not.toBeInTheDocument()

    await userEvent.click(addButton() as HTMLElement)
    expect(removeButton()).toBeInTheDocument()
  })

  it('F3: hideRemoveButton hides Remove', () => {
    setup({ hideRemoveButton: true }, stored('Anna', 'Bára'))

    expect(removeButton()).not.toBeInTheDocument()
  })

  it('F4: Remove trims a stored row from the answers', async () => {
    const { getForm } = setup({}, stored('Anna', 'Bára'))

    await userEvent.click(removeButton() as HTMLElement)

    expect(getForm().getValues('people')).toEqual([{ name: 'Anna' }])
  })

  it('F4: Remove trims a row that was typed into', async () => {
    const { getForm } = setup({}, stored('Anna'))

    await userEvent.click(addButton() as HTMLElement)
    await userEvent.type(inputs()[1], 'Bára')
    await userEvent.click(removeButton() as HTMLElement)

    expect(inputValues()).toEqual(['Anna'])
    expect(getForm().getValues('people')).toEqual([{ name: 'Anna' }])
  })
})
