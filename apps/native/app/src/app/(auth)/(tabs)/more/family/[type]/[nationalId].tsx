import { useIntl } from 'react-intl'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { router, Stack } from 'expo-router'
import { useTheme } from 'styled-components'

import {
  useNationalRegistryBioChildQuery,
  useNationalRegistryChildCustodyQuery,
  useNationalRegistrySpouseQuery,
  NationalRegistryBioChildQuery,
  NationalRegistryChildCustodyQuery,
  NationalRegistrySpouseQuery,
} from '@/graphql/types/schema'
import { Input, InputRow, NavigationBarSheet, Typography } from '@/ui'
import { formatNationalId } from '@/lib/format-national-id'
import { testIDs } from '@/utils/test-ids'

type ChildCustodyDetails = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<NationalRegistryChildCustodyQuery['nationalRegistryPerson']>
    >['childCustody']
  >[number]
>['details']

type BioChildDetails = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<NationalRegistryBioChildQuery['nationalRegistryPerson']>
    >['biologicalChildren']
  >[number]
>['details']

type SpouseDetails = NonNullable<
  NonNullable<NationalRegistrySpouseQuery['nationalRegistryPerson']>
>['spouse']

type Person = ChildCustodyDetails | BioChildDetails | SpouseDetails

export default function FamilyDetailScreen() {
  const { type, nationalId } = useLocalSearchParams<{
    type: 'bioChild' | 'custodyChild' | 'spouse'
    nationalId: string
  }>()
  const intl = useIntl()
  const theme = useTheme()

  const bioChildRes = useNationalRegistryBioChildQuery({
    variables: { childNationalId: nationalId },
    skip: type !== 'bioChild',
  })

  const custodyChildRes = useNationalRegistryChildCustodyQuery({
    variables: { childNationalId: nationalId },
    skip: type !== 'custodyChild',
  })

  const spouseRes = useNationalRegistrySpouseQuery({
    skip: type !== 'spouse',
  })

  const person: Person =
    bioChildRes.data?.nationalRegistryPerson?.biologicalChildren?.find(
      (child) => child.details?.nationalId === nationalId,
    )?.details ||
    custodyChildRes?.data?.nationalRegistryPerson?.childCustody?.find(
      (child) => child.details?.nationalId === nationalId,
    )?.details ||
    spouseRes.data?.nationalRegistryPerson?.spouse ||
    null

  const loading =
    bioChildRes.loading || custodyChildRes.loading || spouseRes.loading
  const error = bioChildRes.error || custodyChildRes.error || spouseRes.error

  if (!person) return null

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1 }} testID={testIDs.SCREEN_VEHICLE_DETAIL}>
        <NavigationBarSheet
          componentId="family-detail"
          title={intl.formatMessage({ id: 'familyDetail.title' })}
          onClosePress={() => router.back()}
          style={{ marginHorizontal: 16 }}
        />
        <ScrollView style={{ flex: 1 }}>
          <SafeAreaView>
            <View
              style={{
                paddingBottom: theme.spacing[1],
                paddingTop: theme.spacing[2],
                paddingHorizontal: theme.spacing[2],
              }}
            >
              <Typography>
                {intl.formatMessage({ id: 'familyDetail.description' })}
              </Typography>
            </View>
            <InputRow>
              <Input
                label={intl.formatMessage({
                  id: 'familyDetail.natreg.displayName',
                })}
                value={person?.fullName}
                loading={loading}
                error={!!error}
                size="big"
              />
            </InputRow>
            <InputRow>
              <Input
                label={intl.formatMessage({
                  id: 'familyDetail.natreg.familyRelation',
                })}
                value={intl.formatMessage(
                  { id: 'familyDetail.natreg.familyRelationValue' },
                  {
                    type:
                      type === 'bioChild' || type === 'custodyChild'
                        ? 'child'
                        : type,
                  },
                )}
                loading={loading}
                error={!!error}
              />
            </InputRow>
            <InputRow>
              <Input
                label={intl.formatMessage({
                  id: 'familyDetail.natreg.nationalId',
                })}
                value={formatNationalId(person?.nationalId)}
                loading={loading}
                error={!!error}
              />
              {'citizenship' in person && person?.citizenship ? (
                <Input
                  label={intl.formatMessage({
                    id: 'familyDetail.natreg.citizenship',
                  })}
                  value={person?.citizenship?.name}
                  loading={loading}
                  error={!!error}
                />
              ) : null}
            </InputRow>
            {'housing' in person &&
            person?.housing &&
            'address' in person.housing &&
            person.housing.address ? (
              <InputRow>
                <Input
                  label={intl.formatMessage({
                    id: 'familyDetail.natreg.legalResidence',
                  })}
                  value={
                    'postalCode' in person.housing.address &&
                    'city' in person.housing.address
                      ? `${person?.housing.address?.streetAddress}, ${person?.housing.address?.postalCode} ${person?.housing.address?.city}`
                      : person?.housing.address?.streetAddress
                  }
                  loading={loading}
                  error={!!error}
                />
              </InputRow>
            ) : null}

            <InputRow>
              {'gender' in person && person.gender ? (
                <Input
                  label={intl.formatMessage({
                    id: 'familyDetail.natreg.gender',
                  })}
                  value={intl.formatMessage(
                    { id: 'user.natreg.genderValue' },
                    { gender: person.gender },
                  )}
                  loading={loading}
                  error={!!error}
                />
              ) : null}
              {'birthplace' in person && person?.birthplace ? (
                <Input
                  label={intl.formatMessage({
                    id: 'familyDetail.natreg.birthPlace',
                  })}
                  value={person?.birthplace?.location}
                  loading={loading}
                  error={!!error}
                />
              ) : null}
            </InputRow>
          </SafeAreaView>
        </ScrollView>
      </View>
    </>
  )
}
