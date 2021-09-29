import React, { FC } from 'react'
import { complaint, info } from '../../lib/messages'
import { DataProtectionComplaint } from '../../lib/dataSchema'
import { SectionHeading, ValueLine } from './Shared'
import { ComplaineeTable } from '../ComplaineeRepeater/ComplaineeTable'
import { useLocale } from '@island.is/localization'
import { subjectOfComplaintValueLabelMapper } from '../../shared'

export const Applicant: FC<{ answers: DataProtectionComplaint }> = ({
  answers,
}) => (
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

export const OrganizationOrInstitution: FC<{
  answers: DataProtectionComplaint
}> = ({ answers }) => (
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

export const Commissions: FC<{ answers: DataProtectionComplaint }> = ({
  answers,
}) => (
  <>
    <SectionHeading title={info.general.commissionsPageTitle} />
    <ValueLine
      label={info.labels.commissionDocuments}
      value={answers.commissions.documents.map((x) => x.name).join(', ')}
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

export const Complainees: FC<{ answers: DataProtectionComplaint }> = ({
  answers,
}) => (
  <>
    <SectionHeading title={complaint.general.complaineePageTitle} />
    {answers.complainees?.map((complainee, index) => (
      <ComplaineeTable {...complainee} key={index} />
    ))}
  </>
)

export const Complaint: FC<{ answers: DataProtectionComplaint }> = ({
  answers,
}) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <SectionHeading title={complaint.general.complaintPageTitle} />
      <ValueLine
        label={complaint.general.subjectOfComplaintPageTitle}
        value={
          answers.subjectOfComplaint.values
            ?.map((x) =>
              formatMessage(
                subjectOfComplaintValueLabelMapper[
                  x as keyof typeof subjectOfComplaintValueLabelMapper
                ],
              ),
            )
            .join(', ') || ''
        }
      />
      {answers.subjectOfComplaint.somethingElse && (
        <ValueLine
          label={complaint.labels.subjectOtherOther}
          value={answers.subjectOfComplaint.somethingElse}
        />
      )}
      <ValueLine
        label={complaint.labels.complaintDescriptionLabel}
        value={answers.complaint.description}
      />
      <ValueLine
        label={complaint.labels.complaintDocumentsTitle}
        value={answers.complaint.documents.map((x) => x.name).join(', ')}
      />
    </>
  )
}
