import '@testing-library/jest-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  buildFieldsRepeaterField,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  FieldsRepeaterField,
  RepeaterItem,
  RepeaterItemContext,
  Schema,
  TableRepeaterField,
} from '@island.is/application/types'
import { z } from 'zod'
import { renderRepeater } from '../test-utils/repeaterHarness'
import { FieldsRepeaterFormField } from './FieldsRepeaterFormField/FieldsRepeaterFormField'
import { TableRepeaterFormField } from './TableRepeaterFormField/TableRepeaterFormField'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    formatMessage: jest.requireActual('../test-utils/repeaterHarness')
      .formatMessage,
    lang: 'is',
  }),
}))

jest.mock('@island.is/react-spa/bff', () => ({
  useUserInfo: () => undefined,
}))

type Items = Record<string, RepeaterItem>
type Harness = ReturnType<typeof renderRepeater>

const repeaters = [
  {
    name: 'TableRepeater' as const,
    open: async (fields: Items, dataSchema?: Schema) => {
      const harness = renderRepeater({
        Component: TableRepeaterFormField,
        field: buildTableRepeaterField({
          id: 'people',
          fields,
        }) as TableRepeaterField,
        dataSchema,
      })
      await userEvent.click(screen.getByRole('button', { name: /Bæta við/ }))
      return harness
    },
    validate: async (_harness: Harness) => {
      await userEvent.click(screen.getByRole('button', { name: 'Vista' }))
    },
  },
  {
    name: 'FieldsRepeater' as const,
    open: async (fields: Items, dataSchema?: Schema) =>
      renderRepeater({
        Component: FieldsRepeaterFormField,
        field: buildFieldsRepeaterField({
          id: 'people',
          fields,
        }) as FieldsRepeaterField,
        dataSchema,
      }),
    validate: async (harness: Harness) => {
      await harness.submit()
    },
  },
]

const countrySelect = () =>
  document.querySelector(
    '[data-testid^="country-code-select-"] input',
  ) as HTMLInputElement

const input = (label: RegExp | string) =>
  screen.getByRole('textbox', { name: label })

