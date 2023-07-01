import React, { FC } from 'react'
import { complaint, info } from '../../lib/messages'
import { DataProtectionComplaint } from '../../lib/dataSchema'
import { SectionHeading, ValueLine, ValueList } from './Shared'
import { ComplaineeTable } from '../ComplaineeRepeater/ComplaineeTable'
import { FormatMessage, useLocale } from '@island.is/localization'
import {
  SubjectOfComplaint,
  subjectOfComplaintValueLabelMapper,
} from '../../shared'

export const Applicant: FC<
  React.PropsWithChildren<{ answers: DataProtectionComplaint }>
> = ({ answers }) => (
  <>
    <SectionHeading title={info.general.applicantPageTitle} />
    <ValueLine label={info.labels.name} value={answers.applicant.name} />
    <ValueLine
      label={info.labels.nationalId}
      value={answers.applicant.nationalId}
    />
    <ValueLine label={info.labels.address} value={answers.applicant.address} />
    <ValueLine
      label={info.labels.postalCode}
      value={answers.applicant.postalCode}
    />
    <ValueLine label={info.labels.city} value={answers.applicant.city} />
    {answers.applicant.email && (
      <ValueLine label={info.labels.email} value={answers.applicant.email} />
    )}
    {answers.applicant.phoneNumber && (
      <ValueLine
        label={info.labels.tel}
        value={answers.applicant.phoneNumber}
      />
    )}
  </>
)

export const OrganizationOrInstitution: FC<
  React.PropsWithChildren<{
    answers: DataProtectionComplaint
  }>
> = ({ answers }) => (
  <>
    <SectionHeading title={info.general.organizationOrInstitutionPageTitle} />
    <ValueLine
      label={info.labels.organizationOrInstitutionName}
      value={answers.organizationOrInstitution.name}
    />
    <ValueLine
      label={info.labels.nationalId}
      value={answers.organizationOrInstitution.nationalId}
    />
    <ValueLine
      label={info.labels.address}
      value={answers.organizationOrInstitution.address}
    />
    <ValueLine
      label={info.labels.postalCode}
      value={answers.organizationOrInstitution.postalCode}
    />
    <ValueLine
      label={info.labels.city}
      value={answers.organizationOrInstitution.city}
    />
    {answers.organizationOrInstitution.email && (
      <ValueLine
        label={info.labels.email}
        value={answers.organizationOrInstitution.email}
      />
    )}
    {answers.organizationOrInstitution.phoneNumber && (
      <ValueLine
        label={info.labels.tel}
        value={answers.organizationOrInstitution.phoneNumber}
      />
    )}
  </>
)

export const Commissions: FC<
  React.PropsWithChildren<{ answers: DataProtectionComplaint }>
> = ({ answers }) => (
  <>
    <SectionHeading title={info.general.commissionsPageTitle} />
    <ValueList
      label={info.labels.commissionDocuments}
      list={answers.commissions.documents.map((x) => x.name)}
    />
    {answers.commissions.persons.map((person, index) => (
      <div key={index}>
        <ValueLine
          label={info.labels.commissionsPerson}
          value={`${person.name} - ${person.nationalId}`}
        />
      </div>
    ))}
  </>
)

export const Complainees: FC<
  React.PropsWithChildren<{ answers: DataProtectionComplaint }>
> = ({ answers }) => (
  <>
    <SectionHeading title={complaint.general.complaineePageTitle} />
    {answers.complainees?.map((complainee, index) => (
      <ComplaineeTable {...complainee} key={index} />
    ))}
  </>
)

const GenerateComplaintList = (
  answers: DataProtectionComplaint,
  formatMessage: FormatMessage,
) => {
  if (
    answers.subjectOfComplaint.values === undefined ||
    answers.subjectOfComplaint?.values?.length === 0
  ) {
    return []
  }
  const complaintData = []
  // Render it in the same order as shown on the application it self
  for (const [key] of Object.entries(subjectOfComplaintValueLabelMapper)) {
    // Check if the option was selected by the user
    const selected = answers.subjectOfComplaint.values.find((x) => x === key)
    if (!selected) continue

    complaintData.push(
      `${formatMessage(
        subjectOfComplaintValueLabelMapper[
          key as keyof typeof subjectOfComplaintValueLabelMapper
        ],
      )}${
        key === SubjectOfComplaint.OTHER
          ? `: ${answers.subjectOfComplaint.somethingElse}`
          : ''
      }`,
    )
  }
  return complaintData
}

export const Complaint: FC<
  React.PropsWithChildren<{ answers: DataProtectionComplaint }>
> = ({ answers }) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <SectionHeading title={complaint.general.complaintPageTitle} />
      {answers.subjectOfComplaint.values &&
      answers.subjectOfComplaint.values.length > 0 ? (
        <ValueList
          label={complaint.general.subjectOfComplaintPageTitle}
          list={GenerateComplaintList(answers, formatMessage)}
        />
      ) : null}
      <ValueLine
        label={complaint.labels.complaintDescriptionLabel}
        value={answers.complaint.description}
      />
      <ValueList
        label={complaint.labels.complaintDocumentsTitle}
        list={answers.complaint.documents.map((x) => x.name)}
      />
    </>
  )
}
