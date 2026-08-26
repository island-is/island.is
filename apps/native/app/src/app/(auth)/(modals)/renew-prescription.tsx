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
  // Measured height of the floating action bar so the scroll content can be
  // padded to clear it (nothing hides permanently behind the buttons).
  const [footerHeight, setFooterHeight] = useState(0)

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
      refetchQueries: ['GetDrugPrescriptions'],
    })

  const noTargets = !targetsLoading && options.length === 0

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
        contentContainerStyle={{
          padding: theme.spacing[2],
          // Clear the floating action bar plus some breathing room so every
          // field can be scrolled up above the buttons.
          paddingBottom: footerHeight + theme.spacing[10],
        }}
      >
        <View>
          <Typography
            variant="heading2"
            style={{ marginBottom: theme.spacing[1] }}
          >
            {intl.formatMessage({
              id: 'health.prescriptions.renewalModal.title',
            })}
          </Typography>
          <Typography
            variant="body2"
            style={{ marginBottom: theme.spacing[3] }}
          >
            {intl.formatMessage({
              id: 'health.prescriptions.renewalModal.description',
            })}
          </Typography>

          {/* Reserve this slot from first render so the layout doesn't jump
              when the targets arrive: show the select (disabled while loading)
              and only swap to the warning if there are genuinely no targets. */}
          <View style={{ marginBottom: theme.spacing[3] }}>
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
                disabled={targetsLoading}
              />
            )}
          </View>

          <Typography
            variant="eyebrow"
            style={{ marginBottom: theme.spacing[1] }}
          >
            {intl.formatMessage({
              id: 'health.prescriptions.renewalModal.medicineInformation',
            })}
          </Typography>

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
                variant="eyebrow"
                style={{ marginBottom: theme.spacing.smallGutter }}
              >
                {field.label}
              </Typography>
              <Typography variant="heading5">{field.value}</Typography>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: theme.spacing[2],
          paddingBottom: theme.spacing[2] + insets.bottom,
          gap: theme.spacing[1],
          backgroundColor: theme.color.white,
        }}
      >
        <Button
          title={intl.formatMessage({ id: 'health.prescriptions.renew' })}
          onPress={onSubmit}
          loading={submitting}
          disabled={submitting || noTargets}
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
      <ToastHost />
    </View>
  )
}
