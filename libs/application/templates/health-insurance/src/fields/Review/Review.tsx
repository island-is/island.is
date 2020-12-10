import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'

import FormerInsurance from './FormerInsurance'
import StatusAndChildren from './StatusAndChildren'
import ContactInfo from './ContactInfo'

const Review: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[1, 1, 3]}>
      <Accordion singleExpand={false}>
        <AccordionItem
          id="id_1"
          label={formatText(m.applicantInfoSection, application, formatMessage)}
        >
          <ContactInfo application={application} field={field} />
        </AccordionItem>
        <AccordionItem
          id="id_2"
          label={formatText(m.statusAndChildren, application, formatMessage)}
        >
          <StatusAndChildren application={application} field={field} />
        </AccordionItem>
        <AccordionItem
          id="id_3"
          label={formatText(
            m.formerCountryOfInsuranceTitle,
            application,
            formatMessage,
          )}
        >
          <FormerInsurance application={application} field={field} />
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export default Review
