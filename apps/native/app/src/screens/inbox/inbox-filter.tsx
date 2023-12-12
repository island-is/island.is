import {TableViewCell, theme} from '@ui';
import {Platform, ScrollView, Switch} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {ComponentRegistry} from '../../utils/component-registry';
import {useIntl} from 'react-intl';
import {useEffect, useState} from 'react';
import {PressableHighlight} from '../../components/pressable-highlight/pressable-highlight';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';

const {useNavigationOptions, getNavigationOptions} =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({
          id: 'inboxFilters.screenTitle',
        }),
      },
    },
  }));
export function InboxFilterScreen(props: {
  opened: boolean;
  bookmarked: boolean;
  archived: boolean;
  componentId: string;
}) {
  const intl = useIntl();
  const [opened, setOpened] = useState(props.opened);
  const [bookmarked, setBookmarked] = useState(props.bookmarked);
  const [archived, setArchived] = useState(props.archived);

  useNavigationOptions(props.componentId);

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
            id: 'inboxFilters.unreadOnly',
          })}
          accessory={
            <Switch
              value={opened}
              onValueChange={() => setOpened(!opened)}
              thumbColor={Platform.select({android: theme.color.dark100})}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
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
            id: 'inboxFilters.starred',
          })}
          accessory={
            <Switch
              value={bookmarked}
              onValueChange={() => setBookmarked(!bookmarked)}
              thumbColor={Platform.select({android: theme.color.dark100})}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
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
            id: 'inboxFilters.archived',
          })}
          accessory={
            <Switch
              value={archived}
              onValueChange={() => setArchived(!archived)}
              thumbColor={Platform.select({android: theme.color.dark100})}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
      </PressableHighlight>
    </ScrollView>
  );
}

InboxFilterScreen.options = getNavigationOptions;
