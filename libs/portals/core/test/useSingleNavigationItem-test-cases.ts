import { PortalModule, PortalNavigationItem } from '../src/types/portalCore'

type TestPortalModule = Pick<PortalModule, 'name' | 'enabled' | 'routes'>

interface TestCase {
  modules: TestPortalModule[]
  navigationTrees: PortalNavigationItem[]
  expected: PortalNavigationItem | null
}

export const testCases: Record<string, TestCase> = {
  'should return null when no navigation trees': {
    modules: [
      {
        name: 'Test module',
        enabled: () => true,
        routes: () => [
          {
            name: 'Test route',
            path: '/test',
            enabled: true,
          },
        ],
      },
    ],
    navigationTrees: [],
    expected: null,
  },
  'should return single navigation item for single navigation tree with single valid child': {
    modules: [
      {
        name: 'Test module',
        enabled: () => true,
        routes: () => [
          {
            name: 'Test route',
            path: '/test',
            enabled: true,
          },
        ],
      },
    ],
    navigationTrees: [
      {
        name: 'Test tree',
        path: '/',
        children: [
          {
            name: 'Test child',
            path: '/test',
          },
        ],
      },
    ],
    expected: {
      name: 'Test child',
      path: '/test',
    },
  },
  'should return single navigation item for multiple navigation trees with combined single valid child': {
    modules: [
      {
        name: 'Accessible module',
        enabled: () => true,
        routes: () => [
          {
            name: 'Accessible route',
            path: '/valid',
            enabled: true,
          },
        ],
      },
      {
        name: 'Inaccessible module',
        enabled: () => false,
        routes: () => [
          {
            name: 'Inaccessible route',
            path: '/valid',
          },
        ],
      },
    ],
    navigationTrees: [
      {
        name: 'Test accessible tree',
        path: '/',
        children: [
          {
            name: 'Test accessible child',
            path: '/valid',
          },
        ],
      },
      {
        name: 'Test inaccessible tree',
        path: '/',
        children: [
          {
            name: 'Test inaccessible child',
            path: '/invalid',
          },
        ],
      },
    ],
    expected: {
      name: 'Test accessible child',
      path: '/valid',
    },
  },
  'should return null for single navigation tree with multiple valid children': {
    modules: [
      {
        name: 'Test module',
        enabled: () => true,
        routes: () => [
          {
            name: 'Test first route',
            path: '/first',
            enabled: true,
          },
          {
            name: 'Test second route',
            path: '/second',
            enabled: true,
          },
        ],
      },
    ],
    navigationTrees: [
      {
        name: 'Test tree',
        path: '/',
        children: [
          {
            name: 'Test first child',
            path: '/first',
          },
          {
            name: 'Test second child',
            path: '/second',
          },
        ],
      },
    ],
    expected: null,
  },
  'should return null for multiple navigation tree with combined multiple valid children': {
    modules: [
      {
        name: 'Top module',
        enabled: () => true,
        routes: () => [
          {
            name: 'Top route',
            path: '/top',
            enabled: true,
          },
        ],
      },
      {
        name: 'Bottom module',
        enabled: () => true,
        routes: () => [
          {
            name: 'Bottom route',
            path: '/bottom',
            enabled: true,
          },
        ],
      },
    ],
    navigationTrees: [
      {
        name: 'Test top tree',
        path: '/',
        children: [
          {
            name: 'Test top child',
            path: '/top',
          },
        ],
      },
      {
        name: 'Test bottom tree',
        path: '/',
        children: [
          {
            name: 'Test bottom child',
            path: '/bottom',
          },
        ],
      },
    ],
    expected: null,
  },
}
