import { Stack } from 'expo-router'
import { useIntl } from 'react-intl'
import { modalScreenOptions, tabScreenOptions } from '@/constants/screen-options'

export default function HealthLayout() {
  const intl = useIntl()
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        ...tabScreenOptions,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: intl.formatMessage({ id: 'health.overview.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          title: intl.formatMessage({ id: 'health.categories.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="vaccinations"
        options={{
          title: intl.formatMessage({ id: 'health.vaccinations.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="appointments/index"
        options={{
          title: intl.formatMessage({ id: 'health.appointments.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="appointments/[id]"
        options={{
          title: intl.formatMessage({
            id: 'health.appointments.detailTitle',
          }),
        }}
      />
      <Stack.Screen
        name="questionnaires/index"
        options={{
          title: intl.formatMessage({
            id: 'health.questionnaires.screenTitle',
          }),
        }}
      />
      <Stack.Screen
        name="questionnaires/[id]"
        options={{
          title: intl.formatMessage({
            id: 'health.questionnaires.screenTitle',
          }),
        }}
      />
      {/* New health screen */}
      <Stack.Screen
        name="medicine/index"
        options={{
          title: intl.formatMessage({ id: 'health.prescriptionsAndCertificates.screenTitle' }),
        }}
      />
      {/* Legacy health screen from the old app */}
      <Stack.Screen
        name="medicine/legacy"
        options={{
          title: intl.formatMessage({ id: 'health.drugCertificates.title' }),
        }}
      />
      <Stack.Screen
        name="medicine/prescriptions/index"
        options={{
          title: intl.formatMessage({ id: 'health.drugCertificates.title' }),
        }}
      />
      <Stack.Screen
        name="medicine/prescriptions/history/[id]"
        options={{
          ...modalScreenOptions,
          title: intl.formatMessage({ id: 'health.medicineHistory.title' }),
        }}
      />
      <Stack.Screen
        name="medicine/delegation/index"
        options={{
          title: intl.formatMessage({
            id: 'health.medicineDelegation.screenTitle',
          }),
        }}
      />
      <Stack.Screen
        name="medicine/delegation/add"
        options={{
          ...modalScreenOptions,
          title: intl.formatMessage({
            id: 'health.medicineDelegation.form.title',
          }),
        }}
      />
      <Stack.Screen
        name="medicine/delegation/[id]"
        options={{
          ...modalScreenOptions,
          title: intl.formatMessage({
            id: 'health.medicineDelegation.screenTitle',
          }),
        }}
      />
    </Stack>
  )
}
