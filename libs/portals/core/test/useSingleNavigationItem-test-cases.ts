import {
  SingleNavigationItemStatus,
  UseSingleNavigationItemResult,
} from '../src/hooks/useSingleNavigationItem'
import { PortalModule, PortalNavigationItem } from '../src/types/portalCore'

type TestPortalModule = Pick<PortalModule, 'name' | 'enabled' | 'routes'>

interface TestCase {
  modules: TestPortalModule[]
  navigationTrees: PortalNavigationItem[]
  expected: UseSingleNavigationItemResult
}

export const testCases: Record<string, TestCase> = {
  'should return NO_ITEM and undefined item when no navigation trees': {
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
    expected: {
      status: SingleNavigationItemStatus.NO_ITEM,
    },
  },
  'should return SINGLE_ITEM and an item for single navigation tree with single valid child':
    {
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
        navigationItem: {
          name: 'Test child',
          path: '/test',
        },
        status: SingleNavigationItemStatus.SINGLE_ITEM,
      },
    },
  'should return SINGLE_ITEM and an item for multiple navigation trees with combined single valid child':
    {
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
        navigationItem: {
          name: 'Test accessible child',
          path: '/valid',
        },
        status: SingleNavigationItemStatus.SINGLE_ITEM,
      },
    },
  'should return NO_ITEM and undefined item for single navigation tree with no valid child':
    {
      modules: [
        {
          name: 'Test module',
          enabled: () => false,
          routes: () => [
            {
              name: 'Test route',
              path: '/test',
              enabled: false,
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
        status: SingleNavigationItemStatus.NO_ITEM,
      },
    },
  'should return NO_ITEM and undefined item for multiple navigation trees with no combined valid child':
    {
      modules: [
        {
          name: 'Top module',
          enabled: () => false,
          routes: () => [
            {
              name: 'Top route',
              path: '/top',
              enabled: false,
            },
          ],
        },
        {
          name: 'Bottom module',
          enabled: () => false,
          routes: () => [
            {
              name: 'Bottom route',
              path: '/bottom',
              enabled: false,
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
      expected: {
        status: SingleNavigationItemStatus.NO_ITEM,
      },
    },
  'should return MULTIPLE_ITEMS and undefined item for single navigation tree with multiple valid children':
    {
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
      expected: {
        status: SingleNavigationItemStatus.MULTIPLE_ITEMS,
      },
    },
  'should return MULTIPLE_ITEMS and undefined item for multiple navigation tree with combined multiple valid children':
    {
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
      expected: {
        status: SingleNavigationItemStatus.MULTIPLE_ITEMS,
      },
    },
}
