import React from 'react'

import {
  Box,
  Accordion,
  AccordionItem,
  Text,
  ContentBlock,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CustomField, FieldBaseProps } from '@island.is/application/core'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

function Congratulations({
  error,
  field,
  application,
}: PropTypes): JSX.Element {
  return (
    <Box paddingTop={2}>
      <Box marginTop={2}>
        <ContentBlock>
          <AlertMessage
            type="success"
            title="Til hamingju"
            message={`
              fullnaðarskírteinið þitt hefur verið samþykkt og mun vera tilbúið
              hjá Sýslumanni í Reykjavík eftir 4 daga. Þegar þú sækir nýtt skírteini
              þarftu að skila inn bráðabirgðaskírteininu þínu.
            `}
          />
        </ContentBlock>

        <Box marginTop={4}>
          <Accordion singleExpand>
            <AccordionItem
              id="id_1"
              label="Hvað gerist næst?"
              labelVariant="h3"
            >
              <Text>
                Næsta sem gerist er að við ákveðum hvað á að standa í þessu
                boxi.
              </Text>
            </AccordionItem>
          </Accordion>
        </Box>

        <Box marginTop={4}>
          <img role="presentation" src="/assets/images/movingTruck.svg" alt="Skrautmynd" />
        </Box>
      </Box>
    </Box>
  )
}

export default Congratulations