describe.each(repeaters)('$name row fields', ({ name, open, validate }) => {
  const isTable = name === 'TableRepeater'

  it('I16: callbacks see the live answers in ctx.application', async () => {
    await open({
      name: { component: 'input', label: 'Heiti' },
      extra: {
        component: 'input',
        label: 'Auka',
        condition: ({ application }) =>
          getValueViaPath(application.answers, 'people[0].name') !== 'fela',
      },
    })

    expect(input(/Auka/)).toBeInTheDocument()
    await userEvent.type(input(/Heiti/), 'fela')

    await waitFor(() =>
      expect(
        screen.queryByRole('textbox', { name: /Auka/ }),
      ).not.toBeInTheDocument(),
    )
  })
  it('I10: field errors show on the row', async () => {
    const harness = await open(
      { name: { component: 'input', label: 'Heiti' } },
      z.object({ people: z.array(z.object({ name: z.string().min(1) })) }),
    )

    await validate(harness)

    expect(await screen.findByText('Ógilt gildi')).toBeInTheDocument()
  })

  it('I10: errors on a nested item id', async () => {
    const harness = await open(
      { 'address.street': { component: 'input', label: 'Gata' } },
      z.object({
        people: z.array(
          z.object({ address: z.object({ street: z.string().min(1) }) }),
        ),
      }),
    )

    await validate(harness)

    expect(await screen.findByText('Ógilt gildi')).toBeInTheDocument()
  })

  it('I6: defaultValue as a function fills the field', async () => {
    const defaultValue = jest.fn((_ctx: RepeaterItemContext) => 'Sjálfgefið')
    await open({ name: { component: 'input', label: 'Heiti', defaultValue } })

    expect(input(/Heiti/)).toHaveValue('Sjálfgefið')
    expect(defaultValue.mock.calls.at(-1)?.[0]).toMatchObject({
      index: 0,
      locale: 'is',
    })
  })

  it('I11: hiddenInput writes its default value', async () => {
    const { getForm } = await open({
      name: { component: 'input', label: 'Heiti' },
      secret: { component: 'hiddenInput', defaultValue: 'falið' },
    })

    await waitFor(() =>
      expect(getForm().getValues('people.0.secret')).toBe('falið'),
    )
  })

  it('I15: alertMessage and description render their text', async () => {
    await open({
      note: {
        component: 'description',
        title: 'Lýsing á röð',
      },
      warning: {
        component: 'alertMessage',
        title: 'Athugið',
        message: 'Skilaboð í röð',
        alertType: 'warning',
      },
    })

    expect(screen.getByText('Lýsing á röð')).toBeInTheDocument()
    expect(screen.getByText('Athugið')).toBeInTheDocument()
    expect(screen.getByText('Skilaboð í röð')).toBeInTheDocument()
  })

  it('I15: fileUpload renders its upload area', async () => {
    await open({
      files: {
        component: 'fileUpload',
        uploadHeader: 'Dragðu skjöl hingað',
        uploadButtonLabel: 'Velja skjöl',
      },
    })

    expect(screen.getByText('Dragðu skjöl hingað')).toBeInTheDocument()
    expect(screen.getByText('Velja skjöl')).toBeInTheDocument()
  })

  it('I6: nationalIdWithName honours defaultValue and nationalIdDefaultValue', async () => {
    const defaultValue = jest.fn(() => ({
      nationalId: '0101302989',
      name: 'Anna',
    }))
    await open({
      fromDefault: { component: 'nationalIdWithName', defaultValue },
      seeded: {
        component: 'nationalIdWithName',
        nationalIdDefaultValue: '0101307789',
      },
    })

    const [fromDefault, seeded] = screen.getAllByRole('textbox', {
      name: /Kennitala/,
    })
    expect(fromDefault).toHaveValue('010130-2989')
    expect(seeded).toHaveValue('010130-7789')
    expect(defaultValue).toHaveBeenCalled()
  })

  it('I12: selectAsync loadOptions runs on mount and can write into the row', async () => {
    const loadOptions = jest.fn(
      async (
        _context: unknown,
        {
          setValueAtIndex,
        }: { setValueAtIndex: (key: string, value: string) => void },
      ) => {
        setValueAtIndex('echo', 'sótt')
        return [{ value: 'a', label: 'Kostur A' }]
      },
    )
    const { getForm } = await open({
      choice: { component: 'selectAsync', label: 'Val', loadOptions },
      echo: { component: 'input', label: 'Bergmál' },
    })

    await waitFor(() =>
      expect(getForm().getValues('people.0.echo')).toBe('sótt'),
    )
    expect(loadOptions).toHaveBeenCalledWith(
      expect.objectContaining({ apolloClient: expect.anything() }),
      expect.objectContaining({
        locale: 'is',
        row: undefined,
        setValueAtIndex: expect.any(Function),
      }),
    )
  })

  it('I13: date minDate and maxDate as functions of the row', async () => {
    const minDate = jest.fn(
      (_ctx: RepeaterItemContext) => new Date('2026-01-01'),
    )
    const maxDate = jest.fn(
      (_ctx: RepeaterItemContext) => new Date('2026-12-31'),
    )
    await open({
      when: { component: 'date', label: 'Dagsetning', minDate, maxDate },
    })

    expect(screen.getByLabelText(/Dagsetning/)).toBeInTheDocument()
    const expectedCtx = expect.objectContaining({
      application: expect.objectContaining({ id: 'test-application' }),
      row: isTable ? { isUnsaved: true } : undefined,
    })
    expect(minDate).toHaveBeenLastCalledWith(expectedCtx)
    expect(maxDate).toHaveBeenLastCalledWith(expectedCtx)
  })

  it('I14: phone country selector is locked by default', async () => {
    await open({ phone: { component: 'phone', label: 'Sími' } })

    const select = countrySelect()
    expect(select.disabled).toBe(true)
  })

  it('I14: enableCountrySelector unlocks it', async () => {
    await open({
      phone: { component: 'phone', label: 'Sími', enableCountrySelector: true },
    })

    const select = countrySelect()
    expect(select.disabled).toBe(false)
  })
})
