import type { FormValue } from '@island.is/application/types'
import { messages } from '../lib/messages'
import { outlierPlanOverviewItems } from './outlierPlanOverview'

const group = (overrides: Record<string, unknown> = {}) => ({
  name: 'Sérfræðingar',
  reason: 'Ástæða',
  action: 'Aðgerð',
  signatureName: 'Nafn',
  signatureRole: 'Titill',
  employeeOrdinals: [1],
  ...overrides,
})

const answers = (groups: unknown[]): FormValue => ({
  salaryAnalysis: { outlierGroups: groups },
})

const groupNames = (items: ReturnType<typeof outlierPlanOverviewItems>) =>
  items
    .filter(
      (item) =>
        item.keyText === messages.salaryAnalysis.outlierGroup.groupHeading,
    )
    .map((item) => item.valueText)

describe('outlierPlanOverviewItems', () => {
  it('recaps each group from the answers', () => {
    const items = outlierPlanOverviewItems(answers([group()]))

    expect(groupNames(items)).toEqual(['Sérfræðingar'])
    expect(items).toHaveLength(5)
  })

  it('drops a group whose members were all freed', () => {
    expect(
      groupNames(
        outlierPlanOverviewItems(
          answers([
            group({ name: 'Tómur', employeeOrdinals: [] }),
            group({ name: 'Hópur 2' }),
          ]),
        ),
      ),
    ).toEqual(['Hópur 2'])
  })

  // The draft phase mirrors the plan into answers as it is edited (see
  // SalaryImprovementPlan) precisely so this reads one source in every phase —
  // the stored draftOutlierGroups provider is a page-load snapshot.
  it('renders nothing when the answers hold no plan', () => {
    expect(outlierPlanOverviewItems({})).toEqual([])
    expect(outlierPlanOverviewItems(answers([]))).toEqual([])
  })

  it('falls back to the group position when it has no name', () => {
    expect(
      groupNames(
        outlierPlanOverviewItems(
          answers([group({ name: '' }), group({ name: '' })]),
        ),
      ),
    ).toEqual(['1', '2'])
  })
})
