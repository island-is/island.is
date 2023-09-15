import React from 'react'
import { Text } from '@island.is/island-ui/core'
import { getNextPeriod } from '@island.is/financial-aid/shared/lib'
const AboutDataGathering = () => {
  return (
    <>
      <Text marginBottom={3}>
        Við þurfum að afla þessara gagna til að staðfesta hjá hvaða
        sveitarfélagi þú eigir að sækja um fjárhagsaðstoð, einfalda umsóknar- og
        vinnsluferlið og staðfesta réttleika upplýsinga.
      </Text>

      <Text marginBottom={[4, 4, 5]}>
        Við þurfum að fá þig til að renna yfir nokkur atriði varðandi þína
        persónuhagi og fjármál til að reikna út fjárhagsaðstoð til útgreiðslu í
        byrjun {getNextPeriod().month}. Í lok umsóknar getur þú sent hana inn
        eða eytt henni og öllum tengdum gögnum.
      </Text>
    </>
  )
}

export default AboutDataGathering
