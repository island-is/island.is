import React from 'react'
import {
  currentMonth,
  months,
  nextMonth,
} from '@island.is/financial-aid/shared/lib'
import { Box } from '@island.is/island-ui/core'
import { aboutSpouseForm } from '../../lib/messages'
import { DescriptionText, PrivacyPolicyAccordion } from '..'

const AboutSpouseForm = () => {
  // TODO
  // - get spouse name
  // - send correct props to accordion

  return (
    <>
      <DescriptionText
        textProps={{ variant: 'h3', fontWeight: 'light', marginTop: 2 }}
        text={aboutSpouseForm.general.description}
        format={{
          spouseName: 'Nafn',
          currentMonth: currentMonth(),
          nextMonth: months[nextMonth()],
        }}
      />
      <Box marginTop={5}>
        <PrivacyPolicyAccordion
          municipalityPageName="reykjavik.is"
          municipalityPageUrl="https://reykjavik.is/"
        />
      </Box>
    </>
  )
}

export default AboutSpouseForm
