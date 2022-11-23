import React from 'react'
import {
  currentMonth,
  getNextPeriod,
} from '@island.is/financial-aid/shared/lib'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { aboutSpouseForm } from '../../lib/messages'
import { DescriptionText, PrivacyPolicyAccordion } from '..'
import { FAFieldBaseProps } from '../../lib/types'
import withLogo from '../Logo/Logo'

const AboutSpouseForm = ({ application }: FAFieldBaseProps) => {
  const { lang } = useLocale()
  const { nationalRegistry, municipality } = application.externalData

  return (
    <>
      <DescriptionText
        textProps={{ variant: 'h3', fontWeight: 'light', marginTop: 2 }}
        text={aboutSpouseForm.general.description}
        format={{
          spouseName: nationalRegistry.data.fullName,
          currentMonth: currentMonth(lang),
          nextMonth: getNextPeriod(lang).month,
        }}
      />
      <Box marginTop={5}>
        <PrivacyPolicyAccordion
          municipalityPageUrl={municipality.data?.homepage}
        />
      </Box>
    </>
  )
}

export default withLogo(AboutSpouseForm)
