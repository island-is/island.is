import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist'
import styled, { useTheme } from 'styled-components/native'

import arrowRightIcon from '../../assets/icons/chevron-forward.png'
import externalLinkIcon from '../../assets/icons/external-link.png'
import plusIcon from '../../assets/icons/plus.png'
import { useGetMedicineDelegationsQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
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
import { ButtonRegistry } from '../../utils/component-registry'

const Host = styled(SafeAreaView)`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
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

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({
          id: 'health.medicineDelegation.screenTitle',
        }),
      },
      rightButtons: [
        {
          id: ButtonRegistry.MedicineDelegationShowInactiveButton,
          text: intl.formatMessage({
            id: 'health.medicineDelegation.showExpiredPermits',
          }),
        },
      ],
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
    },
  }))

export const MedicineDelegationScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const theme = useTheme()
  const { openBrowser } = useBrowser()
  const [refetching, setRefetching] = useState(false)
  const [showExpiredPermits, setShowExpiredPermits] = useState(false)

  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === ButtonRegistry.MedicineDelegationShowInactiveButton) {
      setShowExpiredPermits((prev) => !prev)
    }
  }, componentId)

  const medicineDelegationsRes = useGetMedicineDelegationsQuery({
    variables: {
      locale: intl.locale,
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
  })

  const onRefresh = useCallback(async () => {
    setRefetching(true)
    try {
      await medicineDelegationsRes.refetch()
    } finally {
      setRefetching(false)
    }
  }, [medicineDelegationsRes])

  useConnectivityIndicator({
    componentId,
    rightButtons: [
      {
        id: ButtonRegistry.MedicineDelegationShowInactiveButton,
        text: showExpiredPermits
          ? intl.formatMessage({
              id: 'health.medicineDelegation.hideExpiredPermits',
            })
          : intl.formatMessage({
              id: 'health.medicineDelegation.showExpiredPermits',
            }),
      },
    ],
    refetching,
    queryResult: [medicineDelegationsRes],
    extraData: [showExpiredPermits],
  })

  const isInitialLoading =
    medicineDelegationsRes.loading && !medicineDelegationsRes.data

  const delegations =
    medicineDelegationsRes.data?.healthDirectorateMedicineDelegations?.items ??
    []

  const filteredDelegations = delegations.filter((delegation) =>
    showExpiredPermits
      ? delegation.status
      : delegation.status === 'active' ||
        delegation.status === 'awaitingApproval',
  )

  const hasDelegations = delegations.length > 0
  const hasVisibleDelegations = filteredDelegations.length > 0
  const hasError = medicineDelegationsRes.error && !medicineDelegationsRes.data

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
      >
        <Host>
          <Typography>
            <FormattedMessage id="health.medicineDelegation.description" />
          </Typography>
          <HeaderActions>
            <ReadMoreButton
              accessibilityRole="button"
              onPress={() =>
                openBrowser(
                  'https://island.is/s/landlaeknir/frett',
                  componentId,
                )
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
                    <Typography variant="heading5">
                      {delegation.name}
                    </Typography>
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
                                date: intl.formatDate(
                                  delegation.dates?.to ?? '',
                                ),
                              },
                            )}
                          />
                        )
                      )}
                    </TagContainer>
                  </View>
                  <View>
                    <Image source={arrowRightIcon} />
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
        </Host>
      </ScrollView>
    </View>
  )
}

MedicineDelegationScreen.options = getNavigationOptions
