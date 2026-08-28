import { Application, ExternalData, FormValue } from '@island.is/application/types'
import { BffUser } from '@island.is/shared/types'
import * as kennitala from 'kennitala'
import {
  assigneeAccessAgreementRepeaterMaxRows,
  assigneeAccessAgreementRepeaterMinRows,
} from './assigneeAccessAgreementUtils'
import { shouldShowAssigneeUmgengnissamningurScreen } from './assigneeUtils'
import {
  assigneeWaitingApprovedDescription,
  assigneeWaitingPendingDescription,
  assigneeWaitingRejectedDescription,
} from './assigneeWaitingUtils'
import {
  assigneeAccessAgreementOverviewAttachments,
  householdMembersOverviewTitle,
  mainFormAccessAgreementOverviewAttachments,
  mainFormAccessAgreementOverviewTitle,
  signedAssigneesAccessAgreementOverviewAttachments,
  signedAssigneesAccessAgreementOverviewTitle,
} from './getOverviewItems'

jest.mock('@island.is/application/ui-components', () => ({
  formatBankInfo: (value: string) => value,
  formatCurrency: (value: string) => value,
  formatPhoneNumberWithIcelandicCountryCode: (value: string) => value,
}))

const APPLICANT_ID = '0101303019'
const ASSIGNEE_ID = '0101307789'
const CHILD_ID = kennitala.generatePerson(new Date(2018, 5, 15))

const assigneeUser = {
  profile: { nationalId: ASSIGNEE_ID },
} as BffUser

const householdRepeater = [
  {
    nationalIdWithName: { nationalId: ASSIGNEE_ID, name: 'Anna Assignee' },
  },
  {
    nationalIdWithName: { nationalId: CHILD_ID, name: 'Kalli Kid' },
  },
]

const baseExternalData = {
  nationalRegistry: { data: { nationalId: APPLICANT_ID } },
  childrenCustodyInformation: { data: [] },
} as unknown as ExternalData

const uploadedRepeater = [
  {
    childNationalId: CHILD_ID,
    file: [{ key: 'file-1', name: 'umgengnissamningur.pdf' }],
  },
]

const answersWithMissingChild = {
  householdMembersTableRepeater: householdRepeater,
} as FormValue

const answersWithUpload = {
  householdMembersTableRepeater: householdRepeater,
  [ASSIGNEE_ID]: {
    assigneeInfo: { name: 'Anna Assignee', nationalId: ASSIGNEE_ID },
    assigneeAccessAgreementRepeater: uploadedRepeater,
  },
} as FormValue

const answersWithSignedUpload = {
  ...answersWithUpload,
  signedAssignees: [ASSIGNEE_ID],
} as FormValue

const custodyExternalData = {
  nationalRegistry: { data: { nationalId: APPLICANT_ID } },
  childrenCustodyInformation: { data: [{ nationalId: CHILD_ID }] },
} as unknown as ExternalData

const asApplication = (
  answers: FormValue,
  externalData: ExternalData = baseExternalData,
): Application =>
  ({
    id: 'app-id',
    applicant: APPLICANT_ID,
    assignees: [ASSIGNEE_ID],
    answers,
    externalData,
  } as Application)

describe('assignee umgengnissamningur screen', () => {
  it('is hidden when there is no logged-in user', () => {
    expect(
      shouldShowAssigneeUmgengnissamningurScreen(
        answersWithMissingChild,
        baseExternalData,
        null,
      ),
    ).toBe(false)
  })

  it('is shown when a household minor still needs an access agreement', () => {
    expect(
      shouldShowAssigneeUmgengnissamningurScreen(
        answersWithMissingChild,
        baseExternalData,
        assigneeUser,
      ),
    ).toBe(true)
  })

  it('stays shown after this assignee uploads a file for that minor', () => {
    expect(
      shouldShowAssigneeUmgengnissamningurScreen(
        answersWithUpload,
        baseExternalData,
        assigneeUser,
      ),
    ).toBe(true)
  })

  it('keeps repeater min/max rows at 1 after upload so fields are not collapsed', () => {
    expect(
      assigneeAccessAgreementRepeaterMinRows(
        answersWithUpload,
        baseExternalData,
      ),
    ).toBe(1)
    expect(
      assigneeAccessAgreementRepeaterMaxRows(
        answersWithUpload,
        baseExternalData,
      ),
    ).toBe(1)
  })

  it('is hidden when the minor is already in the applicant’s custody', () => {
    expect(
      shouldShowAssigneeUmgengnissamningurScreen(
        answersWithMissingChild,
        custodyExternalData,
        assigneeUser,
      ),
    ).toBe(false)
  })
})

