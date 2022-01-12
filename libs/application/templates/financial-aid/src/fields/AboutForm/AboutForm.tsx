import React from 'react'
import { Text, Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
import { aboutForm } from '../../lib/messages'
import { useIntl } from 'react-intl'

import { currentMonth } from '@island.is/financial-aid/shared/lib'
import { DescriptionText } from '..'

const AboutForm = () => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(aboutForm.general.description, {
          currentMonth: currentMonth(),
        })}
      </Text>
      <Box marginBottom={3}>
        <DescriptionText text={aboutForm.bulletList.content} />
      </Box>

      <Text as="h2" variant="h3" marginBottom={2} marginTop={5}>
        {formatMessage(aboutForm.personalInformation.sectionTitle)}
      </Text>

      <Accordion singleExpand>
        <AccordionItem
          id="id_1"
          label={formatMessage(aboutForm.personalInformation.accordionTitle)}
        >
          <DescriptionText
            text={aboutForm.personalInformation.accordionAbout}
            format={{
              homePageName: 'slóð sveitarfélags',
              homePageNameUrl: '',
            }}
          />
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default AboutForm
