import React from 'react'
import { useIntl } from 'react-intl';
import { ScrollView, View, Text } from "react-native";
import { testIDs } from '../../utils/test-ids'
import { Navigation, NavigationFunctionComponent } from "react-native-navigation";
import { Input, InputRow, NavigationBarSheet } from '@island.is/island-ui-native';
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options';
import { useQuery } from '@apollo/client';
import { client } from '../../graphql/client'
import { NATIONAL_REGISTRY_FAMILY_DETAIL } from '../../graphql/queries/get-national-registry-family-detail';
import { formatNationalId } from '../profile/tab-personal-info';

const {
  getNavigationOptions,
  useNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const FamilyDetailScreen: NavigationFunctionComponent<{ nationalId: string, type: string }> = ({ componentId, nationalId, type }) => {
  useNavigationOptions(componentId)

  const { data, loading, error } = useQuery(NATIONAL_REGISTRY_FAMILY_DETAIL,
    {
    client,
    fetchPolicy: 'cache-first',
    variables: {
      input: { familyMemberNationalId: nationalId },
    },
  })

  const intl = useIntl()
  const isError = !!error;
  const item = data?.nationalRegistryFamilyDetail || {};

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_VEHICLE_DETAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'familyDetail.title' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
    <ScrollView style={{ flex: 1 }} >
      <View>
        <Text style={{ paddingBottom: 8, paddingTop: 16, paddingHorizontal: 16, fontWeight: '300' }}>{intl.formatMessage({ id: 'familyDetail.description' })}</Text>
        <InputRow>
          <Input
            loading={loading}
            error={isError}
            label={intl.formatMessage({ id: 'familyDetail.natreg.displayName' })}
            value={item?.fullName}
            size="big"
          />
        </InputRow>

        <InputRow>
          <Input
            loading={loading}
            error={isError}
            label={intl.formatMessage({ id: 'familyDetail.natreg.familyRelation' })}
            value={intl.formatMessage({ id: 'familyDetail.natreg.familyRelationValue'}, {type})}
          />
        </InputRow>
        <InputRow>
          <Input
            loading={loading}
            error={isError}
            label={intl.formatMessage({ id: 'familyDetail.natreg.nationalId' })}
            value={formatNationalId(item?.nationalId)}
          />
          <Input
            loading={loading}
            error={isError}
            label={intl.formatMessage({ id: 'familyDetail.natreg.citizenship' })}
            value={item?.nationality}
          />
        </InputRow>
        <InputRow>
          <Input
            loading={loading}
            error={isError}
            label={intl.formatMessage({ id: 'familyDetail.natreg.legalResidence' })}
            value={item?.legalResidence}
          />
        </InputRow>

        <InputRow>
          <Input
            loading={loading}
            error={isError}
            label={intl.formatMessage({ id: 'familyDetail.natreg.gender' })}
            value={item?.genderDisplay}
          />
          <Input
            loading={loading}
            error={isError}
            label={intl.formatMessage({ id: 'familyDetail.natreg.birthPlace' })}
            value={item?.birthplace}
          />
        </InputRow>


      </View>
    </ScrollView>
    </View>
  );
}

FamilyDetailScreen.options = getNavigationOptions
