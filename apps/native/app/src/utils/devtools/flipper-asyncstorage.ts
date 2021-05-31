import AsyncStorage from '@react-native-community/async-storage'
import { addPlugin } from 'react-native-flipper'

addPlugin({
  getId: () => 'flipper-plugin-async-storage',
  onConnect: (connection) => {
    if (connection) {
      AsyncStorage.getAllKeys().then((keys) => {
        AsyncStorage.multiGet(keys).then((data) => {
          data.map((_, i, store) => {
            const [key, value] = store[i]
            const element = {
              key,
              value,
              id: key,
            }
            const needsToBeParsed =
              (value?.startsWith('{') && value?.endsWith('}')) ||
              (value?.startsWith('[') && value?.endsWith(']'))
            if (needsToBeParsed) {
              element.value = JSON.parse(value!)
            }
            connection.send('newElement', element)
          })
        })
      })
    }
  },
  onDisconnect: () => {},
  runInBackground: () => true,
})
