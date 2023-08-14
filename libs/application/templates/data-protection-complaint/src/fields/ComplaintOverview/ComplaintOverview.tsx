import React, { FC, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { delimitation, info, overview, section } from '../../lib/messages'
import { DataProtectionComplaintAnswers } from '../../index'
import {
  SectionHeading,
  ValueLine,
  yesNoValueLabelMapper,
  onBehalfValueLabelMapper,
} from './Shared'
import {
  Applicant,
  Commissions,
  Complainees,
  Complaint,
  OrganizationOrInstitution,
} from './Sections'
import { useFormContext } from 'react-hook-form'
import { getBullets, getExternalData } from './messagesUtils'

export type Bullet = {
  bullet: string
  link: string
  linkText: string
}

export const ComplaintOverview: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { id } = field
  const answers = application.answers as DataProtectionComplaintAnswers
  useEffect(() => {
    // Send message from Contentful to make sure that information on
    // PDF is the same as in the form.
    setValue(`${id}.externalDataMessage`, getExternalData(formatMessage))
    setValue(`${id}.informationMessage.title`, formatMessage(section.agreement))
    setValue(`${id}.informationMessage.bullets`, getBullets(formatMessage))
  }, [setValue])

  return (
    <Box>
      <Text marginTop={2} marginBottom={2}>
        {formatMessage(overview.general.pageDescription)}
      </Text>
      <SectionHeading title={section.info} />
      <ValueLine
        label={info.general.pageTitle}
        value={onBehalfValueLabelMapper[answers.info.onBehalf]}
      />
      <ValueLine
        label={delimitation.labels.inCourtProceedings}
        value={yesNoValueLabelMapper[answers.inCourtProceedings]}
      />
      <ValueLine
        label={delimitation.labels.concernsMediaCoverage}
        value={yesNoValueLabelMapper[answers.concernsMediaCoverage]}
      />
      <ValueLine
        label={delimitation.labels.concernsBanMarking}
        value={yesNoValueLabelMapper[answers.concernsBanMarking]}
      />
      <ValueLine
        label={delimitation.labels.concernsLibel}
        value={yesNoValueLabelMapper[answers.concernsLibel]}
      />
      {answers.applicant && <Applicant answers={answers} />}
      {answers.organizationOrInstitution && (
        <OrganizationOrInstitution answers={answers} />
      )}
      {answers.commissions && <Commissions answers={answers} />}
      <Complainees answers={answers} />
      <Complaint answers={answers} />
    </Box>
  )
}
