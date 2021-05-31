import {addPlugin, Flipper} from 'react-native-flipper';
import { StoreApi } from 'zustand';

let connection: Flipper.FlipperConnection | null = null;

addPlugin({
  getId: () => 'ZustandStore',
  runInBackground: () => true,
  onConnect(_conn) {
    connection = _conn;
  },
  onDisconnect() {
    connection = null;
  },
});


export function zustandFlipper(store: StoreApi<any>, storeName: string) {
  if (__DEV__) {
    store.subscribe((state) => {
      if (connection) {
        connection.send('newData', {
          storeName,
          timestamp: new Date(),
          title: 'ZustandAction',
          state,
        });
      }
    })
  }
}
