import { useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'

import { Divider, Input, InputRow, NavigationBarSheet } from '@/ui'
import { useGetAssetQuery } from '@/graphql/types/schema'
import { testIDs } from '@/utils/test-ids'

export default function AssetsDetailScreen() {
  const { id, address } = useLocalSearchParams<{
    id: string
    address?: string
  }>()
  const intl = useIntl()

  const { data, loading } = useGetAssetQuery({
    variables: { input: { assetId: id } },
  })

  const isLoading = loading && !data
  const appraisal = data?.assetsDetail?.appraisal
  const unitsOfUse = data?.assetsDetail?.unitsOfUse

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={{ flex: 1 }} testID={testIDs.SCREEN_VEHICLE_DETAIL} stickyHeaderIndices={[0]}>
        <NavigationBarSheet
          title={address ?? ''}
          onClosePress={() => router.back()}
          style={{ marginHorizontal: 16 }}
          showLoading={loading}
        />
        <View>
          <InputRow>
            <Input
              loading={isLoading}
              label={intl.formatMessage({
                id: 'assetsDetail.propertyNumber',
              })}
              value={id}
              size="big"
              noBorder
              isCompact
            />
          </InputRow>
          <InputRow>
            <Input
              loading={isLoading}
              label={intl.formatMessage(
                { id: 'assetsDetail.activeAppraisal' },
                { activeYear: appraisal?.activeYear },
              )}
              value={
                appraisal?.activeAppraisal
                  ? `${intl.formatNumber(appraisal.activeAppraisal)} kr.`
                  : '-'
              }
              size="big"
              noBorder
              isCompact
            />
            <Input
              loading={isLoading}
              label={intl.formatMessage(
                { id: 'assetsDetail.plannedAppraisal' },
                { plannedYear: appraisal?.plannedYear },
              )}
              value={
                appraisal?.plannedAppraisal
                  ? `${intl.formatNumber(appraisal.plannedAppraisal)} kr.`
                  : '-'
              }
              size="big"
              noBorder
              isCompact
            />
          </InputRow>

          <Divider spacing={2} style={{ marginHorizontal: 16 }} />

          {(unitsOfUse?.unitsOfUse ?? []).map((unit, index) => (
            <View key={`${unit?.propertyNumber}-${index}`}>
              <InputRow>
                <Input
                  loading={isLoading}
                  label={intl.formatMessage({
                    id: 'assetsDetail.explanation',
                  })}
                  value={unit?.explanation}
                  noBorder
                  isCompact
                />
                <Input
                  loading={isLoading}
                  label={intl.formatMessage({
                    id: 'assetsDetail.displaySize',
                  })}
                  value={`${unit?.displaySize} m²`}
                  noBorder
                  isCompact
                />
              </InputRow>

              <InputRow>
                <Input
                  loading={isLoading}
                  label={intl.formatMessage({
                    id: 'assetsDetail.municipality',
                  })}
                  value={unit?.address?.municipality}
                  noBorder
                  isCompact
                />
                <Input
                  loading={isLoading}
                  label={intl.formatMessage({
                    id: 'assetsDetail.postNumber',
                  })}
                  value={String(unit?.address?.postNumber ?? '-')}
                  noBorder
                  isCompact
                />
              </InputRow>

              <InputRow>
                {unit?.buildYearDisplay ? (
                  <Input
                    loading={isLoading}
                    label={intl.formatMessage({
                      id: 'assetsDetail.buildYearDisplay',
                    })}
                    value={unit?.buildYearDisplay}
                    noBorder
                    isCompact
                  />
                ) : null}
                <Input
                  loading={isLoading}
                  label={intl.formatMessage({ id: 'assetsDetail.marking' })}
                  value={unit?.marking}
                  noBorder
                  isCompact
                />
              </InputRow>
              {index + 1 < (unitsOfUse?.unitsOfUse ?? []).length && (
                <Divider spacing={2} style={{ marginHorizontal: 16 }} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  )
}
