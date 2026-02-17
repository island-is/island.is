// import {
//   Navigation,
//   NavigationFunctionComponent,
// } from 'react-native-navigation'
// import { NavigationProvider } from 'react-native-navigation-hooks'

export function registerComponent<Props>(
  name: string,
  Component: any
) {
  // @todo migration

  // const client = getApolloClient()

  // Navigation.registerComponent(
  //   name,
  //   () => (props) => {
  //     return (
  //       <ThemeProvider>
  //         <LocaleProvider>
  //           <NavigationProvider value={{ componentId: props.componentId }}>
  //             <FeatureFlagProvider>
  //               <ApolloProvider client={client}>
  //                 <OfflineProvider>
  //                   <Component {...props} />
  //                 </OfflineProvider>
  //               </ApolloProvider>
  //             </FeatureFlagProvider>
  //           </NavigationProvider>
  //         </LocaleProvider>
  //       </ThemeProvider>
  //     )
  //   },
  //   () => Component,
  // )
}
