/**
 * Pins the one thing about this table that nothing else can see: that sorting it
 * reorders the WHOLE unassigned list rather than the page on screen.
 *
 * InteractiveTable sorts whatever `data` it is handed, and OutlierEditor hands it
 * one page — so its built-in sorting reordered ten rows and left the rest of the
 * list alone. The fix is three props (`manualSorting`, `sorting`,
 * `onSortingChange`) plus sortOutliers upstream of the slice, and removing any of
 * them silently restores the old behaviour. outlierSorting.spec covers the
 * comparator in isolation and would stay green through exactly that, which is why
 * this renders the real component.
 */
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import type { PropsWithChildren } from 'react'
import type { SalaryAnalysisOutlierDto } from '@island.is/clients/directorate-of-equality'
import { OutlierEditor } from './OutlierEditor'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: (
      message: { defaultMessage?: string } | string | undefined,
      values?: Record<string, string | number>,
    ) => {
      if (!message) return message
      const text =
        typeof message === 'string' ? message : message.defaultMessage ?? ''
      return Object.entries(values ?? {}).reduce(
        (acc, [key, value]) => acc.split(`{${key}}`).join(String(value)),
        text,
      )
    },
  }),
}))

// The editor renders its intro copy through the shared Markdown component, which
// pulls a remark/rehype chain this test has no interest in.
jest.mock('@island.is/shared/components', () => ({
  Markdown: ({ children }: PropsWithChildren) => <div>{children}</div>,
}))

const outlier = (
  employeeOrdinal: number,
  score: number,
): SalaryAnalysisOutlierDto => ({
  employeeOrdinal,
  gender: 'FEMALE',
  roleTitle: 'Sérfræðingur',
  score,
  regularHourlyWage: 4000,
  expectedHourlyWage: 5000,
  deviationPercent: -20,
  payStatus: 'UNDERPAID',
})

/**
 * Twelve outliers over a page size of ten (OUTLIERS_PAGE_SIZE), with BOTH
 * extremes deliberately stranded on the second page: ordinal 11 carries the
 * highest score of all and ordinal 12 the lowest, while ordinals 1-10 sit in a
 * narrow band between them.
 *
 * That is what makes the assertions discriminating in both directions. Sorting a
 * single page could only ever surface one of ordinals 1-10; only sorting the
 * whole list can bring 11 or 12 onto the first page at all.
 */
const outliers = [
  outlier(1, 430),
  outlier(2, 470),
  outlier(3, 410),
  outlier(4, 460),
  outlier(5, 440),
  outlier(6, 490),
  outlier(7, 420),
  outlier(8, 480),
  outlier(9, 450),
  outlier(10, 400),
  outlier(11, 900),
  outlier(12, 100),
]

const Harness = () => {
  const form = useForm({
    defaultValues: { salaryAnalysis: { outlierGroups: [] } },
  })
  return (
    <FormProvider {...form}>
      <OutlierEditor
        outliers={outliers}
        mode="draft"
        onSaveGroups={jest.fn().mockResolvedValue(true)}
        savedGroups={[]}
        onSavedGroupsChange={jest.fn()}
      />
    </FormProvider>
  )
}

// The ordinal is the second cell of each body row — the first is the select
// checkbox. Row 0 is the header.
const firstPageOrdinals = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[1].textContent?.trim())

const sortByStig = () =>
  userEvent.click(screen.getByRole('button', { name: /Stig/ }))

describe('OutlierEditor sorting', () => {
  it('sorts the whole unassigned list, not just the page on screen', async () => {
    render(<Harness />)

    // Ten of twelve, in the order the analysis listed them.
    expect(firstPageOrdinals()).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
    ])

    // TanStack opens a numeric column descending, so this is the top of the
    // list: ordinal 11, which was on page TWO a moment ago. Sorting the visible
    // page could only ever have put ordinal 6 (490) here.
    await sortByStig()
    expect(firstPageOrdinals()[0]).toBe('11')

    // And the other end, for the same reason — ordinal 12 was also on page two.
    // Page-local sorting would have surfaced ordinal 10 (400).
    await sortByStig()
    expect(firstPageOrdinals()[0]).toBe('12')
  })
})
