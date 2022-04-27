import React from 'react'
import { useIntl } from 'react-intl'
import { Accordion, AccordionItem, Text } from '@island.is/island-ui/core'
import { privacyPolicyAccordion } from '../../lib/messages'
import { DescriptionText } from '..'

interface Props {
  municipalityPageUrl?: string
}

const PrivacyPolicyAccordion = ({ municipalityPageUrl }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Text as="h3" variant="h3" marginBottom={2}>
        {formatMessage(privacyPolicyAccordion.general.sectionTitle)}
      </Text>
      <Accordion singleExpand>
        <AccordionItem
          id={privacyPolicyAccordion.accordion.title.id}
          label={formatMessage(privacyPolicyAccordion.accordion.title)}
        >
          <DescriptionText text={privacyPolicyAccordion.accordion.about} />
          {municipalityPageUrl ? (
            <DescriptionText
              text={privacyPolicyAccordion.accordion.moreInfoHomepage}
              format={{
                homePageNameUrl: municipalityPageUrl,
              }}
            />
          ) : (
            <DescriptionText text={privacyPolicyAccordion.accordion.moreInfo} />
          )}
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default PrivacyPolicyAccordion
