import React, { useState } from 'react'
import {
  Accordion,
  AccordionCard,
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
  toast,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { useQuery } from '@apollo/client'
import { GET_ORGANIZATIONS_QUERY } from '@island.is/service-portal/graphql'

const data = [
  {
    tenant: 'Reykjavíkurborg',
    client: 'Mínar síður Reykjavíkurborgar',
    items: [
      {
        provider: 'Ísland.is',
        providerLogo: 'Ísland.is',
        permissions: [
          {
            title: 'Netfang',
            description: 'Meira um netfang',
            hasConsent: false,
          },
          {
            title: 'Sími',
            description: 'Meira um síma',
            hasConsent: true,
          },
        ],
      },
    ],
  },
  {
    tenant: 'Skatturinn',
    client: 'Mínar síður RSK',
    items: [
      {
        provider: 'Stafraent Ísland',
        providerLogo: 'Stafraent Ísland',
        permissions: [
          {
            title: 'Sími',
            description: 'Meira um síma',
            hasConsent: true,
          },
        ],
      },
    ],
  },
]

function Consent() {
  const { formatMessage } = useLocale()

  const { data: orgData } = useQuery(GET_ORGANIZATIONS_QUERY)
  const organizations = orgData?.getOrganizations?.items || {}

  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '12/12', '10/12', '8/12']}>
        <IntroHeader
          title={m.consent}
          intro={m.consentHeaderIntro}
          marginBottom={1}
        />
        <Box marginBottom={8}>
          <Text variant="small">{formatMessage(m.consentHeaderDetails)}</Text>
        </Box>

        <Accordion
          singleExpand={false}
          dividers={false}
          dividerOnTop={false}
          dividerOnBottom={false}
        >
          {data.map(({ tenant, client, items }) => (
            <AccordionCard
              id={tenant}
              label={
                <Box
                  display="flex"
                  columnGap={2}
                  alignItems="center"
                  component="span"
                >
                  <img
                    src={getOrganizationLogoUrl(tenant, organizations)}
                    alt={''}
                    width={24}
                  />
                  <Box component="span">
                    <Text variant="eyebrow" color="purple400">
                      {tenant}
                    </Text>
                    <Text variant="h4">{client}</Text>
                  </Box>
                </Box>
              }
            >
              <Box paddingTop={5} paddingBottom={3} paddingLeft={4}>
                {items.map(({ provider, providerLogo, permissions }) => {
                  return (
                    <>
                      <Box display="flex" columnGap={1} marginBottom={2}>
                        <img
                          src={getOrganizationLogoUrl(
                            providerLogo,
                            organizations,
                          )}
                          alt={''}
                          width={24}
                        />
                        <Box flexGrow={1}>
                          <Text variant="h5">{provider}</Text>
                        </Box>
                      </Box>
                      <Box>
                        {permissions.map(
                          ({ title, description, hasConsent }, index) => {
                            const id = `${title}-${provider}`
                            return (
                              <ConsentLine
                                id={id}
                                hasConsent={hasConsent}
                                title={title}
                                description={description}
                                key={id + hasConsent}
                                onChange={() => console.log('change')}
                                isLast={permissions.length === index + 1}
                              />
                            )
                          },
                        )}
                      </Box>
                    </>
                  )
                })}
              </Box>
            </AccordionCard>
          ))}
        </Accordion>
      </GridColumn>
    </GridRow>
  )
}

interface ConsentLineProps {
  title: string
  description: string
  hasConsent: boolean
  id: string
  onChange: (newChecked: boolean) => void
  isLast: boolean
}

function ConsentLine({
  title,
  description,
  hasConsent,
  onChange,
  id,
  isLast,
}: ConsentLineProps) {
  const [localConsent, setLocalConsent] = useState(hasConsent)

  const handleChange = (newChecked: boolean) => {
    try {
      onChange(newChecked)
      if (Math.random() < 0.3) {
        throw new Error('error')
      }
      setLocalConsent(newChecked)
    } catch (error) {
      toast.error('Ó nei villa. Alla malla')
      setLocalConsent(hasConsent)
    }
  }

  return (
    <>
      <Box
        component="article"
        key={title}
        id={id}
        display="flex"
        columnGap={2}
        paddingY={3}
      >
        <Box flexGrow={1}>
          <Text id={id}>{title}</Text>
          <Text variant="small">{description}</Text>
        </Box>
        <Box>
          <ToggleSwitchButton
            label={hasConsent ? 'Virkja' : 'Gera óvirkt'}
            hiddenLabel
            checked={localConsent}
            onChange={handleChange}
            aria-controls={id}
          />
        </Box>
      </Box>
      {!isLast && <Divider />}
    </>
  )
}

export default Consent
