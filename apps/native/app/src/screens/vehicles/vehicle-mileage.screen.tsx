import {FormattedDate, FormattedNumber, useIntl} from 'react-intl';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {FlatList, Pressable, Alert, View} from 'react-native';
import {
  Button,
  Divider,
  Input,
  TextField,
  Typography,
  useDynamicColor,
} from '@ui';
import externalLinkIcon from '../../assets/icons/external-link.png';
import {useCallback, useMemo, useState} from 'react';
import {
  GetVehicleMileageDocument,
  GetVehicleMileageQuery,
  VehicleFragmentFragmentDoc,
  VehicleMileageDetailFragmentFragmentDoc,
  useGetUserVehiclesDetailQuery,
  useGetVehicleMileageQuery,
  usePostVehicleMileageMutation,
  useUpdateVehicleMileageMutation,
} from '../../graphql/types/schema';
import {client} from '../../graphql/client';
import {MileageCell} from './components/mileage-cell';
const {getNavigationOptions, useNavigationOptions} =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }));

export const originCodes = {
  'ISLAND.IS': 'Ísland.is',
  SKODUN: 'Skoðunarstöð',
};

type ListItem =
  | NonNullable<
      NonNullable<GetVehicleMileageQuery['vehicleMileageDetails']>['data']
    >[number]
  | {
      __typename: 'Skeleton';
      internalId: number;
    };

