import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, TouchableOpacity, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { HealthDirectorateMedicineDelegationItem } from '../../graphql/types/schema'
import { navigateTo } from '../../lib/deep-linking'
import { useBrowser } from '../../lib/use-browser'
import {
  Button,
  EmptyState,
  GeneralCardSkeleton,
  Label,
  Problem,
  Tag,
  Typography,
} from '../../ui'
import plusIcon from '../../assets/icons/plus.png'
import externalLinkIcon from '../../assets/icons/external-link.png'
import chevronForward from '../../assets/icons/chevron-forward.png'

const Container = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const HeaderActions = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  gap: ${({ theme }) => theme.spacing[3]}px;
  align-self: flex-start;
  align-items: flex-start;
`

const ReadMoreButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.color.blue400};
`

const Card = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  padding: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.blue200};
`

const TagContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  align-self: flex-start;
`

interface MedicineDelegationContentProps {
  componentId: string
  delegations: HealthDirectorateMedicineDelegationItem[]
  loading: boolean
  error?: Error | undefined
  showInactivePermits: boolean
}

export function MedicineDelegationContent({
  componentId,
  delegations,
  loading,
  error,
  showInactivePermits,
}: MedicineDelegationContentProps) {
  const intl = useIntl()
  const theme = useTheme()
  const { openBrowser } = useBrowser()

  const isInitialLoading = loading && delegations.length === 0

  const filteredDelegations = delegations.filter((delegation) =>
    showInactivePermits
      ? delegation.status
      : delegation.status === 'active' ||
        delegation.status === 'awaitingApproval',
  )

  const hasDelegations = delegations.length > 0
  const hasVisibleDelegations = filteredDelegations.length > 0
  const hasError = error && delegations.length === 0

  return (
    <Container>
      <Typography>
        <FormattedMessage id="health.medicineDelegation.description" />
      </Typography>
      <HeaderActions>
        <ReadMoreButton
          accessibilityRole="button"
          onPress={() =>
            openBrowser('https://island.is/s/landlaeknir/frett', componentId)
          }
        >
          <Typography
            variant="eyebrow"
            color={theme.color.blue400}
            style={{ marginRight: theme.spacing.smallGutter }}
          >
            <FormattedMessage id="health.medicineDelegation.readMore" />
          </Typography>
          <Image source={externalLinkIcon} />
        </ReadMoreButton>
        <Button
          isFilledUtilityButton
          title={intl.formatMessage({
            id: 'health.medicineDelegation.addButton',
          })}
          onPress={() =>
            navigateTo('/medicine-delegation/add', {
              parentComponentId: componentId,
            })
          }
          icon={plusIcon}
          iconStyle={{
            tintColor: theme.color.white,
            width: 10,
            height: 10,
          }}
        />
      </HeaderActions>

      {hasError ? (
        <View style={{ marginTop: theme.spacing[3] }}>
          <Problem />
        </View>
      ) : isInitialLoading ? (
        <View style={{ paddingVertical: theme.spacing[2] }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <GeneralCardSkeleton height={90} key={index} />
          ))}
        </View>
      ) : hasDelegations ? (
        hasVisibleDelegations ? (
          filteredDelegations.map((delegation, index) => (
            <Card
              key={`${delegation.cacheId}-${index}`}
              onPress={() => {
                navigateTo('/medicine-delegation/detail', {
                  parentComponentId: componentId,
                  delegation,
                })
              }}
              accessibilityRole="button"
            >
              <View>
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
                  {!delegation.isActive ? (
                    <Label color="danger">
                      <FormattedMessage id="health.medicineDelegation.labelExpired" />
                    </Label>
                  ) : (
                    delegation.dates?.to && (
                      <Tag
                        title={intl.formatMessage(
                          {
                            id: 'health.medicineDelegation.listValidTo',
                          },
                          {
                            date: intl.formatDate(delegation.dates?.to ?? ''),
                          },
                        )}
                      />
                    )
                  )}
                </TagContainer>
              </View>
              <View>
                <Image source={chevronForward} />
              </View>
            </Card>
          ))
        ) : (
          <EmptyState
            title={intl.formatMessage({
              id: 'health.medicineDelegation.noActiveTitle',
            })}
            description={intl.formatMessage({
              id: 'health.medicineDelegation.noActiveDescription',
            })}
          />
        )
      ) : (
        <EmptyState
          title={intl.formatMessage({
            id: 'health.medicineDelegation.emptyTitle',
          })}
          description={intl.formatMessage({
            id: 'health.medicineDelegation.emptyDescription',
          })}
        />
      )}
    </Container>
  )
}
