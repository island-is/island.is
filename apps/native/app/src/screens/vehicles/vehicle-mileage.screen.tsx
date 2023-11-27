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
const {getNavigationOptions, useNavigationOptions} =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }));

function MileageCell({
  title,
  subtitle,
  accessory,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  accessory: React.ReactNode;
}) {
  const dynamicColor = useDynamicColor();
  return (
    <Pressable onPress={() => {
    }}>
    <View
      style={{
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: dynamicColor({
          light: dynamicColor.theme.color.blueberry100,
          dark: dynamicColor.theme.shades.dark.shade100,
        }),
        gap: 4,
        marginBottom: 8,
      }}>
      <Typography weight="600">{title}</Typography>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Typography>{subtitle}</Typography>
        <Typography weight="600">{accessory}</Typography>
      </View>
    </View>
    </Pressable>
  );
}

export const VehicleMileageScreen: NavigationFunctionComponent<{
  id: string;
}> = ({componentId, id}) => {
  useNavigationOptions(componentId);
  const intl = useIntl();
  const [input, setInput] = useState('');
  const data = useMemo(
    () =>
      Array.from({length: 20}).map((_, id) => ({
        id,
        name: 'Island.is',
        date: new Date(),
        mileage: 186000,
      })),
    [],
  );
  return (
    <>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <MileageCell
            title={item.name}
            subtitle={<FormattedDate value={item.date} />}
            accessory={`${intl.formatNumber(item.mileage)} km`}
          />
        )}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={() => (

      <View style={{backgroundColor: 'white', marginTop: 40}} key="list-header">
      <View style={{marginBottom: 24}}>
        <Typography variant="heading4">Tesla Model S</Typography>
        <Typography variant="body">Grár - AA-123</Typography>
      </View>
      <View style={{flexDirection: 'column', gap: 16}}>
        <TextField
          key="mileage-input"
          placeholder="Sláðu inn núverandi kílómetrastöðu"
          label="Kílómetrastaða"
          value={input}
          maxLength={7}
          keyboardType="decimal-pad"
          onChange={value => setInput(value)}
        />
        <Button title="Skrá" onPress={() => void 0} />
      </View>
      <View>
        <Button
          icon={externalLinkIcon}
          title="Sjá nánari upplýsingar á island.is"
          isTransparent
          textStyle={{fontSize: 12, lineHeight: 16}}
        />
      </View>
      <Divider style={{marginLeft: 0, marginRight: 0}} />
      <Typography
        variant="heading4"
        style={{marginTop: 16, marginBottom: 16}}>
        Skráningar
      </Typography>
    </View>
        )}
        // stickyHeaderIndices={[0]}
        style={{flex: 1, margin: 16, marginTop: 0}}
      />
    </>
  );
};

VehicleMileageScreen.options = getNavigationOptions();