export const VehicleMileageScreen: NavigationFunctionComponent<{
  id: string;
}> = ({componentId, id}) => {
  useNavigationOptions(componentId);
  const intl = useIntl();
  const [input, setInput] = useState('');
  const info = useGetUserVehiclesDetailQuery({
    client,
    fetchPolicy: 'cache-first',
    variables: {
      input: {
        regno: '',
        permno: id,
        vin: '',
      },
    },
  });
  const res = useGetVehicleMileageQuery({
    client,
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        permno: id,
      },
    },
  });
  const [postMileage] = usePostVehicleMileageMutation({client});
  const [updateMileage] = useUpdateVehicleMileageMutation({
    client,
    refetchQueries: [GetVehicleMileageDocument],
  });

  const data = useMemo<ListItem[]>(() => {
    if (res.loading && !res.data) {
      return Array.from({length: 6}).map((_, index) => ({
        __typename: 'Skeleton',
        internalId: index,
      }));
    }
    return res.data?.vehicleMileageDetails?.data ?? [];
  }, [res.data, res.loading]);

  // Calculate highest mileage
  const highestMileage = useMemo(() => {
    return data.reduce((acc, item) => {
      if (
        item.__typename === 'VehicleMileageDetail' &&
        typeof item.mileage === 'string'
      ) {
        const m = parseInt(item.mileage, 10);
        if (m > acc) {
          return m;
        }
      }
      return acc;
    }, 0);
  }, [data]);

  // Editable Flags
  const isFormEditable = !!res.data?.vehicleMileageDetails?.editing;
  const canRegisterMileage =
    !!res.data?.vehicleMileageDetails?.canRegisterMileage;

  const vehicle = useMemo(() => {
    return {
      type: `${info.data?.vehiclesDetail?.basicInfo?.model} ${info.data?.vehiclesDetail?.basicInfo?.subModel}`,
      year: info.data?.vehiclesDetail?.basicInfo?.year,
      color: info.data?.vehiclesDetail?.registrationInfo?.color,
    };
  }, [info.data]);

  const parseMileage = useCallback(
    (value?: string) => {
      const mileage = Number(String(value ?? '').replace(/\D/g, ''));
      if (mileage <= highestMileage) {
        // @todo intl
        Alert.alert('Error', 'Mileage input too low.');
        return false;
      } else if (mileage > 9999999) {
        // @todo intl
        Alert.alert('Error', 'Mileage input too high.');
        return false;
      }
      return String(mileage);
    },
    [highestMileage],
  );

  const onSubmit = useCallback(() => {
    const mileage = parseMileage(input);
    if (!mileage) {
      return;
    }
    return postMileage({
      variables: {
        input: {
          mileage,
          originCode: 'ISLAND.IS',
          permno: id,
        },
      },
    }).then(res => {
      if (res.data?.vehicleMileagePost?.mileage !== String(mileage)) {
        // @todo intl
        Alert.alert('Error', 'Failed to save mileage. Try again later.');
      } else {
        // @todo intl
        Alert.alert('Success', 'Mileage saved successfully.');
      }
    });
  }, [id, input, parseMileage, postMileage]);

  const onEdit = useCallback(() => {
    return Alert.prompt(
      // @todo intl
      'Edit mileage',
      undefined,
      [
        {
          isPreferred: true,
          onPress(value) {
            const mileage = parseMileage(value);
            const internalId = data[0].internalId;
            if (!mileage) {
              return;
            }
            if (!internalId) {
              // @todo intl
              return Alert.alert('Error', 'Missing internal ID');
            }
            updateMileage({
              variables: {
                input: {
                  mileage,
                  permno: id,
                  internalId,
                },
              },
            }).then(res => {
              if (res.data?.vehicleMileagePut?.mileage !== String(mileage)) {
                // @todo intl
                Alert.alert(
                  'Error',
                  'Failed to update mileage. Try again later.',
                );
              } else {
                // @todo intl
                Alert.alert('Success', 'Mileage updated successfully.');
              }
            });
          },
          // @todo intl
          text: 'Senda inn breytingu',
          style: 'default',
        },
        {
          // @todo intl
          text: 'Hætta við',
          style: 'cancel',
        },
      ],
      'plain-text',
      String(highestMileage),
      'number-pad',
    );
  }, [data, highestMileage, id, parseMileage, updateMileage]);

  return (
    <FlatList
      data={data}
      renderItem={({item, index}) =>
        item.__typename === 'Skeleton' ? (
          <MileageCell skeleton />
        ) : (
          <MileageCell
            title={
              originCodes[item.originCode as keyof typeof originCodes] ??
              item.originCode
            }
            subtitle={<FormattedDate value={item.readDate} />}
            accessory={
              item.mileage
                ? `${intl.formatNumber(parseInt(item.mileage, 10))} km`
                : '-'
            }
            editable={isFormEditable && index === 0}
            onPress={onEdit}
          />
        )
      }
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      keyExtractor={(item, index) => String(item.internalId ?? index)}
      ListHeaderComponent={
        <View
          style={{backgroundColor: 'white', marginTop: 40}}
          key="list-header">
          <View style={{marginBottom: 24}}>
            <Typography variant="heading4">{vehicle.type}</Typography>
            <Typography variant="body">
              {vehicle.color} - {id}
            </Typography>
          </View>
          <View style={{flexDirection: 'column', gap: 16}}>
            <TextField
              editable={canRegisterMileage}
              key="mileage-input"
              // @todo intl
              placeholder="Sláðu inn núverandi kílómetrastöðu"
              // @todo intl
              label="Kílómetrastaða"
              value={input}
              maxLength={9}
              keyboardType="decimal-pad"
              onChange={value =>
                setInput(
                  value.length
                    ? Intl.NumberFormat('is-IS').format(
                        Math.max(
                          0,
                          Math.min(9999999, Number(value.replace(/\D/g, ''))),
                        ),
                      )
                    : value,
                )
              }
            />
            <Button
              // @todo intl
              title="Skrá"
              onPress={onSubmit}
              disabled={!canRegisterMileage}
            />
          </View>
          <View>
            {!canRegisterMileage && (
              <Typography
                variant="body3"
                textAlign="center"
                style={{marginTop: 16}}>
                {/* @todo intl */}
                Aðeins má skrá kílómetrastöðu einu sinn á hverjum 30 dögum
              </Typography>
            )}
            <Button
              icon={externalLinkIcon}
              // @todo intl
              title="Sjá nánari upplýsingar á island.is"
              isTransparent
              textStyle={{fontSize: 12, lineHeight: 16}}
            />
          </View>
          <Divider style={{marginLeft: 0, marginRight: 0}} />
          <Typography
            variant="heading4"
            style={{marginTop: 16, marginBottom: 16}}>
            {/* @todo intl */}
            Skráningar
          </Typography>
        </View>
      }
      style={{flex: 1, margin: 16, marginTop: 0}}
    />
  );
};

VehicleMileageScreen.options = getNavigationOptions();
