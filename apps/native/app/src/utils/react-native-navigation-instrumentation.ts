import * as Sentry from '@sentry/react-native'
import { Navigation, ComponentWillAppearEvent, ComponentDidDisappearEvent } from 'react-native-navigation';

export class ReactNativeNavigationInstrumentation extends Sentry.RoutingInstrumentation {
  static instrumentationName: string = 'react-navigation-navigation'

  private _currentRoute: string | undefined = undefined;
  private _previousRoute: string | undefined = undefined;

  constructor() {
    super();
    Navigation.events().registerComponentWillAppearListener(this.onComponentWillAppear.bind(this));
    Navigation.events().registerComponentDidDisappearListener(this.onComponentDidDisappear.bind(this));
  }

  public onComponentWillAppear(e: ComponentWillAppearEvent) {
    if (e.componentType === 'Component') {
      this._previousRoute = this._currentRoute;
      this._currentRoute = e.componentName;
      this.onRouteWillChange({
        name: e.componentName,
        op: 'navigation',
        tags: {
          "routing.instrumentation":
          ReactNativeNavigationInstrumentation.instrumentationName,
          "routing.route.name": e.componentName,
        },
        data: e.passProps,
      });
    }
  }

  public onComponentDidDisappear(e: ComponentWillAppearEvent) {
    if (e.componentType === 'Component' && this._currentRoute === e.componentName && this._previousRoute) {
      this.onRouteWillChange({
        name: this._previousRoute,
        op: 'navigation',
      });
    }
  }
}
