import { useQuery } from '@apollo/client'
import { Skeleton } from '@island.is/island-ui-native'
import React from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'
import { InfoMessage } from '../../components/info-message/info-message'

import { client } from '../../graphql/client'
import { NATION_REGISTRY_USER_QUERY } from '../../graphql/queries/national-registry-user.query'
import { useAuthStore } from '../../stores/auth-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { useIntl } from '../../utils/intl'
import { testIDs } from '../../utils/test-ids'

const InputHost = styled.SafeAreaView`
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade200
      : props.theme.color.blue100};
  margin-left: 16px;
  margin-right: 16px;
`

const InputContent = styled.View`
  padding-top: 24px;
  padding-bottom: 24px;
`

const InputLabel = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
  margin-bottom: 8px;
`

const InputValue = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.shade.foreground};
`

const InputRow = styled.View`
  flex-direction: row;
`

function Input({
  label,
  value,
  loading,
  error,
  valueTestID
}: {
  label: string
  value?: string
  loading?: boolean
  error?: boolean
  valueTestID?: string
}) {
  return (
    <InputHost>
      <InputContent>
        <InputLabel>{label}</InputLabel>
        {loading || error ? (
          <Skeleton active={loading} error={error} />
        ) : (
          <InputValue testID={valueTestID}>{value ?? ''}</InputValue>
        )}
      </InputContent>
    </InputHost>
  )
}

function formatNationalId(str: string = '') {
  return [str.substr(0, 6), str.substr(6, 4)].join('-')
}

export function TabPersonalInfo() {
  const authStore = useAuthStore()
  const intl = useIntl()
  const { dismiss, dismissed } = usePreferencesStore()
  const natRegRes = useQuery(NATION_REGISTRY_USER_QUERY, { client })
  const natRegData = natRegRes?.data?.nationalRegistryUser || {}
  const errorNatReg = !!natRegRes.error
  const loadingNatReg = natRegRes.loading

  return (
    <ScrollView style={{ flex: 1 }} testID={testIDs.USER_SCREEN_PROFILE_INFO}>
      {!dismissed.includes('userNatRegInformational') && (
        <InfoMessage onClose={() => dismiss('userNatRegInformational')}>
          {intl.formatMessage({ id: 'user.natreg.infoBox' })}
        </InfoMessage>
      )}
      <View style={{ height: 8 }} />
      <Input
        loading={loadingNatReg}
        error={errorNatReg}
        label={intl.formatMessage({ id: 'user.natreg.displayName' })}
        value={natRegData?.fullName}
        valueTestID={testIDs.USER_PROFILE_INFO_DISPLAY_NAME_VALUE}
      />
      <InputRow>
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'user.natreg.nationalId' })}
          value={
            !loadingNatReg && !errorNatReg
              ? formatNationalId(String(natRegData.nationalId))
              : undefined
          }
        />
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'user.natreg.birthPlace' })}
          value={natRegData?.birthPlace}
        />
      </InputRow>
      <Input
        loading={loadingNatReg}
        error={errorNatReg}
        label={intl.formatMessage({ id: 'user.natreg.legalResidence' })}
        value={natRegData?.legalResidence}
      />
      <InputRow>
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'user.natreg.gender' })}
          value={
            !loadingNatReg && !errorNatReg
              ? intl.formatMessage(
                  { id: 'user.natreg.genderValue' },
                  natRegData,
                )
              : undefined
          }
        />
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({
            id: 'user.natreg.maritalStatus',
          })}
          value={
            !loadingNatReg && !errorNatReg
              ? intl.formatMessage(
                  { id: 'user.natreg.maritalStatusValue' },
                  natRegData,
                )
              : undefined
          }
        />
      </InputRow>
      <Input
        loading={loadingNatReg}
        label={intl.formatMessage({ id: 'user.natreg.citizenship' })}
        value={authStore.userInfo?.nat}
      />
      <Input
        loading={loadingNatReg}
        error={errorNatReg}
        label={intl.formatMessage({ id: 'user.natreg.religion' })}
        value={natRegData?.religion}
      />
    </ScrollView>
  )
}
