/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PortalNavigationItem, PortalRoute } from '../../types/portalCore'

const navigation: PortalNavigationItem = {
  name: 'root',
  systemRoute: true,
  path: '/',
  icon: {
    icon: 'home',
  },
  children: [
    {
      name: 'route',
      path: '/route',
      navHide: false,
      children: [
        {
          name: 'route_child',
          path: '/route/child',
        },
      ],
    },
  ],
}

const routes: PortalRoute[] = [
  {
    name: 'route',
    path: '/route',
    navHide: false,
  },
  {
    name: 'route_child',
    path: '/route/child',
  },
]

interface FilterNavigationTreeTestCase {
  [key: string]: {
    currentLocationPath: string
    navigation: PortalNavigationItem
    routes: PortalRoute[]
    expected: PortalNavigationItem
    dynamicRouteArray?: string[]
  }
}

export const filterNavigationTreeTestCases: FilterNavigationTreeTestCase = {
  /**
   * No routes found in navigation tree
   */
  noRoutesFound: {
    currentLocationPath: '/route',
    navigation: {
      ...navigation,
      children: [
        {
          name: 'Not found',
          path: '/not-found',
        },
      ],
    },
    routes,
    expected: {
      ...navigation,
      children: [],
    },
  },

  /**
   * Routes found in navigation tree
   */
  routesFound: {
    currentLocationPath: '/route',
    navigation,
    routes,
    expected: navigation,
  },

  /**
   * Populates navHide if not set on route
   */
  populatesNavHide: {
    currentLocationPath: '/route',
    navigation: {
      ...navigation,
      children: [
        {
          name: 'route',
          path: '/route',
        },
      ],
    },
    routes: [
      {
        name: 'route',
        path: '/route',
        navHide: true,
      },
    ],
    expected: {
      ...navigation,
      children: [
        {
          name: 'route',
          path: '/route',
          navHide: true,
          active: true,
          enabled: undefined,
          children: undefined,
        },
      ],
    },
  },

  /**
   * Sets item as active if the path is an match
   */
  setActiveItem: {
    currentLocationPath: '/route',
    navigation,
    routes,
    expected: {
      ...navigation,
      children: [
        {
          ...navigation.children![0],
          active: true,
          enabled: undefined,
        },
      ],
    },
  },

  /**
   * Parent and child items should be set to active if child has a match
   */
  setParentChildActiveItem: {
    currentLocationPath: '/route/child',
    navigation,
    routes,
    expected: {
      ...navigation,
      children: [
        {
          ...navigation.children![0],
          active: true,
          navHide: false,
          enabled: undefined,
          children: [
            {
              ...navigation.children![0].children![0],
              active: true,
              navHide: false,
              enabled: undefined,
              children: undefined,
            },
          ],
        },
      ],
    },
  },

  /**
   * Active item should be set to false if the path is not an exact match
   */
  failActiveItemIfExact: {
    currentLocationPath: '/route_same_prefix',
    navigation: {
      ...navigation,
      children: [
        {
          // Current route path here is /route
          ...navigation.children![0],
          // Now the route should only be active if the path is exact
          activeIfExact: true,
        },
      ],
    },
    routes,
    expected: {
      ...navigation,
      children: [
        {
          ...navigation.children![0],
          // route_same_prefix is not an exact match, so active should be false
          active: false,
          activeIfExact: true,
          enabled: undefined,
        },
      ],
    },
  },

  /**
   * Active item should be set to false if the path is not an exact match
   */
  parentItemNotActiveIfExact: {
    currentLocationPath: '/route/child',
    navigation: {
      ...navigation,
      children: [
        {
          ...navigation.children![0],
          activeIfExact: true,
        },
      ],
    },
    routes,
    expected: {
      ...navigation,
      children: [
        {
          ...navigation.children![0],
          active: false,
          activeIfExact: true,
          enabled: undefined,
          children: [
            {
              ...navigation.children![0].children![0],
              navHide: false,
              active: true,
              enabled: undefined,
              children: undefined,
            },
          ],
        },
      ],
    },
  },

  /**
   * Set item active if one of it's children is active and the item has no path.
   */
  itemActiveIfNoPathAndChildActive: {
    currentLocationPath: '/route/child',
    navigation: {
      ...navigation,
      children: [
        {
          ...navigation.children![0],
          path: undefined,
        },
      ],
    },
    routes,
    expected: {
      ...navigation,
      children: [
        {
          ...navigation.children![0],
          path: undefined,
          active: true,
          enabled: undefined,
          navHide: false,
          children: [
            {
              ...navigation.children![0].children![0],
              navHide: false,
              active: true,
              enabled: undefined,
              children: undefined,
            },
          ],
        },
      ],
    },
  },

  /**
   * Supports nested routes, this test case has three levels of nesting
   */
  nestedRoutes: {
    currentLocationPath: '/route/child/grandchild',
    navigation: {
      ...navigation,
      children: [
        {
          ...navigation.children![0],
          children: [
            {
              ...navigation.children![0].children![0],
              children: [
                {
                  name: 'grandchild',
                  path: '/route/child/grandchild',
                },
              ],
            },
          ],
        },
      ],
    },
    routes: [
      ...routes,
      {
        name: 'grandchild',
        path: '/route/child/grandchild',
      },
    ],
    expected: {
      ...navigation,
      children: [
        {
          ...navigation.children![0],
          active: true,
          enabled: undefined,
          navHide: false,
          children: [
            {
              ...navigation.children![0].children![0],
              navHide: false,
              active: true,
              enabled: undefined,
              children: [
                {
                  name: 'grandchild',
                  path: '/route/child/grandchild',
                  navHide: false,
                  active: true,
                  enabled: undefined,
                  children: undefined,
                },
              ],
            },
          ],
        },
      ],
    },
  },

  /**
   * Maps route enabled state to navigation item enabled state
   */
  setsEnabled: {
    currentLocationPath: '/route',
    navigation,
    // Remove the first route from the "filtered" routes array
    routes: [
      {
        ...routes[0],
        enabled: true,
      },
      ...routes.slice(1),
    ],
    expected: {
      ...navigation,
      children: [
        {
          ...navigation.children![0],
          enabled: true,
          active: true,
        },
      ],
    },
  },

  /**
   * Only descendants included.
   * If the item is not included, but one or more of it's descendants are
   * then we remove the item's path but include it in the tree.
   */
  onlyDescendantsIncluded: {
    currentLocationPath: '/route',
    navigation,
    // Remove the first route from the "filtered" routes array
    routes: [...routes.slice(1)],
    expected: navigation,
  },

  /**
   * Makes dynamic item hidden in navigation if path does not exists in dynamicRouteArray.
   */
  hideDynamicPath: {
    currentLocationPath: '/route',
    navigation: {
      ...navigation,
      children: [
        ...navigation.children!,
        {
          name: 'dynamic',
          path: '/route/dynamic',
        },
      ],
    },
    routes: [
      ...routes,
      {
        name: 'dynamic',
        path: '/route/dynamic',
        dynamic: true,
      },
    ],
    expected: {
      ...navigation,
      children: [
        ...navigation.children!,
        {
          name: 'dynamic',
          path: '/route/dynamic',
          active: false,
          children: undefined,
          enabled: undefined,
          navHide: true,
        },
      ],
    },
    dynamicRouteArray: ['/route/no-match-dynamic'],
  },

  /**
   * Makes dynamic item visible in navigation if path does exists in dynamicRouteArray.
   */
  showDynamicPath: {
    currentLocationPath: '/route',
    navigation: {
      ...navigation,
      children: [
        ...navigation.children!,
        {
          name: 'dynamic',
          path: '/route/dynamic',
        },
      ],
    },
    routes: [
      ...routes,
      {
        name: 'dynamic',
        path: '/route/dynamic',
        dynamic: true,
      },
    ],
    expected: {
      ...navigation,
      children: [
        ...navigation.children!,
        {
          name: 'dynamic',
          path: '/route/dynamic',
          active: false,
          children: undefined,
          enabled: undefined,
          navHide: false,
        },
      ],
    },
    dynamicRouteArray: ['/route/dynamic'],
  },
}
