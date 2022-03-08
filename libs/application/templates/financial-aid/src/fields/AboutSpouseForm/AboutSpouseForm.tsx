import React from 'react'
import {
  currentMonth,
  months,
  nextMonth,
} from '@island.is/financial-aid/shared/lib'
import { Box } from '@island.is/island-ui/core'
import { aboutSpouseForm } from '../../lib/messages'
import { DescriptionText, PrivacyPolicyAccordion } from '..'
import { FAFieldBaseProps } from '../../lib/types'

const AboutSpouseForm = ({ application }: FAFieldBaseProps) => {
  const { data } = application.externalData.nationalRegistry

  return (
    <>
      <DescriptionText
        textProps={{ variant: 'h3', fontWeight: 'light', marginTop: 2 }}
        text={aboutSpouseForm.general.description}
        format={{
          spouseName: data.applicant.fullName,
          currentMonth: currentMonth(),
          nextMonth: months[nextMonth()],
        }}
      />
      <Box marginTop={5}>
        <PrivacyPolicyAccordion
          municipalityPageUrl={data.municipality.homepage || ''}
        />
      </Box>
    </>
  )
}

export default AboutSpouseForm
