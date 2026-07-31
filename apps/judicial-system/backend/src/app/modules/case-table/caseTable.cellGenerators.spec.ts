import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  CaseState,
  ServiceRequirement,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../repository'
import { caseTableCellGenerators } from './caseTable.cellGenerators'

describe('indictment ruling decision cell generators', () => {
  const user = { role: UserRole.PROSECUTOR } as User

  const dismissedAppealedCase = {
    state: CaseState.COMPLETED,
    indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
    appealCase: { appealState: AppealCaseState.APPEALED },
  } as Case

  it('appends the appeal state tag to dismissals', () => {
    const cell = caseTableCellGenerators.indictmentRulingDecision.generate(
      dismissedAppealedCase,
      user,
    )

    expect(cell.value).toEqual({
      firstTag: { color: 'blue', text: 'Frávísun' },
      secondTag: { color: 'red', text: 'Kært' },
    })
  })

  it('omits the appeal state tag from dismissals when the table has a separate appeal state column', () => {
    const cell =
      caseTableCellGenerators.indictmentRulingDecisionWithoutAppealState.generate(
        dismissedAppealedCase,
        user,
      )

    expect(cell.value).toEqual({ color: 'blue', text: 'Frávísun' })
  })

  it('leaves the cell empty for cases that are not completed', () => {
    const cell =
      caseTableCellGenerators.indictmentRulingDecisionWithoutAppealState.generate(
        { state: CaseState.RECEIVED } as Case,
        user,
      )

    expect(cell.value).toBeUndefined()
  })
})

describe('indictment appeal deadline cell generator', () => {
  const user = { role: UserRole.PROSECUTOR } as User
  const rulingDate = new Date(2025, 0, 1)

  const generate = (theCase: Partial<Case>) =>
    caseTableCellGenerators.indictmentAppealDeadline.generate(
      { rulingDate, ...theCase } as Case,
      user,
    )

  const servedDefendant = (serviceDate: Date) => ({
    verdicts: [
      { serviceRequirement: ServiceRequirement.REQUIRED, serviceDate },
    ],
  })

  // The public prosecution office tables render one row per defendant, so the
  // generator only ever sees that row's defendant and must show their deadline
  it('counts from the row defendant own service date', () => {
    const cell = generate({
      defendants: [servedDefendant(new Date(2025, 0, 20))],
    } as unknown as Case)

    // 28 days on from 20.01, not from the 01.01 ruling date
    expect(cell.value).toEqual({ str: '17.2.2025' })
  })

  it('falls back to the ruling date when service is not required', () => {
    const cell = generate({
      defendants: [
        {
          verdicts: [{ serviceRequirement: ServiceRequirement.NOT_REQUIRED }],
        },
      ],
    } as unknown as Case)

    expect(cell.value).toEqual({ str: '29.1.2025' })
  })

  // The reviewer's own list rows per case, where the case is only out of appeal
  // once the last defendant's window has closed
  it('shows the latest deadline when a row carries several defendants', () => {
    const cell = generate({
      defendants: [
        servedDefendant(new Date(2025, 0, 10)),
        servedDefendant(new Date(2025, 0, 20)),
      ],
    } as unknown as Case)

    expect(cell.value).toEqual({ str: '17.2.2025' })
  })

  it('leaves the cell empty when no defendant has a deadline yet', () => {
    const cell = generate({
      defendants: [
        { verdicts: [{ serviceRequirement: ServiceRequirement.REQUIRED }] },
      ],
    } as unknown as Case)

    expect(cell.value).toBeUndefined()
  })
})
