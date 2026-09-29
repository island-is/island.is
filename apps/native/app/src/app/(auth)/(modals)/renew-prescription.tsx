import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useTheme } from 'styled-components/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Alert, Button, Select, Typography } from '@/ui'
import { toast, ToastHost } from '@/components/toast'
import {
  useGetPrescriptionRenewalTargetsQuery,
  usePostPrescriptionRenewalMutation,
} from '@/graphql/types/schema'

type RenewPrescriptionParams = {
  id: string
  name?: string
  type?: string
  indication?: string
  dosageInstructions?: string
  totalPrescribedAmount?: string
  renewResponseMessage?: string
}

// Encodes a target's composite key into a single Select option value.
const toOptionValue = (groupId: number, nodeId: string) =>
  `${groupId}:${nodeId}`

export default function RenewPrescriptionScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<RenewPrescriptionParams>()
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined,
  )
  const { data, loading: targetsLoading } =
    useGetPrescriptionRenewalTargetsQuery({
      variables: { prescriptionId: params.id },
      fetchPolicy: 'network-only',
      skip: !params.id,
    })

  const targets = useMemo(
    () => data?.healthDirectoratePrescriptionRenewalTargets ?? [],
    [data],
  )

  const options = useMemo(
    () =>
      targets.map((target) => ({
        label: target.name,
        value: toOptionValue(target.groupId, target.nodeId),
      })),
    [targets],
  )

  // Default the selection to the first target once they load.
  useEffect(() => {
    if (!selectedValue && options.length > 0) {
      setSelectedValue(options[0].value)
    }
  }, [options, selectedValue])

  const [postRenewal, { loading: submitting }] =
    usePostPrescriptionRenewalMutation({
      // The mutation returns no renewal state, so refetch the list to see the
      // pending state. Await it so the list is fresh before we pop back.
      refetchQueries: ['GetDrugPrescriptions'],
      awaitRefetchQueries: true,
    })

  const noTargets = !targetsLoading && options.length === 0
  // With a single recipient there is nothing to pick, so the dropdown is
  // dropped and the renewal is submitted against that one target.
  const singleTarget = options.length === 1
  // Until the targets are in we don't know which of the three it is, so show
  // nothing rather than a placeholder that may turn out to be wrong.
  const showRecipient = !targetsLoading && !singleTarget

  const fields = [
    {
      label: intl.formatMessage({
        id: 'health.prescriptions.renewalModal.medicineName',
      }),
      value: params.name,
    },
    {
      label: intl.formatMessage({ id: 'health.prescriptions.type' }),
      value: params.type,
    },
    {
      label: intl.formatMessage({
        id: 'health.prescriptions.renewalModal.usedFor',
      }),
      value: params.indication,
    },
    {
      label: intl.formatMessage({
        id: 'health.prescriptions.dosageInstructions',
      }),
      value: params.dosageInstructions,
    },
    {
      label: intl.formatMessage({ id: 'health.prescriptions.quantity' }),
      value: params.totalPrescribedAmount,
    },
  ].filter((field) => field.value)

  const onSubmit = async () => {
    const selected = selectedValue ?? options[0]?.value
    if (!params.id || !selected) {
      toast.error(
        intl.formatMessage({ id: 'health.prescriptions.renewalModal.error' }),
      )
      return
    }
    const [groupId, nodeId] = selected.split(':')
    try {
      // The mutation resolves to `null` on success (the backend fires the
      // request and returns nothing), so success is "it didn't throw / no
      // GraphQL errors" rather than a non-null payload.
      const res = await postRenewal({
        variables: {
          input: { id: params.id, nodeId, groupId: Number(groupId) },
        },
      })
      if (res.errors?.length) {
        throw new Error('Renewal returned errors')
      }
      router.back()
      toast.success(
        intl.formatMessage({ id: 'health.prescriptions.renewalModal.success' }),
      )
    } catch {
      toast.error(
        intl.formatMessage({ id: 'health.prescriptions.renewalModal.error' }),
      )
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        // The sheet reports no bottom inset of its own, so let iOS resolve the
        // safe area against the scroll view itself. Without this the content
        // ends underneath the sheet's bottom edge.
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: theme.spacing[2],
          // The buttons are the last thing in the scroll content, so it has to
          // end clear of the bottom edge and the home indicator for the cancel
          // button to scroll fully into view.
          paddingBottom: Math.max(insets.bottom, theme.spacing[8]),
        }}
      >
        <View>
          <Typography
            variant="heading3"
            style={{ marginBottom: theme.spacing[1] }}
          >
            {intl.formatMessage({
              id: 'health.prescriptions.renewalModal.title',
            })}
          </Typography>
          <Typography
            variant="body2"
            weight="300"
            style={{ marginBottom: theme.spacing[1] }}
          >
            {intl.formatMessage({
              id: 'health.prescriptions.renewalModal.description',
            })}
          </Typography>

          {/* Nothing stands here while the targets load. Once they are in:
              the warning when there are none, the dropdown when there is a
              choice to make, and nothing at all for a lone recipient. */}
          {showRecipient && (
            <View
              style={{
                marginTop: theme.spacing[2],
                marginBottom: theme.spacing[3],
              }}
            >
              {noTargets ? (
                <Alert
                  type="warning"
                  hasBorder
                  message={intl.formatMessage({
                    id: 'health.prescriptions.renewalModal.noTargets',
                  })}
                />
              ) : (
                <Select
                  label={intl.formatMessage({
                    id: 'health.prescriptions.renewalModal.selectRecipient',
                  })}
                  options={options}
                  value={selectedValue}
                  onSelect={setSelectedValue}
                />
              )}
            </View>
          )}

          {fields.map((field, index) => (
            <View
              key={index}
              style={{
                paddingVertical: theme.spacing[2],
                borderBottomWidth: 1,
                borderBottomColor: theme.color.blue200,
              }}
            >
              <Typography
                variant="body3"
                style={{ marginBottom: theme.spacing.smallGutter }}
              >
                {field.label}
              </Typography>
              <Typography variant="heading5">{field.value}</Typography>
            </View>
          ))}

          {/* The prescriber's word on the last request — the same note the
              card shows when expanded. Carried over so a dismissed renewal
              still says why before the user asks again. */}
          {!!params.renewResponseMessage && (
            <View style={{ marginTop: theme.spacing[3] }}>
              <Alert
                type="warning"
                size="small"
                hasBorder
                message={params.renewResponseMessage}
              />
            </View>
          )}
        </View>

        <View style={{ marginTop: theme.spacing[3], gap: theme.spacing[1] }}>
          <Button
            title={intl.formatMessage({ id: 'health.prescriptions.renew' })}
            onPress={onSubmit}
            // The recipients decide whether there is anything to submit, so
            // the button spins while they load rather than sitting inert.
            loading={submitting || targetsLoading}
            disabled={submitting || targetsLoading || noTargets}
            style={{ alignSelf: 'stretch' }}
          />
          <Button
            isOutlined
            title={intl.formatMessage({
              id: 'health.prescriptions.renewalModal.cancel',
            })}
            onPress={() => router.back()}
            disabled={submitting}
            style={{ alignSelf: 'stretch' }}
          />
        </View>
      </ScrollView>
      <ToastHost />
    </View>
  )
}
