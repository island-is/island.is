import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'

import chevronForward from '@/assets/icons/chevron-forward.png'
import { HealthDirectorateMedicineDelegationItem } from '@/graphql/types/schema'
import { Label, Typography } from '@/ui'

const Card = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* Keeps the text off the chevron so it wraps before reaching it. */
  gap: ${({ theme }) => theme.spacing[2]}px;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  padding: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: 1px;
  border-color: ${({ theme }) => theme.tokens.border.primary};
`

const TagContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  align-self: flex-start;
`

type MedicineDelegationCardProps = {
  delegation: HealthDirectorateMedicineDelegationItem
  onPress(): void
}

export function MedicineDelegationCard({
  delegation,
  onPress,
}: MedicineDelegationCardProps) {
  const intl = useIntl()

  return (
    <Card onPress={onPress} accessibilityRole="button">
      <View style={{ flex: 1 }}>
        <Typography variant="heading5">{delegation.name}</Typography>
        <Typography>
          {delegation.lookup
            ? intl.formatMessage({
                id: 'health.medicineDelegation.captionPickupAndLookup',
              })
            : intl.formatMessage({
                id: 'health.medicineDelegation.captionPickup',
              })}
        </Typography>
        <TagContainer>
          {/* A permit that has not taken effect yet is neither
              active nor expired - it gets its own "valid from" tag. */}
          {delegation.status === 'awaitingApproval' ? (
            delegation.dates?.from && (
              <Label color="pending">
                {intl.formatMessage(
                  {
                    id: 'health.medicineDelegation.listValidFrom',
                  },
                  {
                    date: intl.formatDate(delegation.dates.from),
                  },
                )}
              </Label>
            )
          ) : !delegation.isActive ? (
            <Label color="danger">
              <FormattedMessage id="health.medicineDelegation.labelExpired" />
            </Label>
          ) : (
            delegation.dates?.to && (
              <Label color="primary">
                {intl.formatMessage(
                  {
                    id: 'health.medicineDelegation.listValidTo',
                  },
                  {
                    date: intl.formatDate(delegation.dates?.to ?? ''),
                  },
                )}
              </Label>
            )
          )}
        </TagContainer>
      </View>
      <View>
        <Image
          source={chevronForward}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </View>
    </Card>
  )
}
