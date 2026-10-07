import { router } from 'expo-router'
import * as kennitala from 'kennitala'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Platform, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import {
  useIdentityQueryLazyQuery,
  usePostMedicineDelegationMutation,
} from '@/graphql/types/schema'
import {
  Button,
  Checkbox,
  DatePickerInput,
  Tag,
  TextField,
  Typography,
} from '@/ui'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'
import { StackScreen } from '../../../../../../components/stack-screen'

const Host = styled(View)`
  flex: 1;
`

const Content = styled(ScrollView)`
  flex: 1;
`

const FormContainer = styled(View)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

const Title = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const Header = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const Fields = styled(View)`
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const ValidityHeading = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  /* The checkbox brings its own 16px of vertical padding, so this only tops
     it up to a section gap instead of doubling it. */
  margin-top: ${({ theme }) => theme.spacing[1]}px;
`

const QuickLabelsContainer = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[1]}px;
`

const QuickLabel = styled(View)`
  flex: 1;
`

const Actions = styled(View)`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const ErrorMessage = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  color: ${({ theme }) => theme.color.red600};
`

const QUICK_LABEL_TYPE = {
  Months: 'Months',
  Years: 'Years',
} as const

type QuickLabelType = typeof QUICK_LABEL_TYPE[keyof typeof QUICK_LABEL_TYPE]

export default function MedicineDelegationFormScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const [nationalId, setNationalId] = useState('')
  const [name, setName] = useState('')
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date())
  const [dateTo, setDateTo] = useState<Date | undefined>()
  const [nameError, setNameError] = useState<string | undefined>()
  const [delegateError, setDelegateError] = useState<string | undefined>()
  const [lookup, setLookup] = useState(false)

  const [
    delegateMedicineDelegation,
    { loading: loadingDelegateMedicineDelegation },
  ] = usePostMedicineDelegationMutation({
    refetchQueries: ['GetMedicineDelegations'],
    onCompleted: (response) => {
      if (response.healthDirectorateMedicineDelegationCreate.success) {
        close()
      } else {
        setDelegateError(
          intl.formatMessage({
            id: 'health.medicineDelegation.form.delegateMedicineDelegationError',
          }),
        )
      }
    },
    onError: () => {
      setDelegateError(
        intl.formatMessage({
          id: 'health.medicineDelegation.form.delegateMedicineDelegationError',
        }),
      )
    },
  })

  const [getIdentity, { loading: loadingNames }] = useIdentityQueryLazyQuery({
    onCompleted: ({ identity }) => {
      if (identity?.name) {
        setName(identity.name)
        setNameError(undefined)
      } else {
        setNameError(
          intl.formatMessage({
            id: 'health.medicineDelegation.form.nameNotFound',
          }),
        )
      }
    },
    onError: () => {
      setNameError(
        intl.formatMessage({ id: 'health.medicineDelegation.form.nameError' }),
      )
    },
  })

  const changeNationalId = (value: string) => {
    setNationalId(value)
    if (value.length !== 10) {
      setName('')
      setNameError(undefined)
      return
    }

    if (!kennitala.isValid(value)) {
      setNameError(
        intl.formatMessage({
          id: 'health.medicineDelegation.form.invalidNationalId',
        }),
      )
      return
    }

    getIdentity({
      variables: { input: { nationalId: value.replace('-', '') } },
    })
  }

  const isValid =
    nationalId.trim() !== '' && name.trim() !== '' && !!dateFrom && !!dateTo

  const close = () => router.back()

  const createMedicineDelegation = () => {
    if (isValid) {
      delegateMedicineDelegation({
        variables: {
          input: {
            nationalId,
            from: dateFrom?.toISOString(),
            to: dateTo?.toISOString(),
            lookup,
          },
        },
      })
    }
  }

  const getQuickLabels = (value: number, type: QuickLabelType) => {
    return intl.formatMessage(
      {
        id: 'health.medicineDelegation.form.x' + type,
      },
      {
        [type.toLowerCase()]: value,
      },
    )
  }
  const quickLabels: { value: number; type: QuickLabelType }[] = [
    {
      value: 6,
      type: QUICK_LABEL_TYPE.Months,
    },
    {
      value: 1,
      type: QUICK_LABEL_TYPE.Years,
    },
    {
      value: 2,
      type: QUICK_LABEL_TYPE.Years,
    },
    {
      value: 3,
      type: QUICK_LABEL_TYPE.Years,
    },
  ]

  const getQuickSelectDate = (value: number, type: QuickLabelType) => {
    const currentTime = dateFrom?.getTime() ?? new Date().getTime()

    return type === QUICK_LABEL_TYPE.Months
      ? addMonths(currentTime, value)
      : addYears(currentTime, value)
  }

  return (
    <Host>
      <StackScreen options={{ title: '' }} closeable />
      <Content
        keyboardShouldPersistTaps="handled"
        // The kennitala field opens a number pad, which has no return key to
        // close the keyboard with, so a drag is what closes it. On iOS that is
        // a drag down over the keyboard itself, leaving the rest of the form
        // free to scroll; Android has no interactive mode, so any drag closes.
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        // Inset the form by the keyboard so every field - and the submit
        // button - can still be scrolled into the space above it.
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        contentContainerStyle={{
          paddingBottom: theme.spacing[2] + insets.bottom,
        }}
      >
        <FormContainer>
          <Title variant="heading3">
            {intl.formatMessage({
              id: 'health.medicineDelegation.form.title',
            })}
          </Title>
          <Header>
            <Typography variant="heading5">
              {intl.formatMessage({
                id: 'health.medicineDelegation.form.subtitle',
              })}
            </Typography>
          </Header>
          <Fields>
            <TextField
              label={intl.formatMessage({
                id: 'health.medicineDelegation.form.nationalIdLabel',
              })}
              value={nationalId}
              onChange={changeNationalId}
              keyboardType="number-pad"
              maxLength={10}
              inputMode="numeric"
              loading={loadingNames}
              errorMessage={nameError}
            />
            <TextField
              readOnly={true}
              label={intl.formatMessage({
                id: 'health.medicineDelegation.form.nameLabel',
              })}
              value={name}
              editable={false}
            />
          </Fields>
          <Checkbox
            label={intl.formatMessage({
              id: 'health.medicineDelegation.form.lookupLabel',
            })}
            checked={lookup}
            onPress={() => setLookup((prev) => !prev)}
            borderBottom={false}
          />
          <ValidityHeading variant="heading5">
            {intl.formatMessage({
              id: 'health.medicineDelegation.form.validityLabel',
            })}
          </ValidityHeading>
          <Fields>
            <QuickLabelsContainer>
              {quickLabels.map((label) => (
                <QuickLabel key={label.value}>
                  <Tag
                    title={getQuickLabels(label.value, label.type)}
                    onPress={() => {
                      setDateTo(getQuickSelectDate(label.value, label.type))
                    }}
                    active={
                      dateTo?.getTime() ===
                      getQuickSelectDate(label.value, label.type)?.getTime()
                    }
                  />
                </QuickLabel>
              ))}
            </QuickLabelsContainer>
            <DatePickerInput
              label={intl.formatMessage({
                id: 'health.medicineDelegation.form.dateFromLabel',
              })}
              placeholder={intl.formatMessage({
                id: 'health.medicineDelegation.form.dateFromPlaceholder',
              })}
              minimumDate={new Date()}
              selectedDate={dateFrom}
              onSelectDate={setDateFrom}
            />
            <DatePickerInput
              label={intl.formatMessage({
                id: 'health.medicineDelegation.form.dateToLabel',
              })}
              placeholder={intl.formatMessage({
                id: 'health.medicineDelegation.form.dateToPlaceholder',
              })}
              minimumDate={dateFrom ?? new Date()}
              selectedDate={dateTo}
              onSelectDate={setDateTo}
            />
          </Fields>
          {delegateError && (
            <ErrorMessage variant="body3">{delegateError}</ErrorMessage>
          )}
          <Actions>
            <Button
              title={intl.formatMessage({
                id: 'health.medicineDelegation.form.submit',
              })}
              onPress={createMedicineDelegation}
              disabled={!isValid || loadingDelegateMedicineDelegation}
              loading={loadingDelegateMedicineDelegation}
              style={{ alignSelf: 'stretch' }}
            />
          </Actions>
        </FormContainer>
      </Content>
    </Host>
  )
}
