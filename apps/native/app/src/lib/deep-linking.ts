import {Navigation} from 'react-native-navigation';
import createUse from 'zustand';
import create, {State} from 'zustand/vanilla';
import {notificationsStore} from '../stores/notifications-store';
import {ComponentRegistry, MainBottomTabs} from '../utils/component-registry';
import {openBrowser} from './rn-island';
import {bundleId} from '../config';

export type RouteCallbackArgs =
  | boolean
  | ({path: string} & {
      scheme: string;
      match?: RegExpExecArray;
      [key: string]: string | RegExpExecArray | undefined;
    });

export interface Route {
  expression: string | RegExp;
  callback(args: RouteCallbackArgs): void;
}

export interface DeepLinkingStore extends State {
  schemes: string[];
  routes: Route[];
}

export const deepLinkingStore = create<DeepLinkingStore>((set, get) => ({
  schemes: [],
  routes: [],
}));

export const useDeepLinkingStore = createUse(deepLinkingStore);

function fetchQueries(expression: string) {
  const regex = /:([^/]*)/g;
  const queries = [];

  let match = regex.exec(expression);
  while (match) {
    if (match && match[0] && match[1]) {
      queries.push(match[0]);
    }

    match = regex.exec(expression);
  }

  return queries;
}

function execRegex(queries: string[], expression: string, path: string) {
  let regexExpression = expression;
  queries.forEach(query => {
    regexExpression = regexExpression.replace(query, '(.*)');
  });

  const queryRegex = new RegExp(regexExpression, 'g');
  const match = queryRegex.exec(path);

  if (match && !match[1].includes('/')) {
    let results = {path: match[0]};
    queries.forEach((query, index) => {
      const id = query.substring(1);
      results = {[id]: match[index + 1], ...results};
    });

    return results;
  }

  return false;
}

function evaluateExpression(
  expression: string | RegExp,
  path: string,
  scheme: string,
) {
  if (expression === path) {
    return {scheme, path};
  }

  try {
    const regex = expression as RegExp;
    const match = regex.exec(path);
    regex.lastIndex = 0;
    if (match) {
      return {scheme, path, match};
    }
  } catch (e) {
    // Error, expression is not regex
  }

  if (typeof expression === 'string' && expression.includes(':')) {
    const queries = fetchQueries(expression);
    if (queries.length) {
      return execRegex(queries, expression, path);
    }
  }

  return false;
}

export function evaluateUrl(url: string, extraProps: any = {}) {
  let solved = false;
  const {schemes, routes} = deepLinkingStore.getState();
  schemes.forEach(scheme => {
    if (url.startsWith(scheme)) {
      const path = url.substring(scheme.length - 1);
      routes.forEach(route => {
        const result = evaluateExpression(route.expression, path, scheme);
        if (result) {
          solved = true;
          route.callback({scheme, ...result, ...extraProps});
        }
      });
    }
  });

  return solved;
}

export const addRoute = (
  expression: string | RegExp,
  callback: (args: RouteCallbackArgs) => void,
) => {
  const route = {expression, callback};
  deepLinkingStore.setState(({routes}) => ({routes: [...routes, route]}));
};

export const removeRoute = (expression: string | RegExp) => {
  deepLinkingStore.setState(({routes}) => {
    const index = routes.findIndex(route => route.expression === expression);
    if (index >= 0) {
      routes.splice(index, 1);
    }
    return {routes};
  });
};

export const resetRoutes = () => {
  deepLinkingStore.setState(() => ({routes: []}));
};

export const addScheme = (scheme: string) => {
  deepLinkingStore.setState(({schemes}) => ({
    schemes: [...schemes, scheme],
  }));
};

export const resetSchemes = () => {
  deepLinkingStore.setState(() => ({schemes: []}));
};

const navigateTimeMap = new Map();
const NAVIGATE_TIMEOUT = 500;
/**
 * Navigate to a specific url within the app
 * @param url Navigating url (ex. /inbox, /inbox/my-document-id, /wallet etc.)
 * @returns
 */
export function navigateTo(url: string, extraProps: any = {}) {
  const now = Date.now();
  // find last navigate time to this route
  const lastNavigate = navigateTimeMap.get(url);

  if (lastNavigate && now - lastNavigate <= NAVIGATE_TIMEOUT) {
    // user tried to navigate to same route twice within TAP_TIMEOUT (500ms)
    return;
  }

  // update navigate time for this route
  navigateTimeMap.set(url, now);

  // setup linking url
  const linkingUrl = `${bundleId}://${String(url).replace(/^\//, '')}`;

  // evalute and route
  return evaluateUrl(linkingUrl, extraProps);

  // @todo when to use native linking system?
  // return Linking.openURL(linkingUrl);
}

/**
 * Navigate to a notification detail screen, or its link if defined.
 * You may pass any one of its actions link if you want to go there as well.
 * @param notification Notification object, requires `id` and an optional `link`
 * @param componentId use specific componentId to open web browser in
 */
export function navigateToNotification(
  notification: {id: string; link?: string},
  componentId?: string,
) {
  const {id, link} = notification;
  // mark notification as read
  if (id) {
    notificationsStore.getState().actions.setRead(id);
    const didNavigate = navigateTo(link ?? `/notification/${id}`);
    if (!didNavigate && link) {
      if (!componentId) {
        // Use home tab for browser
        Navigation.mergeOptions(MainBottomTabs, {
          bottomTabs: {
            currentTabIndex: 1,
          },
        });
      }
      openBrowser(link, componentId ?? ComponentRegistry.HomeScreen);
    }
  }
}
