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
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import * as styles from './Consent.css'
import {
  useGetConsentListQuery,
  usePatchConsentMutation,
} from './Consent.generated'

import type {
  ConsentLineProps,
  ConsentSectionProps,
  ConsentGroupProps,
} from './types'

function Consent() {
  const { formatMessage } = useLocale()

  const { data, loading } = useGetConsentListQuery()
  const isData = Array.isArray(data?.consentsList?.data)

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
          {loading ? (
            <Box>
              <SkeletonLoader
                display="block"
                height={117}
                repeat={2}
                space={2}
                borderRadius="large"
              />
            </Box>
          ) : isData ? (
            data?.consentsList?.data?.map(({ client, tenants }) => {
              const title = client?.clientName || client.clientId
              return (
                <AccordionCard
                  id={client.clientId}
                  key={client.clientId}
                  labelUse="h2"
                  dataTestId="consent-accordion-card"
                  label={
                    <Box
                      display="flex"
                      columnGap={2}
                      alignItems="center"
                      component="span"
                    >
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        className={styles.logoContainer}
                      >
                        {client.domain?.organisationLogoUrl ? (
                          <img
                            src={client.domain?.organisationLogoUrl || ''}
                            alt={''}
                            width={24}
                          />
                        ) : null}
                      </Box>
                      <Box component="span">
                        {client.domain?.displayName ? (
                          <Text
                            variant="eyebrow"
                            color="purple400"
                            dataTestId="consent-accordion-display-name"
                          >
                            {client.domain.displayName}
                          </Text>
                        ) : null}
                        <Text
                          as="span"
                          variant="h4"
                          dataTestId="consent-accordion-title"
                        >
                          {title}
                        </Text>
                      </Box>
                    </Box>
                  }
                >
                  <Box paddingY={3} paddingX={[3, 6]}>
                    <Text variant="eyebrow" marginBottom={4}>
                      {formatMessage(m.consentExplanation)}
                    </Text>
                    <ul>
                      {tenants
                        ?.filter(Boolean)
                        ?.map((tenant, permissionIndex, arr) => {
                          return (
                            <ConsentSection
                              {...tenant}
                              clientId={client.clientId}
                              key={permissionIndex}
                              isLast={permissionIndex + 1 === arr.length}
                            />
                          )
                        })}
                    </ul>
                  </Box>
                </AccordionCard>
              )
            })
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
  clientId,
  tenant,
  scopes = [],
  isLast = false,
}: ConsentSectionProps) {
  if (!scopes?.length || !tenant) {
    return null
  }

  return (
    <Box marginBottom={2} component="li">
      <Box display="flex" columnGap={2} alignItems="center">
        {tenant?.organisationLogoUrl ? (
          <img src={tenant.organisationLogoUrl} alt={''} width={16} />
        ) : null}
        <Box flexGrow={1}>
          <Text as="h3" variant="h5">
            {tenant.displayName}
          </Text>
        </Box>
      </Box>
      <Box component="ul">
        {scopes.map((scope, index) => {
          if (scope?.children?.length) {
            return (
              <ConsentGroup
                description={scope.description}
                displayName={scope.displayName}
                key={index}
              >
                {scope.children?.map((cld, index, list) => {
                  return (
                    <ConsentLine
                      {...cld}
                      key={scope.name}
                      clientId={clientId}
                      isLast={list.length === index + 1}
                    />
                  )
                })}
              </ConsentGroup>
            )
          }

          if (scope?.children?.length === 0) {
            return (
              <ConsentLine
                {...scope}
                key={scope.name}
                clientId={clientId}
                isLast={scopes.length === index + 1}
              />
            )
          }
          return null
        })}
      </Box>

      {!isLast && (
        <Box marginBottom={3}>
          <Divider />
        </Box>
      )}
    </Box>
  )
}

function ConsentGroup({
  displayName,
  description,
  children,
}: ConsentGroupProps) {
  return (
    <Box marginY={2} component="li">
      <Box marginBottom={2}>
        <Text as="h4">{displayName}</Text>
        {description ? <Text variant="small">{description}</Text> : null}
      </Box>
      <Box
        component="ul"
        borderLeftWidth="standard"
        borderColor="blue200"
        paddingLeft={3}
      >
        {children}
      </Box>
    </Box>
  )
}

function ConsentLine({
  name,
  displayName,
  description,
  hasConsent,
  clientId,
  isLast,
}: ConsentLineProps) {
  const { formatMessage } = useLocale()
  const [patchConsent, { loading }] = usePatchConsentMutation({
    onError: (_) => toast.error(formatMessage(m.consentUpdateError)),
  })

  const [localConsent, setLocalConsent] = useState(hasConsent)

  const handleChange = async (isChecked: boolean) => {
    if (loading) {
      return
    }

    const { data } = await patchConsent({
      variables: {
        input: {
          clientId,
          ...(isChecked ? { consentedScope: name } : { rejectedScope: name }),
        },
      },
    })

    if (data?.patchAuthConsent) {
      setLocalConsent(isChecked)
    }
  }

  return (
    <li>
      <Box display="flex" paddingY={3} dataTestId="consent-scope">
        <Box flexGrow={1}>
          <Text as="h4">{displayName}</Text>
          <Text variant="small">{description}</Text>
        </Box>
        <span className={styles.toggleWrapper}>
          <ToggleSwitchButton
            label={formatMessage(m.consentToggleButton, { item: displayName })}
            hiddenLabel
            checked={localConsent ?? false}
            disabled={loading}
            onChange={handleChange}
          />
        </span>
      </Box>

      {!isLast && <Divider />}
    </li>
  )
}

export default Consent
