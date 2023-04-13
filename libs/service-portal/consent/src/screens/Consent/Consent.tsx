import React from 'react'
import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const data = [
  {
    domain: 'Skatturinn',
    items: [
      { title: 'Sími', description: 'Meiri details um síma', hasConsent: true },
    ],
  },
  {
    domain: 'Reykjavíkurborg',
    items: [
      {
        title: 'Netfang',
        description: 'Meiri details um netfang',
        hasConsent: true,
      },
    ],
  },
]

function Consent() {
  const { formatMessage } = useLocale()

  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
        <IntroHeader
          title={m.consent}
          intro={m.consentHeaderIntro}
          marginBottom={1}
        />
        <Text variant="small">{formatMessage(m.consentHeaderDetails)}</Text>

        <Text variant="h4" as="h2">
          Kerfi
        </Text>

        <Accordion singleExpand={false}>
          {data.map(({ domain, items }) => (
            <AccordionItem id={domain} label={domain}>
              <Box background="blue100" borderRadius="standard">
                {items.map(({ title, description, hasConsent }) => {
                  const id = domain + title
                  return (
                    <Box component="article" key={title} id={id}>
                      <Text id={id}>{title}</Text>
                      <Text>{description}</Text>
                      <ToggleSwitchButton
                        label={hasConsent ? 'Virkja' : 'Gera óvirkt'}
                        hiddenLabel
                        checked={hasConsent}
                        onChange={() => {
                          console.log('toggle')
                        }}
                        aria-controls={id}
                      />
                    </Box>
                  )
                })}
              </Box>
            </AccordionItem>
          ))}
        </Accordion>
      </GridColumn>
    </GridRow>
  )
}

export default Consent
