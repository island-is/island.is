import React from 'react'
import { useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'

import { InfoLine, InfoLineRow, Typography } from '@/ui'
import { useNationalRegistryUserQuery } from '@/graphql/types/schema'
import { formatNationalId } from '@/lib/format-national-id'
import { testIDs } from '@/utils/test-ids'
import { StackScreen } from '@/components/stack-screen'

export default function PersonalInfoScreen() {
  const intl = useIntl()
  const natRegRes = useNationalRegistryUserQuery()
  const natRegData = natRegRes?.data?.nationalRegistryPerson
  const errorNatReg = !!natRegRes.error && !natRegData
  const loadingNatReg = natRegRes.loading && !natRegData

  return (
    <ScrollView
      style={{ flex: 1 }}
      testID={testIDs.SCREEN_PERSONAL_INFO}
      stickyHeaderIndices={[0]}
    >
      <StackScreen
        closeable
        networkStatus={natRegRes.networkStatus}
        options={{ title: 'Upplýsingar' }}
      />
      <View testID={testIDs.USER_SCREEN_PROFILE_INFO}>
        <View
          style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}
        >
          <Typography>
            {intl.formatMessage({ id: 'user.natreg.description' })}
          </Typography>
        </View>
        <InfoLine
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'user.natreg.displayName' })}
          value={natRegData?.fullName}
          valueTestID={testIDs.USER_PROFILE_INFO_DISPLAY_NAME_VALUE}
        />
        <InfoLineRow>
          <InfoLine
            loading={loadingNatReg}
            error={errorNatReg}
            label={intl.formatMessage({ id: 'user.natreg.nationalId' })}
            value={
              !loadingNatReg && !errorNatReg && natRegData?.nationalId
                ? formatNationalId(natRegData?.nationalId)
                : undefined
            }
          />
          <InfoLine
            loading={loadingNatReg}
            error={errorNatReg}
            label={intl.formatMessage({ id: 'user.natreg.birthPlace' })}
            value={natRegData?.birthPlace}
          />
        </InfoLineRow>
        <InfoLine
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'user.natreg.legalResidence' })}
          value={natRegData?.legalResidence}
        />
        <InfoLineRow>
          <InfoLine
            loading={loadingNatReg}
            error={errorNatReg}
            label={intl.formatMessage({ id: 'user.natreg.gender' })}
            value={
              !loadingNatReg && !errorNatReg
                ? intl.formatMessage(
                    { id: 'user.natreg.genderValue' },
                    {
                      gender: natRegData?.gender ?? '',
                    },
                  )
                : undefined
            }
          />
          <InfoLine
            loading={loadingNatReg}
            error={errorNatReg}
            label={intl.formatMessage({
              id: 'user.natreg.maritalStatus',
            })}
            value={
              !loadingNatReg && !errorNatReg
                ? intl.formatMessage(
                    { id: 'user.natreg.maritalStatusValue' },
                    {
                      maritalStatus: natRegData?.maritalStatus ?? '',
                    },
                  )
                : undefined
            }
          />
        </InfoLineRow>
        <InfoLine
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'user.natreg.citizenship' })}
          value={natRegData?.citizenship?.name}
        />
        <InfoLine
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'user.natreg.religion' })}
          value={natRegData?.religion}
        />
      </View>
    </ScrollView>
  )
}
