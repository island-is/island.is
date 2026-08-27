import type { ExternalData, FormValue } from '@island.is/application/types'
import { messages } from '../lib/messages'
import { outlierPlanOverviewItems } from './outlierPlanOverview'

const draftExternalData = (
  groups: Array<Record<string, unknown>>,
): ExternalData => ({
  draftOutlierGroups: {
    status: 'success',
    data: { groups },
    date: new Date(),
  },
})

const draftGroup = (overrides: Record<string, unknown> = {}) => ({
  id: 'g1',
  reportId: 'r1',
  name: 'Sérfræðingar',
  reason: 'Ástæða',
  action: 'Aðgerð',
  signatureName: 'Nafn',
  signatureRole: 'Titill',
  memberEmployeeIds: ['e1'],
  ...overrides,
})

const groupNames = (items: ReturnType<typeof outlierPlanOverviewItems>) =>
  items
    .filter(
      (item) =>
        item.keyText === messages.salaryAnalysis.outlierGroup.groupHeading,
    )
    .map((item) => item.valueText)

describe('outlierPlanOverviewItems', () => {
  // DRAFT keeps the plan in the backend draft alone, so the recap there has
  // nothing but the stored provider read to go on.
  it('reads the backend draft groups when the answers hold none', () => {
    const items = outlierPlanOverviewItems(
      {},
      draftExternalData([draftGroup()]),
    )

    expect(groupNames(items)).toEqual(['Sérfræðingar'])
    expect(items).toHaveLength(5)
  })

  it('drops a group whose members were all freed', () => {
    const items = outlierPlanOverviewItems(
      {},
      draftExternalData([
        draftGroup({ name: 'Tómur', memberEmployeeIds: [] }),
        draftGroup({ name: 'Hópur 2' }),
      ]),
    )

    expect(groupNames(items)).toEqual(['Hópur 2'])
  })

  // The review phases edit the groups as answers; the stored provider read
  // beside them is only as fresh as the last sync.
  it('lets the answers outrank the stored draft groups', () => {
    const answers: FormValue = {
      salaryAnalysis: {
        outlierGroups: [
          {
            name: 'Úr svörum',
            reason: 'Ástæða',
            action: 'Aðgerð',
            signatureRole: 'Titill',
            employeeOrdinals: [1],
          },
        ],
      },
    }

    expect(
      groupNames(outlierPlanOverviewItems(answers, draftExternalData([draftGroup()]))),
    ).toEqual(['Úr svörum'])
  })

  it('renders nothing when there is no plan at all', () => {
    expect(outlierPlanOverviewItems({}, {})).toEqual([])
  })

  it('falls back to the group position when it has no name', () => {
    const items = outlierPlanOverviewItems(
      {},
      draftExternalData([
        draftGroup({ name: '' }),
        draftGroup({ name: '', id: 'g2' }),
      ]),
    )

    expect(groupNames(items)).toEqual(['1', '2'])
  })
})
