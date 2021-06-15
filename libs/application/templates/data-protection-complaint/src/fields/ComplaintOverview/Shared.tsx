import React, { FC } from 'react'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { complaint, info, sharedFields } from '../../lib/messages'
import { OnBehalf } from '../../lib/dataSchema'
import { NO, SubjectOfComplaint, YES } from '../../shared'
import { MessageDescriptor } from '@formatjs/intl'

export const onBehalfValueLabelMapper = {
  [OnBehalf.MYSELF]: info.labels.myself,
  [OnBehalf.MYSELF_AND_OR_OTHERS]: info.labels.myselfAndOrOthers,
  [OnBehalf.OTHERS]: info.labels.others,
  [OnBehalf.ORGANIZATION_OR_INSTITUTION]: info.labels.organizationInstitution,
}

export const yesNoValueLabelMapper = {
  [YES]: sharedFields.yes,
  [NO]: sharedFields.no,
}

export const subjectOfComplaintValueLabelMapper = {
  [SubjectOfComplaint.WITH_AUTHORITIES]: complaint.labels.subjectAuthorities,
  [SubjectOfComplaint.LACK_OF_EDUCATION]:
    complaint.labels.subjectLackOfEducation,
  [SubjectOfComplaint.SOCIAL_MEDIA]: complaint.labels.subjectSocialMedia,
  [SubjectOfComplaint.REQUEST_FOR_ACCESS]:
    complaint.labels.subjectRequestForAccess,
  [SubjectOfComplaint.RIGHTS_OF_OBJECTION]:
    complaint.labels.subjectRightOfObjection,
  [SubjectOfComplaint.EMAIL]: complaint.labels.subjectEmail,
  [SubjectOfComplaint.NATIONAL_ID]: complaint.labels.subjectNationalId,
  [SubjectOfComplaint.EMAIL_IN_WORKPLACE]:
    complaint.labels.subjectEmailInWorkplace,
  [SubjectOfComplaint.UNAUTHORIZED_PUBLICATION]:
    complaint.labels.subjectUnauthorizedPublication,
  [SubjectOfComplaint.VANSKILASKRA]: complaint.labels.subjectVanskilaskra,
  [SubjectOfComplaint.VIDEO_RECORDINGS]: complaint.labels.subjectVideoRecording,
  [SubjectOfComplaint.OTHER]: complaint.labels.subjectOther,
}

export const SectionHeading: FC<{ title: string | MessageDescriptor }> = ({
  title,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Text variant="h4" marginTop={4} marginBottom={3}>
      {formatMessage(title)}
    </Text>
  )
}

export const ValueLine: FC<{
  label: string | MessageDescriptor
  value: string | MessageDescriptor
}> = ({ label, value }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h5">{formatMessage(label)}</Text>
      <Text>{formatMessage(value)}</Text>
      <Box paddingY={3}>
        <Divider />
      </Box>
    </>
  )
}
