import { ListItem } from '@island.is/island-ui-native'
import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { RefreshControl, ScrollView } from 'react-native'
import { NavigationFunctionComponent, Options, Navigation } from 'react-native-navigation'
import { ComponentRegistry } from '../../utils/navigation-registry'
import { ListDocumentsResponse, LIST_DOCUMENTS_QUERY } from '../../graphql/queries/list-documents.query'
import { config } from '../../utils/config';
import { Logo } from '../../components/logo/logo'


export const InboxScreen: NavigationFunctionComponent = () => {
  // const [idle, setIdle] = useState(true)
  const [loading, setLoading] = useState(false)
  const onRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  const res = useQuery<ListDocumentsResponse>(LIST_DOCUMENTS_QUERY, { client });
  const inboxItems = res?.data?.listDocuments ?? [];

  // useNavigationComponentDidAppear(() => {
  //   setIdle(false)
  // });

  // if (idle) {
  //   return null
  // }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInset={{ top: 0 }}
      contentInsetAdjustmentBehavior="always"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {inboxItems.map(({ id, subject, senderName }) => (
        <ListItem
          key={id}
          title={senderName}
          subtitle={subject}
          icon={<Logo name={senderName} />}
          link={`${config.bundleId}://inbox/${id}`}
        />
      ))}
    </ScrollView>
  )
}

InboxScreen.options = {
  topBar: {
    title: {
      // text: 'Rafræn skjöl',
      // color: theme.color.blue600,
      // fontSize: 19,
      // fontWeight: '600',
      component: {
        name: ComponentRegistry.NavigationBarTitle,
        alignment: 'fill',
        passProps: {
          title: 'Rafræn skjöl',
        },
      },
    },
    // largeTitle: {
    //   visible: true,
    //   color: theme.color.blue600,
    //   fontSize: 24,
    //   fontWeight: '700',
    // },
    searchBar: {
      visible: true,
      hideOnScroll: true,
      hideTopBarOnFocus: true,
      placeholder: 'Leita í rafrænum skjölum',
      // obscuresBackgroundDuringPresentation: true
    },
  },
} as Options
