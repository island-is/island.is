import React from 'react'
import { useIntl } from 'react-intl';
import { ScrollView, View, SafeAreaView, Image } from "react-native";
import { testIDs } from '../../utils/test-ids'
import { Navigation, NavigationFunctionComponent } from "react-native-navigation";
import { EmptyList, Input, InputRow, NavigationBarSheet, Typography } from '@island.is/island-ui-native';
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options';
import { formatNationalId } from '../profile/tab-personal-info';
import illustrationSrc from '../../assets/illustrations/hero_spring.png'

const {
  getNavigationOptions,
  useNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const FamilyDetailScreen: NavigationFunctionComponent<{ item: any, type: string }> = ({ componentId, item, type }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()

  if (!item) {
    return (
      <View style={{ flex: 1 }}>
        <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'familyDetail.title' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
        <EmptyList
          title={intl.formatMessage({ id: 'family.emptyListTitle' })}
          description={intl.formatMessage({
            id: 'familyDetail.emptyListDescription',
          })}
          image={
            <Image source={illustrationSrc} height={196} width={261} />
          }
        />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_VEHICLE_DETAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'familyDetail.title' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }} >
        <SafeAreaView>
          <View style={{ paddingBottom: 8, paddingTop: 16, paddingHorizontal: 16 }}>
            <Typography>{intl.formatMessage({ id: 'familyDetail.description' })}</Typography>
          </View>
          <InputRow>
            <Input
              label={intl.formatMessage({ id: 'familyDetail.natreg.displayName' })}
              value={item?.name || item?.displayName}
              size="big"
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({ id: 'familyDetail.natreg.familyRelation' })}
              value={intl.formatMessage({ id: 'familyDetail.natreg.familyRelationValue'}, {type})}
            />
          </InputRow>
          <InputRow>
            <Input
              label={intl.formatMessage({ id: 'familyDetail.natreg.nationalId' })}
              value={formatNationalId(item?.nationalId)}
            />
            {item?.nationality ? (
              <Input
                label={intl.formatMessage({ id: 'familyDetail.natreg.citizenship' })}
                value={item?.nationality}
              />) : null
            }
          </InputRow>
          {item?.legalResidence ? (
            <InputRow>
              <Input
                label={intl.formatMessage({ id: 'familyDetail.natreg.legalResidence' })}
                value={item?.legalResidence}
              />
            </InputRow> ) : null
          }

          <InputRow>
          {item?.genderDisplay ?
            <Input
              label={intl.formatMessage({ id: 'familyDetail.natreg.gender' })}
              value={item?.genderDisplay}
            /> : null
          }
          {item?.birthplace ?
            <Input
              label={intl.formatMessage({ id: 'familyDetail.natreg.birthPlace' })}
              value={item?.birthplace}
            /> : null
          }
          </InputRow>

        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

FamilyDetailScreen.options = getNavigationOptions