describe('overview titles', () => {
  it('passes household member count 1 for Heimilismaður', () => {
    const result = householdMembersOverviewTitle(
      asApplication({
        householdMembersTableRepeater: [
          {
            nationalIdWithName: {
              nationalId: ASSIGNEE_ID,
              name: 'Anna Assignee',
            },
          },
        ],
      }),
    )

    expect(result.values.count).toBe(1)
  })

  it('passes household member count 2 for Heimilismenn', () => {
    const result = householdMembersOverviewTitle(
      asApplication({
        householdMembersTableRepeater: householdRepeater,
      }),
    )

    expect(result.values.count).toBe(2)
  })

  it('counts one main-form access agreement with a file', () => {
    const answers = {
      householdMembersTableRepeater: householdRepeater,
      mainFormAccessAgreementRepeater: uploadedRepeater,
    } as FormValue
    const result = mainFormAccessAgreementOverviewTitle(asApplication(answers))

    expect(result.values.count).toBe(1)
    expect(
      mainFormAccessAgreementOverviewAttachments(answers, baseExternalData),
    ).toHaveLength(1)
  })

  it('counts two main-form access agreements', () => {
    const secondChild = kennitala.generatePerson(new Date(2019, 2, 1))
    const result = mainFormAccessAgreementOverviewTitle(
      asApplication({
        householdMembersTableRepeater: householdRepeater,
        mainFormAccessAgreementRepeater: [
          ...uploadedRepeater,
          {
            childNationalId: secondChild,
            file: [{ key: 'file-2', name: 'samningur-2.pdf' }],
          },
        ],
      }),
    )

    expect(result.values.count).toBe(2)
  })
})

describe('access agreement attachments on overview', () => {
  it('finds assignee uploads even when overview attachments are not given a user national id', () => {
    const files = assigneeAccessAgreementOverviewAttachments(
      answersWithUpload,
      baseExternalData,
    )

    expect(files).toHaveLength(1)
    expect(files[0].fileName).toContain('umgengnissamningur.pdf')
    expect(files[0].fileName).toContain('Kalli Kid')
  })

  it('lists signed-assignee uploads for the applicant household overview', () => {
    const files = signedAssigneesAccessAgreementOverviewAttachments(
      answersWithSignedUpload,
      baseExternalData,
    )

    expect(files).toHaveLength(1)
    expect(files[0].fileName).toContain('Anna Assignee')
    expect(files[0].fileName).toContain('Kalli Kid')
    expect(files[0].fileName).toContain('umgengnissamningur.pdf')
  })

  it('passes signed-assignee attachment count to the overview title', () => {
    const result = signedAssigneesAccessAgreementOverviewTitle(
      asApplication(answersWithSignedUpload),
    )

    expect(result.values.count).toBe(1)
  })

  it('returns no signed-assignee attachments when nobody uploaded', () => {
    expect(
      signedAssigneesAccessAgreementOverviewAttachments(
        answersWithMissingChild,
        baseExternalData,
      ),
    ).toEqual([])
  })
})

describe('assignee waiting markdown lists', () => {
  const waitingAnswers = {
    applicant: { name: 'Palli Applicant' },
    householdMembersTableRepeater: householdRepeater,
  } as FormValue

  it('formats approved names as sibling markdown bullets', () => {
    const result = assigneeWaitingApprovedDescription(
      asApplication({
        ...waitingAnswers,
        signedAssignees: [ASSIGNEE_ID],
      }),
    )

    expect(result.values.names).toBe('* Palli Applicant\n\n* Anna Assignee')
  })

  it('formats pending names as sibling markdown bullets', () => {
    const result = assigneeWaitingPendingDescription(
      asApplication(waitingAnswers),
    )

    expect(result.values.names).toBe('* Anna Assignee')
  })

  it('uses an em dash when nobody is pending', () => {
    const result = assigneeWaitingPendingDescription(
      asApplication({
        ...waitingAnswers,
        signedAssignees: [ASSIGNEE_ID],
      }),
    )

    expect(result.values.names).toBe('—')
  })

  it('formats rejected names as sibling markdown bullets', () => {
    const result = assigneeWaitingRejectedDescription(
      asApplication({
        ...waitingAnswers,
        rejectedAssignees: [ASSIGNEE_ID],
      }),
    )

    expect(result.values.names).toBe('* Anna Assignee')
  })
})
