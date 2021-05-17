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
}: {
  label: string
  value?: string
  loading?: boolean
  error?: boolean
}) {
  return (
    <InputHost>
      <InputContent>
        <InputLabel>{label}</InputLabel>
        {loading || error ? (
          <Skeleton active={loading} error={error} />
        ) : (
          <InputValue>{value ?? ''}</InputValue>
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

  console.log({ errorNatReg, loadingNatReg });

  return (
    <ScrollView style={{ flex: 1 }}>
      {!dismissed.includes('userNatRegInformational') && (
        <InfoMessage onClose={() => dismiss('userNatRegInformational')}>
          Þín skráning í Þjóðskrá Íslands
        </InfoMessage>
      )}
      <View style={{ height: 8 }} />
      <Input
        loading={loadingNatReg}
        error={errorNatReg}
        label={intl.formatMessage({ id: 'settings.natreg.displayName' })}
        value={natRegData?.fullName}
      />
      <InputRow>
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'settings.natreg.nationalId' })}
          value={
            !loadingNatReg && !errorNatReg
              ? formatNationalId(String(natRegData.nationalId))
              : undefined
          }
        />
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'settings.natreg.birthPlace' })}
          value={natRegData?.birthPlace}
        />
      </InputRow>
      <Input
        loading={loadingNatReg}
        error={errorNatReg}
        label={intl.formatMessage({ id: 'settings.natreg.legalResidence' })}
        value={natRegData?.legalResidence}
      />
      <InputRow>
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'settings.natreg.gender' })}
          value={
            !loadingNatReg && !errorNatReg
              ? intl.formatMessage(
                  { id: 'settings.natreg.genderValue' },
                  natRegData,
                )
              : undefined
          }
        />
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({
            id: 'settings.natreg.maritalStatus',
          })}
          value={
            !loadingNatReg && !errorNatReg
              ? intl.formatMessage(
                  { id: 'settings.natreg.maritalStatusValue' },
                  natRegData,
                )
              : undefined
          }
        />
      </InputRow>
      <Input
        loading={loadingNatReg}
        label={intl.formatMessage({ id: 'settings.natreg.citizenship' })}
        value={authStore.userInfo?.nat}
      />
      <Input
        loading={loadingNatReg}
        error={errorNatReg}
        label={intl.formatMessage({ id: 'settings.natreg.religion' })}
        value={natRegData?.religion}
      />
    </ScrollView>
  )
}
