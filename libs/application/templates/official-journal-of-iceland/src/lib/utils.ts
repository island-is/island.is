import addDays from 'date-fns/addDays'
import addYears from 'date-fns/addYears'
import { z } from 'zod'
import {
  committeeSignatureSchema,
  memberItemSchema,
  partialSchema,
  regularSignatureItemSchema,
  regularSignatureSchema,
} from './dataSchema'
import { getValueViaPath } from '@island.is/application/core'
import { InputFields, OJOIApplication, RequiredInputFieldsNames } from './types'
import { HTMLText } from '@island.is/regulations-tools/types'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { SignatureTypes, OJOI_DF, FAST_TRACK_DAYS } from './constants'
import { MessageDescriptor } from 'react-intl'

export const countDaysAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  return Math.floor(diff / (1000 * 3600 * 24))
}

const isWeekday = (date: Date) => {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

export const getWeekendDates = (
  startDate = new Date(),
  endDate = addYears(new Date(), 1),
) => {
  const weekdays = []
  let currentDay = startDate
  while (currentDay <= endDate) {
    if (!isWeekday(currentDay)) {
      weekdays.push(currentDay)
    }
    currentDay = addDays(currentDay, 1)
  }
  return weekdays
}

export const addWeekdays = (date: Date, days: number) => {
  let result = new Date(date)
  while (days > 0) {
    result = addDays(result, 1)
    if (isWeekday(result)) {
      days--
    }
  }
  return result
}

export const getNextAvailableDate = (date: Date): Date => {
  if (isWeekday(date)) {
    return date
  }
  return getNextAvailableDate(addDays(date, 1))
}

export const getEmptyMember = () => ({
  name: '',
  above: '',
  after: '',
  before: '',
  below: '',
})

export const getRegularSignature = (
  signatureCount: number,
  memberCount: number,
) =>
  Array.from({ length: signatureCount }).map(() => ({
    institution: '',
    date: '',
    members: Array.from({ length: memberCount }).map(() => getEmptyMember()),
    html: '',
  }))

export const getCommitteeSignature = (
  memberCount: number,
): z.infer<typeof committeeSignatureSchema> => ({
  institution: '',
  date: '',
  chairman: getEmptyMember(),
  members: Array.from({ length: memberCount }).map(() => getEmptyMember()),
  html: '',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSignatureDefaultValues = (signature: any, index?: number) => {
  if (signature === undefined) {
    return { institution: '', date: '' }
  }

  const isRegularSignature = regularSignatureSchema.safeParse(signature)

  if (isRegularSignature.success) {
    if (index === undefined) {
      return { institution: '', date: '' }
    }

    const { data } = isRegularSignature

    if (data === undefined) {
      return { institution: '', date: '' }
    }

    return {
      institution: data[index].institution,
      date: data[index].date,
    }
  }

  return { institution: signature.institution, date: signature.date }
}

export const isRegularSignature = (
  any: unknown,
): any is z.infer<typeof regularSignatureSchema> =>
  regularSignatureSchema.safeParse(any).success

export const isCommitteeSignature = (
  any: unknown,
): any is z.infer<typeof committeeSignatureSchema> =>
  committeeSignatureSchema.safeParse(any).success

export const getCommitteeAnswers = (answers: OJOIApplication['answers']) => {
  const currentAnswers = structuredClone(answers)
  const signature = getValueViaPath(
    currentAnswers,
    InputFields.signature.committee,
  )

  if (isCommitteeSignature(signature)) {
    return {
      currentAnswers,
      signature,
    }
  }

  return {
    currentAnswers,
    signature: null,
  }
}

export const getRegularAnswers = (answers: OJOIApplication['answers']) => {
  const currentAnswers = structuredClone(answers)
  const signature = getValueViaPath(
    currentAnswers,
    InputFields.signature.regular,
  )

  if (isRegularSignature(signature)) {
    return {
      currentAnswers,
      signature,
    }
  }

  return {
    currentAnswers,
    signature: null,
  }
}

const getMembersMarkup = (member: z.infer<typeof memberItemSchema>) => {
  if (!member.name) return ''

  const styleObject = {
    marginBottom: member.below ? '0' : '1.5em',
  }

  const aboveMarkup = member.above
    ? `<p style="margin-bottom: 0;" align="center">${member.above}</p>`
    : ''
  const afterMarkup = member.after ? ` ${member.after}` : ''
  const belowMarkup = member.below
    ? `<p align="center">${member.below}</p>`
    : ''

  return `
    <div class="signature__member" style="margin-bottom: 1.5em;">
      ${aboveMarkup}
      <p style="margin-bottom: ${styleObject.marginBottom}" align="center"><strong>${member.name}</strong>${afterMarkup}</p>
      ${belowMarkup}
    </div>
  `
}

const signatureTemplate = (
  signatures: z.infer<typeof regularSignatureSchema>,
  additionalSignature?: string,
  chairman?: z.infer<typeof memberItemSchema>,
) => {
  const markup = signatures
    ?.map((signature) => {
      const membersCount = signature?.members?.length || 0

      const styleObject = {
        display: membersCount > 1 ? 'grid' : 'block',
        gridTemplateColumns:
          membersCount === 1
            ? '1fr'
            : membersCount === 3
            ? '1fr 1fr 1fr'
            : '1fr 1fr',
      }

      const date = signature.date
        ? format(new Date(signature.date), OJOI_DF, { locale: is })
        : ''

      const chairmanMarkup = chairman
        ? `<div style="margin-bottom: 1.5em;">${getMembersMarkup(
            chairman,
          )}</div>`
        : ''

      const membersMarkup = signature.members
        ?.map((member) => getMembersMarkup(member))
        .join('')

      return `
  <div class="signature">
    <p align="center"><em>${signature.institution} ${date}</em></p>
    ${chairmanMarkup}
    <div style="margin-bottom: 1.5em; display: ${styleObject.display}; grid-template-columns: ${styleObject.gridTemplateColumns};" class="signature__content">
    ${membersMarkup}
    </div>
  </div>
  `
    })
    .join('')

  const additionalMarkup = additionalSignature
    ? `<p style="font-size: 16px;" align="right"><em>${additionalSignature}</em></p>`
    : ''

  return `${markup}${additionalMarkup}` as HTMLText
}

export const getSignaturesMarkup = ({
  signatures,
  type,
}: {
  signatures: z.infer<typeof partialSchema>['signatures']
  type: SignatureTypes
}): HTMLText => {
  if (signatures === undefined) {
    return ''
  }

  if (
    type === SignatureTypes.REGULAR &&
    isRegularSignature(signatures.regular)
  ) {
    return signatureTemplate(
      signatures.regular,
      signatures.additionalSignature?.regular,
    )
  }

  if (
    type === SignatureTypes.COMMITTEE &&
    isCommitteeSignature(signatures.committee)
  ) {
    return signatureTemplate(
      [signatures.committee],
      signatures.additionalSignature?.committee,
      signatures.committee.chairman,
    )
  }

  return ''
}

export const getAdvertMarkup = ({
  type,
  title,
  html,
}: {
  type?: string
  title?: string
  html?: string
}) => {
  const typeMarkup = type
    ? `<p align="center" style="margin-bottom: 0;">${type.toUpperCase()}</p>`
    : ''
  const titleMarkup = title
    ? `<p align="center"><strong>${title}</strong></p>`
    : ''

  const htmlMarkup = html ? html : ''

  return `
    <div class="advert">
      ${typeMarkup}
      ${titleMarkup}
      ${htmlMarkup}
    </div>
  ` as HTMLText
}

export const parseZodIssue = (issue: z.ZodCustomIssue) => {
  const path = issue.path.join('.')
  return {
    name: getValueViaPath(RequiredInputFieldsNames, path) as string,
    message: issue?.params as MessageDescriptor,
  }
}

export const getSingleSignatureMarkup = (
  signature: z.infer<typeof regularSignatureItemSchema>,
  additionalSignature?: string,
  chairman?: z.infer<typeof memberItemSchema>,
) => {
  return signatureTemplate([signature], additionalSignature, chairman)
}

export const getFastTrack = (date?: Date) => {
  const now = new Date()
  if (!date)
    return {
      fastTrack: false,
      now,
    }

  const diff = date.getTime() - now.getTime()
  const diffDays = diff / (1000 * 3600 * 24)
  let fastTrack = false

  if (diffDays <= FAST_TRACK_DAYS) {
    fastTrack = true
  }
  return {
    fastTrack,
    now,
  }
}
