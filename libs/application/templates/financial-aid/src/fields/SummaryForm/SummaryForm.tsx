import React from 'react'
import { Text, Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
import { aboutForm } from '../../lib/messages'
import { useIntl } from 'react-intl'

import { currentMonth } from '@island.is/financial-aid/shared/lib'
import { DescriptionText } from '..'

const SummaryForm = () => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        Áætluð aðstoð (til útgreiðslu í byrjun júní)
      </Text>
      <Text>
        Athugaðu að þessi útreikningur er eingöngu til viðmiðunar og gerir ekki
        ráð fyrir tekjum eða gögnum úr skattframtali sem geta haft áhrif á þína
        aðstoð. Þú færð skilaboð þegar frekari útreikningur liggur fyrir.
      </Text>
    </>
  )
}

export default SummaryForm
