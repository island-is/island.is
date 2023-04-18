import React, { useState } from 'react'
import {
  Accordion,
  AccordionCard,
  AlertMessage,
  Box,
  Divider,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Text,
  toast,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useQuery } from '@apollo/client'
import type { ConsentLineProps, ConsentSectionProps } from './types'

import { GET_ORGANIZATIONS_QUERY } from '@island.is/service-portal/graphql' // Temp
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { mock, useMockData } from './mockData'

function Consent() {
  const { formatMessage } = useLocale()

  // const { data, isLoading } = useMockData<MData[]>([], 1000)
  const { data, isLoading } = useMockData(mock, 5000)

  // Mock organizations for icons.
  const { data: orgData } = useQuery(GET_ORGANIZATIONS_QUERY)
  const organizations = orgData?.getOrganizations?.items || {}

  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '12/12', '10/12', '8/12']}>
        <IntroHeader
          title={m.consent}
          intro={m.consentHeaderIntro}
          marginBottom={8}
        >
          <GridColumn span={['8/8', '5/8']}>
            <Box marginTop={1}>
              <Text variant="small">
                {formatMessage(m.consentHeaderDetails)}
              </Text>
            </Box>
          </GridColumn>
        </IntroHeader>

        <Accordion
          singleExpand={false}
          dividers={false}
          dividerOnTop={false}
          dividerOnBottom={false}
        >
          {isLoading ? (
            <Box>
              <SkeletonLoader
                display="block"
                height={117}
                repeat={2}
                space={2}
                borderRadius="large"
              />
            </Box>
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map(({ tenant, client, items = [] }) => (
              <AccordionCard
                id={tenant}
                key={tenant}
                labelUse="h2"
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
                      <Text as="h2" variant="h4">
                        {client}
                      </Text>
                    </Box>
                  </Box>
                }
              >
                <Box
                  paddingTop={3}
                  paddingBottom={3}
                  paddingLeft={4}
                  component="ul"
                >
                  <Text variant="eyebrow" marginBottom={4}>
                    {formatMessage(m.consentExplanation)}
                  </Text>
                  {items.map((item) => {
                    return (
                      <ConsentSection
                        key={item.provider}
                        organizations={organizations}
                        {...item}
                      />
                    )
                  })}
                </Box>
              </AccordionCard>
            ))
          ) : (
            <AlertMessage
              type="info"
              message={formatMessage(m.consentEmptyInfo)}
            />
          )}
        </Accordion>
      </GridColumn>
    </GridRow>
  )
}

function ConsentSection({
  provider,
  providerLogo,
  permissions,
  organizations,
}: ConsentSectionProps) {
  return (
    <Box marginBottom={1}>
      <Box display="flex" columnGap={1}>
        <img
          src={getOrganizationLogoUrl(providerLogo, organizations)}
          alt={''}
          width={24}
        />
        <Box flexGrow={1}>
          <Text as="h3" variant="h5">
            {provider}
          </Text>
        </Box>
      </Box>
      <Box component="ul">
        {permissions.map(({ title, description, hasConsent }, index) => {
          const id = `${title}-${provider}`

          const handleChange = (newChecked: boolean) => {
            console.log('change', newChecked)
          }
          return (
            <ConsentLine
              id={id}
              hasConsent={hasConsent}
              title={title}
              description={description}
              key={id + hasConsent}
              onChange={handleChange}
              isLast={permissions.length === index + 1}
            />
          )
        })}
      </Box>
    </Box>
  )
}

function ConsentLine({
  title,
  description,
  hasConsent,
  onChange,
  id,
  isLast,
}: ConsentLineProps) {
  const { formatMessage } = useLocale()

  const [localConsent, setLocalConsent] = useState(hasConsent)

  const handleChange = (newChecked: boolean) => {
    try {
      onChange(newChecked)
      if (Math.random() < 0.3) {
        throw new Error('error')
      }
      setLocalConsent(newChecked)
    } catch (error) {
      toast.error(formatMessage(m.consentUpdateError))
      setLocalConsent(hasConsent)
    }
  }

  return (
    <li>
      <Box key={title} display="flex" paddingY={3}>
        <Box flexGrow={1}>
          <Text as="h4" id={id}>
            {title}
          </Text>
          <Text variant="small">{description}</Text>
        </Box>
        <Box>
          <ToggleSwitchButton
            label={formatMessage(m.consentToggleButton, { item: title })}
            hiddenLabel
            checked={localConsent}
            onChange={handleChange}
          />
        </Box>
      </Box>
      {!isLast && <Divider />}
    </li>
  )
}

export default Consent
