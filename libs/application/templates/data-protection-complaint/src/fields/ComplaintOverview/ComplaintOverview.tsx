import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { delimitation, info, overview, section } from '../../lib/messages'
import { DataProtectionComplaint } from '../../lib/dataSchema'
import {
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

export const ComplaintOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const answers = (application as any).answers as DataProtectionComplaint

  return (
    <Box>
      <Text marginTop={2} marginBottom={2}>
        {formatMessage(overview.general.pageDescription)}
      </Text>
      <Accordion dividerOnTop={false} dividerOnBottom={false} space={3}>
        <AccordionItem
          id="id_1"
          label={formatMessage(overview.labels.delimitationAccordionTitle)}
          labelUse="h3"
          labelVariant="h3"
        >
          <Box marginTop={1} marginBottom={3}>
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
          </Box>
        </AccordionItem>
        <AccordionItem
          id="id_2"
          label={formatMessage(overview.labels.infoAccordionTitle)}
          labelUse="h3"
          labelVariant="h3"
        >
          <Box marginTop={1} marginBottom={3}>
            {answers.applicant && <Applicant answers={answers} />}
            {answers.organizationOrInstitution && (
              <OrganizationOrInstitution answers={answers} />
            )}
            {answers.commissions && <Commissions answers={answers} />}
          </Box>
        </AccordionItem>
        <AccordionItem
          id="id_3"
          label={formatMessage(overview.labels.complaineeAccordionTitle)}
          labelUse="h3"
          labelVariant="h3"
        >
          <Box marginTop={1} marginBottom={3}>
            <Complainees answers={answers} />
          </Box>
        </AccordionItem>
        <AccordionItem
          id="id_3"
          label={formatMessage(overview.labels.complaintAccordionTitle)}
          labelUse="h3"
          labelVariant="h3"
        >
          <Box marginTop={1} marginBottom={3}>
            <Complaint answers={answers} />
          </Box>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
