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
import styled, { useTheme } from 'styled-components/native'

import arrowRightIcon from '../../assets/icons/chevron-forward.png'
import externalLinkIcon from '../../assets/icons/external-link.png'
import plusIcon from '../../assets/icons/plus.png'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { navigateTo } from '../../lib/deep-linking'
import { useBrowser } from '../../lib/use-browser'
import { Button, EmptyState, Tag, Typography } from '../../ui'
import { useGetMedicineDelegationsQuery } from '../../graphql/types/schema'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'

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
    refetching,
    queryResult: [medicineDelegationsRes],
  })

  // const delegations =
  //   medicineDelegationsRes.data?.healthDirectorateMedicineDelegations?.items ??
  //   []

  // Mock data with the same shape as the real API response
  const [delegations] = useState([
    {
      cacheId: '1',
      name: 'Sigrún Guðmundsdóttir',
      nationalId: '2112827199',
      isActive: true,
      status: 'active',
      lookup: true,
      dates: {
        from: '2025-06-01',
        to: '2028-06-01',
      },
    },
    {
      cacheId: '2',
      name: 'Jón Jónsson',
      nationalId: '2112827199',
      isActive: false,
      status: 'expired',
      lookup: false,
      dates: {
        from: '2025-06-02',
        to: '2023-06-02',
      },
    },
    {
      cacheId: '3',
      name: 'Anna Jónsdóttir',
      nationalId: '2112827199',
      isActive: true,
      status: 'active',
      lookup: true,
      dates: {
        from: '2025-06-03',
        to: '2028-06-03',
      },
    },
  ])

  const hasDelegations = delegations.length > 0

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
                // TODO: Add link to read more about medicine delegation
                openBrowser('https://island.is', componentId)
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
              compactPadding
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

          {hasDelegations ? (
            delegations.map((delegation, index) => (
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
                    <FormattedMessage id="health.medicineDelegation.listCaption" />
                  </Typography>
                  <TagContainer>
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
