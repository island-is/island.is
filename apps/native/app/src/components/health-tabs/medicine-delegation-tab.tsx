import React, { useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import chevronForward from '@/assets/icons/chevron-forward.png'
import externalLinkIcon from '@/assets/icons/external-link.png'
import plusIcon from '@/assets/icons/plus.png'
import { useGetMedicineDelegationsQuery } from '@/graphql/types/schema'
import { useBrowser } from '@/hooks/use-browser'
import {
  Button,
  EmptyState,
  GeneralCardSkeleton,
  Label,
  Problem,
  Tag,
  Typography,
} from '@/ui'
import { NetworkStatus } from '@apollo/client'
import { useRouter } from 'expo-router'
import { useLocale } from '../../hooks/use-locale'
import { StackScreen } from '../stack-screen'

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

export function MedicineDelegationTab({ initial }: { initial?: boolean }) {
  const intl = useIntl()
  const theme = useTheme()
  const router = useRouter()
  const { openBrowser } = useBrowser()
  const locale = useLocale()
  const [showInactivePermits, setShowInactivePermits] = useState(false)
  const medicineDelegationsRes = useGetMedicineDelegationsQuery({
    variables: {
      locale,
      input: {
        status: [
          'active',
          'expired',
          'inactive',
          'unknown',
          'awaitingApproval',
        ],
      },
    },
    initialFetchPolicy: initial ? 'network-only' : undefined,
  })

  const delegations = useMemo(
    () =>
      medicineDelegationsRes.data?.healthDirectorateMedicineDelegations
        ?.items ?? [],
    [medicineDelegationsRes.data],
  )

  const isInitialLoading =
    medicineDelegationsRes.loading && delegations.length === 0

  const filteredDelegations = useMemo(
    () =>
      delegations.filter((delegation) =>
        showInactivePermits
          ? delegation.status
          : delegation.status === 'active' ||
            delegation.status === 'awaitingApproval',
      ),
    [delegations, showInactivePermits],
  )

  const hasDelegations = delegations.length > 0
  const hasVisibleDelegations = filteredDelegations.length > 0
  const hasError = medicineDelegationsRes.error && delegations.length === 0

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          refreshing={
            medicineDelegationsRes.networkStatus === NetworkStatus.refetch
          }
          onRefresh={() => medicineDelegationsRes.refetch({ locale })}
        />
      }
    >
      <StackScreen networkStatus={[medicineDelegationsRes.networkStatus]} />
      <Container>
        <Typography>
          <FormattedMessage id="health.medicineDelegation.description" />
        </Typography>
        <HeaderActions>
          <ReadMoreButton
            accessibilityRole="button"
            onPress={() => openBrowser('https://island.is/s/landlaeknir/frett')}
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
          <View
            style={{
              flexDirection: 'row',
              gap: theme.spacing[2],
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Button
              isFilledUtilityButton
              title={intl.formatMessage({
                id: 'health.medicineDelegation.addButton',
              })}
              onPress={() => router.navigate('/health/medicine/delegation/add')}
              icon={plusIcon}
              iconStyle={{
                tintColor: theme.color.white,
                width: 10,
                height: 10,
              }}
            />
            <Button
              isUtilityButton
              title={intl.formatMessage({
                id: showInactivePermits
                  ? 'health.medicineDelegation.hideExpiredPermits'
                  : 'health.medicineDelegation.showExpiredPermits',
              })}
              onPress={() => setShowInactivePermits((prev) => !prev)}
            />
          </View>
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
                  router.navigate({
                    pathname: '/health/medicine/delegation/[id]',
                    params: {
                      id: delegation.cacheId,
                      name: delegation.name ?? '',
                      nationalId: delegation.nationalId ?? '',
                      isActive: String(delegation.isActive ?? false),
                      status: delegation.status ?? '',
                      lookup: String(delegation.lookup ?? false),
                      dateFrom: delegation.dates?.from ?? '',
                      dateTo: delegation.dates?.to ?? '',
                    },
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
    </ScrollView>
  )
}
