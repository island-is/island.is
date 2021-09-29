import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  delimitation,
  info,
  overview,
  section,
  externalData,
} from '../../lib/messages'
import { DataProtectionComplaint } from '../../lib/dataSchema'
import { SectionHeading, ValueLine } from './Shared'
import {
  Applicant,
  Commissions,
  Complainees,
  Complaint,
  OrganizationOrInstitution,
} from './Sections'
import { onBehalfValueLabelMapper, yesNoValueLabelMapper } from '../../shared'

export const ComplaintOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const answers = (application as any).answers as DataProtectionComplaint

  const onPrintClick = () => window.print()

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
      <Button
        variant="ghost"
        icon="open"
        iconType="outline"
        onClick={onPrintClick}
      >
        {formatMessage(externalData.labels.printButtonLabel)}
      </Button>
    </Box>
  )
}
