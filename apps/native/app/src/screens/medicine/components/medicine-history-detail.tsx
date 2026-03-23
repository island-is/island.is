import React from 'react'
import { useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'

import { HealthDirectorateMedicineHistoryDispensation } from '../../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../../hooks/create-navigation-option-hooks'
import { Badge, Input, InputRow, NavigationBarSheet } from '../../../ui'

const { useNavigationOptions } = createNavigationOptionHooks(() => ({
  topBar: {
    visible: false,
  },
}))

type Props = {
  dispensation: HealthDirectorateMedicineHistoryDispensation
  number: number
}

export const MedicineHistoryDetailScreen: NavigationFunctionComponent<
  Props
> = ({ componentId, dispensation, number }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()

  if (!dispensation) {
    return null
  }

  const formatDate = (date?: string | null) =>
    date ? intl.formatDate(date) : ''

  return (
    <View style={{ flex: 1 }}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage(
          { id: 'health.prescriptions.dispensationDetail.title' },
          { count: number },
        )}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }}>
        <View>
          <InputRow>
            <Input
              label={intl.formatMessage({
                id: 'health.prescriptions.history.table.dispensery',
              })}
              value={dispensation.agentName ?? ''}
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({
                id: 'health.prescriptions.dispensationNumber',
              })}
              value={formatDate(dispensation.date ?? dispensation.issueDate)}
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({ id: 'health.prescriptions.drug' })}
              value={dispensation.name ?? ''}
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({ id: 'health.prescriptions.type' })}
              value={dispensation.type ?? ''}
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({
                id: 'health.prescriptions.quantity',
              })}
              value={String(dispensation.quantity ?? '')}
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({
                id: 'health.prescriptions.dosageInstructions',
              })}
              value={dispensation.dosageInstructions ?? ''}
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({
                id: 'health.prescriptions.indication',
              })}
              value={dispensation.indication ?? ''}
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({
                id: 'health.prescriptions.issueDate',
              })}
              value={formatDate(dispensation.issueDate)}
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({
                id: 'health.prescriptions.expiresAt',
              })}
              value={formatDate(dispensation.expirationDate)}
              rightElement={
                dispensation.isExpired ? (
                  <Badge
                    title={intl.formatMessage({
                      id: 'health.prescriptionsAndCertificates.expired',
                    })}
                    variant="red"
                    outlined
                  />
                ) : undefined
              }
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({
                id: 'health.prescriptions.doctor',
              })}
              value={dispensation.prescriberName ?? ''}
            />
          </InputRow>
        </View>
      </ScrollView>
    </View>
  )
}
