import React from 'react';
import { NavigationProvider } from 'react-native-navigation-hooks'
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation'

export function registerComponent(name: string, Component: NavigationFunctionComponent) {
  Navigation.registerComponent(
    name,
    () => (props) => {
      return (
        <NavigationProvider value={{ componentId: props.componentId }}>
          <Component {...props} />
        </NavigationProvider>
      )
    },
    () => Component,
  )
}

