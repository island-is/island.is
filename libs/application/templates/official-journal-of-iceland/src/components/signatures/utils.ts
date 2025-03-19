import { SpanType } from '@island.is/island-ui/core/types'
import { hyphenateText } from '@island.is/island-ui/core'
import {
  SignatureMemberSchema,
  SignatureRecordSchema,
  SignatureSchema,
} from '../../lib/dataSchema'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

export const full: SpanType = ['9/9', '9/9', '8/9']
export const half: SpanType = ['9/9', '9/9', '4/9']
export const fraction: SpanType = ['9/9', '9/9', '1/9']

export const getEmptySignatureMember = () => {
  const member: SignatureMemberSchema = {
    above: '',
    name: '',
    after: '',
    below: '',
  }

  return member
}

export const getEmptyRecord = (regular = true): SignatureRecordSchema => {
  const record: SignatureRecordSchema = {
    institution: '',
    signatureDate: '',
    additional: '',
    chairman: regular ? undefined : getEmptySignatureMember(),
    members: [getEmptySignatureMember()],
  }

  return record
}

export const getEmptySignature = (regular = true): SignatureSchema => {
  const record = getEmptyRecord(regular)

  const fallBackSignature: SignatureSchema = {
    records: [record],
  }

  return fallBackSignature
}

const memberTemplate = (member: SignatureMemberSchema) => {
  const styleObject = {
    marginBottom: member?.below ? '0' : '1.5em',
  }

  const name = hyphenateText(member?.name ?? '', { minLeft: 4, minRight: 4 })
  const above = hyphenateText(member?.above ?? '', { minLeft: 4, minRight: 4 })
  const after = hyphenateText(member?.after ?? '', { minLeft: 4, minRight: 4 })
  const below = hyphenateText(member?.below ?? '', { minLeft: 4, minRight: 4 })

  const aboveMarkup = above
    ? `<p style="margin-bottom: 0;" align="center">${above}</p>`
    : ''
  const afterMarkup = after ? ` ${after}` : ''
  const belowMarkup = below ? `<p align="center">${below}</p>` : ''

  return `
    <div class="signature__member">
      ${aboveMarkup}
      <p style="margin-bottom: ${styleObject.marginBottom}" align="center"><strong>${name}</strong>${afterMarkup}</p>
      ${belowMarkup}
    </div>
  `
}

const signatureRecordTemplate = (record: SignatureRecordSchema) => {
  const membersCount = record.members?.length ?? 0

  const styleObject = {
    display: membersCount > 1 ? 'grid' : 'block',
    gridTemplateColumns:
      membersCount === 1
        ? '1fr'
        : membersCount === 3
        ? '1fr 1fr 1fr'
        : '1fr 1fr',
    rowGap: '1.5em',
  }

  const formattedDate = record.signatureDate
    ? format(new Date(record.signatureDate), 'd. MMMM yyyy.', {
        locale: is,
      })
    : ''

  const chairmanMarkup = record.chairman
    ? `<div style="margin-bottom: 1.5em;">${memberTemplate(
        record.chairman,
      )}</div>`
    : ''

  const membersMarkup =
    record.members?.map((member) => memberTemplate(member)).join('') ?? ''

  const additionalMarkup = record.additional
    ? `<p style="margin-top: 1.5em;" align="right" text-a><em>${record.additional}</em></p>`
    : ''

  return `
      <div class="signature" style="margin-bottom: 1.5em;">
        <p align="center"><em>${record.institution} <span class="signature__date">${formattedDate}</span></em></p>
        ${chairmanMarkup}
        <div style="display: ${styleObject.display}; grid-template-columns: ${styleObject.gridTemplateColumns}; row-gap: ${styleObject.rowGap};" class="signature__content">
        ${membersMarkup}
        </div>
        ${additionalMarkup}
      </div>`
}

export const signatureTemplate = (signature: SignatureSchema) => {
  const recordsMarkup =
    signature.records
      ?.map((record) => signatureRecordTemplate(record))
      .join('') ?? ''

  return recordsMarkup
}
