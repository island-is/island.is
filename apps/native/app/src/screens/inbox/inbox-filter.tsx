import {Button, TableViewCell, theme} from '@ui';
import {Image, Pressable, ScrollView, Switch, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {ComponentRegistry} from '../../utils/component-registry';
import {FormattedMessage, useIntl} from 'react-intl';
import ChevronDown from '../../ui/assets/icons/chevron-down.png';
import {useEffect, useState} from 'react';
import {PressableHighlight} from '../../components/pressable-highlight/pressable-highlight';

export function InboxFilterScreen(props: {
  opened: boolean;
  bookmarked: boolean;
  archived: boolean;
}) {
  const intl = useIntl();
  const [opened, setOpened] = useState(props.opened);
  const [bookmarked, setBookmarked] = useState(props.bookmarked);
  const [archived, setArchived] = useState(props.archived);

  useEffect(() => {
    Navigation.updateProps(ComponentRegistry.InboxScreen, {
      opened,
      bookmarked,
      archived,
    });
  }, [opened, bookmarked, archived]);

  return (
    <ScrollView style={{flex: 1}}>
      <PressableHighlight
        onPress={() => {
          setOpened(!opened);
        }}>
        <TableViewCell
          title={intl.formatMessage({
            id: 'inbox.filters.unreadOnly',
            defaultMessage: 'Sýna einungis ólesið',
          })}
          accessory={
            <Switch
              value={opened}
              onValueChange={() => setOpened(!opened)}
              trackColor={{
                true: theme.color.blue400,
                false: undefined,
              }}
            />
          }
          border
        />
      </PressableHighlight>
      <PressableHighlight
        onPress={() => {
          setBookmarked(!bookmarked);
        }}>
        <TableViewCell
          title={intl.formatMessage({
            id: 'inbox.filters.starred',
            defaultMessage: 'Stjörnumerkt',
          })}
          accessory={
            <Switch
              value={bookmarked}
              onValueChange={() => setBookmarked(!bookmarked)}
              trackColor={{
                true: theme.color.blue400,
                false: undefined,
              }}
            />
          }
          border
        />
      </PressableHighlight>
      <PressableHighlight
        onPress={() => {
          setArchived(!archived);
        }}>
        <TableViewCell
          title={intl.formatMessage({
            id: 'inbox.filters.archived',
            defaultMessage: 'Geymsla',
          })}
          accessory={
            <Switch
              value={archived}
              onValueChange={() => setArchived(!archived)}
              trackColor={{
                true: theme.color.blue400,
                false: undefined,
              }}
            />
          }
        />
      </PressableHighlight>
      {/* <TableViewCell
        title={intl.formatMessage({
          id: 'inbox.filters.archived2',
          defaultMessage: 'Stofnun',
        })}
        accessory={<Image source={ChevronDown} />}
        border
      />
      <TableViewCell
        title={intl.formatMessage({
          id: 'inbox.filters.archived2',
          defaultMessage: 'Flokkur',
        })}
        accessory={<Image source={ChevronDown} />}
        border
      />
      <TableViewCell
        title={intl.formatMessage({
          id: 'inbox.filters.archived2',
          defaultMessage: 'Dagsetningar',
        })}
        accessory={<Image source={ChevronDown} />}
        border
      /> */}
    </ScrollView>
  );
}

InboxFilterScreen.options = {
  topBar: {
    title: {
      text: 'Sía pósthólf',
    },
  },
};
