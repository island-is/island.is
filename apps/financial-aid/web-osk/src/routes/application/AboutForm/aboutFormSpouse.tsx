import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import { currentMonth } from '@island.is/financial-aid/shared/lib'

const AboutFormSpouse = () => {
  return (
    <>
      <Text as="h1" variant="h2" marginBottom={2}>
        Umsókn um fjárhagsaðstoð
      </Text>

      <Text variant="intro" fontWeight="light" marginBottom={2}>
        Maki þinn (Elísabet) hefur sótt um{' '}
        <strong>fjárhagsaðstoð hjá Hafnarfjarðarbæ</strong> fyrir{' '}
        {currentMonth()} mánuð.
      </Text>

      <Text variant="intro" fontWeight="light" marginBottom={3}>
        Svo hægt sé að klára umsóknina þurfum við að fá þig til að hlaða upp{' '}
        <strong>tekju- og skattagögnum</strong> til að reikna út fjárhagsaðstoð
        til útgreiðslu í byrjun október.
      </Text>

      <Box marginBottom={5}></Box>
    </>
  )
}

export default AboutFormSpouse
