import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, ScrollView, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'

import { Button, NavigationBarSheet, TextField, Typography } from '../../ui'
import { useGetProfileQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { bankInfoObject, stringifyBankData } from '../../lib/bank-info-helper'
import { testIDs } from '../../utils/test-ids'
import { useUpdateUserProfile } from './utils/profile-queries'

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

export const EditBankInfoScreen: NavigationFunctionComponent<any> = ({
  componentId,
  bankInfo = '',
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const userProfile = useGetProfileQuery()
  const { updateUserProfile, loading } = useUpdateUserProfile()
  const [info, setInfo] = useState(bankInfoObject(bankInfo))
  const [bank, onChangeBankText] = useState(info?.bank ?? '')
  const [l, onChangeBookText] = useState(info?.l ?? '')
  const [account, onChangeNumberText] = useState(info?.account ?? '')
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (userProfile.data?.getUserProfile?.bankInfo) {
      const obj = bankInfoObject(userProfile.data?.getUserProfile?.bankInfo)
      if (obj) {
        setInfo(obj)
        onChangeBankText(obj.bank)
        onChangeBookText(obj.l)
        onChangeNumberText(obj.account)
      }
    }
  }, [userProfile])

  const checkSetPristineInput = () => {
    setDisabled(
      stringifyBankData(info) ===
        stringifyBankData({
          bank,
          l,
          account,
        }),
    )
  }

  useEffect(() => {
    checkSetPristineInput()
  }, [bank, l, account])

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_EDIT_BANK_INFO}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'edit.bankinfo.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
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

                  Navigation.dismissModal(componentId)
                } else {
                  // failure
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
    </View>
  )
}

EditBankInfoScreen.options = getNavigationOptions
