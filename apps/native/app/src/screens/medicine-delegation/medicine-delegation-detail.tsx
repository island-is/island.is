import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, SafeAreaView, ScrollView } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled from 'styled-components/native'
import trashIcon from '../../assets/icons/trash.png'

import { Button, NavigationBarSheet, Typography } from '../../ui'
import { useDeleteMedicineDelegationMutation } from '../../graphql/types/schema'

interface MedicineDelegation {
  cacheId: string
  name?: string | null
  nationalId?: string | null
  isActive?: boolean | null
  status?: string | null
  lookup?: boolean | null
  dates?: {
    from?: string | null
    to?: string | null
  } | null
}

const Host = styled(SafeAreaView)`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Content = styled(ScrollView)`
  flex: 1;
`

const Row = styled.View`
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.color.blue200};
  padding-bottom: ${({ theme }) => theme.spacing.p1}px;
  padding-top: ${({ theme }) => theme.spacing.p1}px;
`

const RowContent = styled.View`
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
  margin-vertical: ${({ theme }) => theme.spacing.p4}px;
`

const ErrorMessage = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  color: ${({ theme }) => theme.color.red600};
`

export const MedicineDelegationDetailScreen: NavigationFunctionComponent<{
  delegation?: MedicineDelegation
}> = ({ componentId, delegation }) => {
  const intl = useIntl()

  const close = () => Navigation.dismissModal(componentId)
  const [revokeError, setRevokeError] = useState<string | undefined>()

  const [
    revokeMedicineDelegation,
    { loading: loadingRevokeMedicineDelegation },
  ] = useDeleteMedicineDelegationMutation({
    refetchQueries: ['GetMedicineDelegations'],
    onCompleted: (response) => {
      if (response.healthDirectorateMedicineDelegationDelete.success) {
        close()
      } else {
        setRevokeError(
          intl.formatMessage({
            id: 'health.medicineDelegation.detail.revokeError',
          }),
        )
      }
    },
    onError: () => {
      setRevokeError(
        intl.formatMessage({
          id: 'health.medicineDelegation.detail.revokeError',
        }),
      )
    },
  })

  const revoke = () => {
    if (
      !delegation?.nationalId ||
      !delegation?.dates?.from ||
      !delegation?.dates?.to
    ) {
      return
    }

    revokeMedicineDelegation({
      variables: {
        input: {
          nationalId: delegation.nationalId,
          lookup: delegation.lookup,
          from: delegation.dates.from,
          to: delegation.dates.to,
        },
      },
    })
  }

  const confirmRevoke = () => {
    Alert.alert(
      intl.formatMessage({
        id: 'health.medicineDelegation.detail.revokePromptTitle',
      }),
      '',
      [
        {
          text: intl.formatMessage({
            id: 'health.medicineDelegation.detail.revokePromptCancel',
          }),
          style: 'cancel',
        },
        {
          text: intl.formatMessage({
            id: 'health.medicineDelegation.detail.revokePromptConfirm',
          }),
          style: 'destructive',
          onPress: revoke,
        },
      ],
    )
  }

  const validFrom = delegation?.dates?.from
    ? new Date(delegation.dates.from)
    : undefined
  const validTo = delegation?.dates?.to
    ? new Date(delegation.dates.to)
    : undefined

  const data = [
    {
      label: intl.formatMessage({
        id: 'health.medicineDelegation.detail.issuerLabel',
      }),
      value: intl.formatMessage({
        id: 'health.medicineDelegation.detail.issuerValue',
      }),
    },

    {
      label: intl.formatMessage({
        id: 'health.medicineDelegation.detail.status',
      }),
      value: intl.formatMessage({
        id: delegation?.isActive
          ? 'health.medicineDelegation.detail.statusActive'
          : 'health.medicineDelegation.detail.statusExpired',
      }),
    },
    {
      label: intl.formatMessage({
        id: 'health.medicineDelegation.detail.validity',
      }),
      value:
        validFrom && validTo
          ? `${intl.formatDate(validFrom)} - ${intl.formatDate(validTo)}`
          : '—',
    },
    {
      label: intl.formatMessage({
        id: 'health.medicineDelegation.detail.validFor',
      }),
      value: delegation?.lookup
        ? intl.formatMessage({
            id: 'health.medicineDelegation.detail.validForPickupAndLookup',
          })
        : intl.formatMessage({
            id: 'health.medicineDelegation.detail.validForPickup',
          }),
    },
  ]

  return (
    <Host>
      <Content>
        <NavigationBarSheet
          componentId={componentId}
          title={delegation?.name}
          onClosePress={close}
          style={{ marginBottom: 16 }}
        />
        <Button
          loading={loadingRevokeMedicineDelegation}
          title={intl.formatMessage({
            id: 'health.medicineDelegation.detail.revoke',
          })}
          onPress={confirmRevoke}
          isUtilityButton
          isOutlined
          icon={trashIcon}
          style={{ alignSelf: 'flex-start' }}
          disabled={loadingRevokeMedicineDelegation}
        />

        {revokeError && (
          <ErrorMessage variant="body3">{revokeError}</ErrorMessage>
        )}

        {data.map((item) => (
          <Row key={item.label}>
            <RowContent>
              <Typography variant="body3" style={{ marginBottom: 4 }}>
                {item.label}
              </Typography>
              <Typography variant="heading5">{item.value}</Typography>
            </RowContent>
          </Row>
        ))}
      </Content>
    </Host>
  )
}

MedicineDelegationDetailScreen.options = {
  topBar: {
    visible: false,
  },
}
