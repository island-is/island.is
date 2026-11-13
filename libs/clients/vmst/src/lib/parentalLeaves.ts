import {
  ParentalLeaveFromJSON,
  ParentalLeaveGetFromJSON,
} from '../../gen/fetch'
import type {
  Application14,
  ParentalLeave,
  ParentalLeaveApi,
  ParentalLeaveGet,
  PensionFund,
  Union,
} from '../../gen/fetch'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** The leaves list sends dates as `YYYYMMDD`; the rest of the API uses `YYYY-MM-DD`. */
export const toIsoDate = (value?: string | null): string => {
  const date = (value ?? '').trim()

  return /^\d{8}$/.test(date)
    ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
    : date
}

const amount = (value?: string | null) => Number(value) || 0

const toParentalLeave = (
  applicant: ParentalLeaveGet,
  leave: Application14,
): ParentalLeave => {
  const children = leave.children ?? []
  const periods = (leave.periods ?? []).map((period) => ({
    ...period,
    rightsCodePeriod: period.rightsCodePeriod || period.rightUnt || null,
  }))
  const caseNumber = leave.applicationId ?? ''

  return {
    // The list identifies a leave by VMST's case number
    applicationId: caseNumber,
    applicationFundId: caseNumber,
    applicant: applicant.nationalRegistryId ?? '',
    otherParentId: leave.otherParentId || null,
    expectedDateOfBirth: toIsoDate(children[0]?.expectedDateOfBirth) || null,
    dateOfBirth: toIsoDate(children[0]?.dateOfBirth) || null,
    email: applicant.email ?? '',
    phoneNumber: applicant.phoneNumber ?? '',
    paymentInfo: {
      bankAccount: applicant.paymentInfo?.bankAccount ?? '',
      personalAllowance: amount(applicant.personalAllowance),
      personalAllowanceFromSpouse: amount(
        applicant.personalAllowanceFromSpouse,
      ),
      union: applicant.union as Union,
      pensionFund: applicant.pensionFund as PensionFund,
      privatePensionFund: applicant.privatePensionFund as PensionFund,
      privatePensionFundRatio: amount(
        applicant.privatePensionFund?.privatePensionFundPercentage,
      ),
    },
    periods,
    // The list's employers carry only an id, not who to contact
    employers: [],
    status: leave.status || null,
    rightsCode:
      periods[0]?.rightUnt ||
      // The list leaves `rightsUnit` empty and sends the code here
      leave.applicationRights?.[0]?.applicationRigthUnitCode ||
      leave.applicationRights?.[0]?.rightsUnit ||
      '',
    applicationRights: leave.applicationRights,
    noOfChildren: children.length > 1 ? String(children.length) : null,
    language: leave.language || null,
    otherParentBlocked: leave.otherParentBlocked === 'true',
  }
}

/**
 * The leaves in the body of VMST's `GET /users/{nationalRegistryId}/parental-leaves`,
 * in the shape the rest of the code works with. Reads both shapes the endpoint
 * has had: one item per applicant with their leaves in `applications`, as VMST
 * documents it now, and the older one item per leave.
 *
 * Throws on an item in neither shape. Reading it as no leaves would offer a
 * first application for a child VMST already holds one for.
 */
export const toParentalLeaves = (body: unknown): ParentalLeave[] => {
  const items = isRecord(body) ? body.parentalLeaves ?? [] : body

  if (!Array.isArray(items)) {
    throw new Error('Unrecognised parental leaves response from VMST')
  }

  return items.flatMap((item): ParentalLeave[] => {
    if (
      isRecord(item) &&
      ('applications' in item || 'nationalRegistryId' in item)
    ) {
      const applicant = ParentalLeaveGetFromJSON(item)

      return (applicant.applications ?? []).map((leave) =>
        toParentalLeave(applicant, leave),
      )
    }

    if (isRecord(item) && typeof item.applicationId === 'string') {
      // Required by the spec, so parsed without a check for missing ones
      const leave = ParentalLeaveFromJSON({
        ...item,
        periods: item.periods ?? [],
        employers: item.employers ?? [],
      })

      return [
        {
          ...leave,
          expectedDateOfBirth: toIsoDate(leave.expectedDateOfBirth) || null,
          dateOfBirth: toIsoDate(leave.dateOfBirth) || null,
          adoptionDate: toIsoDate(leave.adoptionDate) || undefined,
        },
      ]
    }

    throw new Error('Unrecognised parental leaves response from VMST')
  })
}

/**
 * The applicant's leaves from VMST. The body is read before the generated
 * client parses it, which would drop the fields of the older shape.
 */
export const fetchParentalLeaves = async (
  api: ParentalLeaveApi,
  nationalRegistryId: string,
): Promise<ParentalLeave[]> => {
  const response = await api.parentalLeaveGetParentalLeavesRaw({
    nationalRegistryId,
  })

  return toParentalLeaves(await response.raw.json())
}
