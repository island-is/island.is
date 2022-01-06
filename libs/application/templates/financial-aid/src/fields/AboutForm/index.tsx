import React from 'react'
import { Text, Accordion, AccordionItem } from '@island.is/island-ui/core'
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

      <DescriptionText text={aboutForm.bulletList.first} />

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
          />

          {/* <a
              href={municipality?.homepage}
              target="_blank"
              rel="noreferrer noopener"
            >
              {municipality?.homepage}
            </a> */}
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default AboutForm
