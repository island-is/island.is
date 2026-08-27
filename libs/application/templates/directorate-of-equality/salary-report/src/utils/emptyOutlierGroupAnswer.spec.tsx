/**
 * Guards the reason emptyOutlierGroupAnswer exists at all.
 *
 * react-hook-form resolves a registered input's initial value from
 * `_formValues`, falling back to `_defaultValues` at the same array index for
 * any key the value is missing. Both forms holding outlier groups carry
 * defaults — the draft form from useSeedOnce's `reset`, the ambient one from
 * application.answers — so appending a group that omitted `reason` handed the
 * *deleted* group N's reason to the freshly created group N, and wrote it back
 * into the form values as though the applicant had typed it.
 *
 * Exercised through react-hook-form itself rather than by asserting on the
 * object shape alone: the shape only matters because of this behaviour, and
 * nothing else in the suite would notice if a library upgrade changed it.
 */
import { act, render, screen } from '@testing-library/react'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  emptyOutlierGroupAnswer,
  type OutlierGroupAnswer,
} from './outlierGroups'

type Values = { outlierGroups: OutlierGroupAnswer[] }

type Api = {
  append: (value: OutlierGroupAnswer) => void
  remove: (index: number) => void
  reset: (values: Values) => void
  getValues: () => Values
}

let api: Api | null = null

// Stands in for OutlierEditor: the same useFieldArray over the same shape, with
// one of OutlierGroupCard's InputControllers per row.
const GroupsForm = () => {
  const form = useForm<Values>({ defaultValues: { outlierGroups: [] } })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'outlierGroups',
  })
  api = {
    append,
    remove,
    reset: form.reset,
    getValues: form.getValues,
  }
  return (
    <div>
      {fields.map((field, index) => (
        <input
          key={field.id}
          data-testid={`reason-${index}`}
          {...form.register(`outlierGroups.${index}.reason`)}
        />
      ))}
    </div>
  )
}

const reasonInput = (index: number) =>
  (screen.getByTestId(`reason-${index}`) as HTMLInputElement).value

describe('emptyOutlierGroupAnswer', () => {
  it('does not resurrect a removed group’s text in the group that replaces it', () => {
    render(<GroupsForm />)

    // Seeded from the draft, as useSeedOnce does.
    act(() =>
      api?.reset({
        outlierGroups: [
          { id: 'a', reason: 'Fyrri skýring', employeeOrdinals: [1] },
          { id: 'b', reason: 'Önnur skýring', employeeOrdinals: [2] },
        ],
      }),
    )
    expect(reasonInput(0)).toBe('Fyrri skýring')

    // Both groups removed, as "Fjarlægja hóp" does.
    act(() => {
      api?.remove(0)
      api?.remove(0)
    })
    expect(api?.getValues().outlierGroups).toEqual([])

    // A new group put together from a fresh selection.
    act(() => api?.append(emptyOutlierGroupAnswer([9], 'new-group')))

    expect(reasonInput(0)).toBe('')
    expect(api?.getValues().outlierGroups).toEqual([
      emptyOutlierGroupAnswer([9], 'new-group'),
    ])
  })

  it('declares every field an input is registered against', () => {
    // Any key missing here is a key react-hook-form resolves from defaults.
    expect(Object.keys(emptyOutlierGroupAnswer([1], 'id')).sort()).toEqual(
      [
        'action',
        'employeeOrdinals',
        'id',
        'name',
        'reason',
        'signatureName',
        'signatureRole',
      ].sort(),
    )
  })
})
