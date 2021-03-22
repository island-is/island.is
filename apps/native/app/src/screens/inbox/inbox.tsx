import { Heading } from '@island.is/island-ui-native';
import React, { useState } from 'react'
import { RefreshControl, ScrollView, Text } from 'react-native'
import { useAuthStore } from '../../auth/auth'
import { Options} from 'react-native-navigation';

export const Inbox = () => {
  const { authorizeResult } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
      <ScrollView
        style={{
          flex: 1
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {Array.from({ length: 200 }).map((v, i) => <Text key={i} style={{ padding: 10}}>test</Text>)}
      </ScrollView>
  )
}

Inbox.options = {
  topBar: {
    title: {
      text: 'Inbox'
    },
    largeTitle: {
      visible: true,
      fontSize: 24,
    },
    searchBar: {
      visible: true,
      hideOnScroll: true,
      hideTopBarOnFocus: true,
      placeholder: 'Leita í rafrænum skjölum',

    }
  }
} as Options;
