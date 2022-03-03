import React, { useContext } from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  currentMonth,
  months,
  nextMonth,
} from '@island.is/financial-aid/shared/lib'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import { PrivacyPolicyAccordion } from '@island.is/financial-aid-web/osk/src/components'

const AboutFormSpouse = () => {
  const { user } = useContext(AppContext)

  return (
    <>
      <Text as="h1" variant="h2" marginBottom={2}>
        Umsókn um fjárhagsaðstoð
      </Text>

      <Text variant="intro" fontWeight="light" marginBottom={2}>
        Maki þinn ({user?.spouse?.applicantName}) hefur sótt um fjárhagsaðstoð
        fyrir {currentMonth()} mánuð.
      </Text>

      <Text variant="intro" fontWeight="light" marginBottom={3}>
        Svo hægt sé að klára umsóknina þurfum við að fá þig til að hlaða upp{' '}
        <strong>tekjugögnum</strong> til að reikna út fjárhagsaðstoð til
        útgreiðslu í byrjun {months[nextMonth()]}.
      </Text>

      <PrivacyPolicyAccordion municipalityHomePage={undefined} />
    </>
  )
}

export default AboutFormSpouse
