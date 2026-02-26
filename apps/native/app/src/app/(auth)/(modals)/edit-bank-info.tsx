import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, ScrollView, View } from 'react-native'
import { router } from 'expo-router'

import { Button, NavigationBarSheet, TextField, Typography } from '@/ui'
import { useGetProfileQuery } from '@/graphql/types/schema'
import { bankInfoObject, stringifyBankData } from '@/lib/bank-info-helper'
import { testIDs } from '@/utils/test-ids'
import { useUpdateUserProfile } from '../../../hooks/use-update-user-profile'

export default function EditBankInfoScreen() {
  const intl = useIntl()
  const userProfile = useGetProfileQuery()
  const { updateUserProfile, loading } = useUpdateUserProfile()
  const [info, setInfo] = useState(bankInfoObject(''))
  const [bank, onChangeBankText] = useState(info?.bank ?? '')
  const [l, onChangeBookText] = useState(info?.l ?? '')
  const [account, onChangeNumberText] = useState(info?.account ?? '')
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (userProfile.data?.getUserProfile?.bankInfo) {
      const obj = bankInfoObject(userProfile.data.getUserProfile.bankInfo)
      if (obj) {
        setInfo(obj)
        onChangeBankText(obj.bank)
        onChangeBookText(obj.l)
        onChangeNumberText(obj.account)
      }
    }
  }, [userProfile.data])

  useEffect(() => {
    setDisabled(
      stringifyBankData(info) ===
        stringifyBankData({ bank, l, account }),
    )
  }, [bank, l, account])

  return (
    <ScrollView
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      testID={testIDs.SCREEN_EDIT_BANK_INFO}
      stickyHeaderIndices={[0]}
    >
      <NavigationBarSheet
        componentId="edit-bank-info"
        title={intl.formatMessage({ id: 'edit.bankinfo.screenTitle' })}
        onClosePress={() => router.back()}
        style={{ marginHorizontal: 16 }}
        showLoading={userProfile.loading && !!userProfile.data}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ marginBottom: 32, marginTop: 8 }}>
          <Typography>
            {intl.formatMessage({ id: 'edit.bankinfo.description' })}
          </Typography>
        </View>
        <View style={{ marginBottom: 24, flexDirection: 'row' }}>
          <TextField
            style={{ marginRight: 8, width: 90 }}
            label={intl.formatMessage({
              id: 'edit.bankinfo.inputlabel.bank',
            })}
            value={bank}
            onChange={onChangeBankText}
            maxLength={4}
            keyboardType="decimal-pad"
          />
          <TextField
            style={{ marginRight: 8, width: 70 }}
            label={intl.formatMessage({
              id: 'edit.bankinfo.inputlabel.book',
            })}
            value={l}
            onChange={onChangeBookText}
            maxLength={2}
            keyboardType="decimal-pad"
          />
          <TextField
            style={{ flexGrow: 1 }}
            label={intl.formatMessage({
              id: 'edit.bankinfo.inputlabel.number',
            })}
            value={account}
            onChange={onChangeNumberText}
            maxLength={6}
            keyboardType="decimal-pad"
          />
        </View>
        <Button
          disabled={loading || disabled}
          title={intl.formatMessage({ id: 'edit.bankinfo.button' })}
          onPress={async () => {
            try {
              const bankData = stringifyBankData({ bank, l, account })
              if (bankData) {
                const res = await updateUserProfile({
                  bankInfo: bankData,
                })

                if (!res.data) {
                  throw new Error('Failed to update')
                }

                router.back()
              } else {
                throw new Error('Failed to update')
              }
            } catch (e) {
              Alert.alert(
                intl.formatMessage({ id: 'edit.bankinfo.error' }),
                intl.formatMessage({ id: 'edit.bankinfo.errorMessage' }),
              )
            }
          }}
        />
      </View>
    </ScrollView>
  )
}
