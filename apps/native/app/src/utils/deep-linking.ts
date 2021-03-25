import create, { State } from 'zustand/vanilla';
import createUse from 'zustand';
import { Linking } from 'react-native';
import { config } from './config';

export type RouteCallbackArgs = boolean | ({ path: string; } & { scheme: string; match?: RegExpExecArray; [key: string]: string | RegExpExecArray | undefined; });

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
};

function execRegex(queries: string[], expression: string, path: string) {
  let regexExpression = expression;
  queries.forEach((query) => {
    regexExpression = regexExpression.replace(query, '(.*)');
  });

  const queryRegex = new RegExp(regexExpression, 'g');
  const match = queryRegex.exec(path);

  if (match && !match[1].includes('/')) {
    let results = { path: match[0] };
    queries.forEach((query, index) => {
      const id = query.substring(1);
      results = { [id]: match[index + 1], ...results };
    });

    return results;
  }

  return false;
};

function evaluateExpression(expression: string | RegExp, path: string, scheme: string) {
  if (expression === path) {
    return { scheme, path };
  }

  try {
    const regex = expression as RegExp;
    const match = regex.exec(path);
    regex.lastIndex = 0;
    if (match) {
      return { scheme, path, match };
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

export function evaluateUrl(url: string) {
  let solved = false;
  const { schemes, routes } = deepLinkingStore.getState();
  schemes.forEach((scheme) => {
    if (url.startsWith(scheme)) {
      const path = url.substring(scheme.length - 1);
      routes.forEach((route) => {
        const result = evaluateExpression(route.expression, path, scheme);
        if (result) {
          solved = true;
          route.callback({ scheme, ...result });
        }
      });
    }
  });

  return solved;
};

export const addRoute = (expression: string | RegExp, callback: (args: RouteCallbackArgs) => void) => {
  const route = { expression, callback };
  deepLinkingStore.setState(({ routes }) => ({ routes: [...routes, route] }));
};

export const removeRoute = (expression: string | RegExp) => {
  deepLinkingStore.setState(({ routes }) => {
    const index = routes.findIndex(route => route.expression === expression);
    if (index >= 0) {
      routes.splice(index, 1);
    }
    return { routes };
  });
};

export const resetRoutes = () => {
  deepLinkingStore.setState(() => ({ routes: [] }));
};

export const addScheme = (scheme: string) => {
  deepLinkingStore.setState(({ schemes }) => ({ schemes: [...schemes, scheme] }));
};

export const resetSchemes = () => {
  deepLinkingStore.setState(() => ({ schemes: [] }));
};

/**
 * Navigate to a specific url within the app
 * @param url Navigating url (ex. /inbox, /inbox/my-document-id, /wallet etc.)
 * @returns
 */
export function navigateTo(url: string) {
  const linkingUrl = `${config.bundleId}://${url.replace(/^\//, '')}`;
  return evaluateUrl(linkingUrl);
  // @todo when to use native linking system?
  // return Linking.openURL(linkingUrl);
}

// Listen for url events through iOS and Android's Linking library
Linking.addEventListener('url', ({ url }) => {
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      evaluateUrl(url);
    }
  });
});

// Get initial url and pass to the opener
Linking.getInitialURL().then((url) => {
  if (url) {
    Linking.openURL(url);
  }
})
.catch(err => console.error('An error occurred in getInitialURL: ', err));
