import { AuthDelegationType, BffUser } from '@island.is/shared/types'

import { PortalNavigationItem, PortalRoute } from '../../types/portalCore'
import {
  computeDisabledReason,
  filterNavigationTree,
} from './filterNavigationTree'
import { filterNavigationTreeTestCases } from './test-data'

describe.each(Object.keys(filterNavigationTreeTestCases))(
  'filterNavigationTree test case: %s',
  (caseName) => {
    const {
      expected,
      navigation,
      routes,
      currentLocationPath,
      dynamicRouteArray,
    } =
      filterNavigationTreeTestCases[
        caseName as keyof typeof filterNavigationTreeTestCases
      ]

    it('Returns filtered navigation tree', () => {
      // Arrange && Act
      const filteredNavigation: PortalNavigationItem = {
        ...navigation,
        children: navigation?.children?.filter((item) =>
          filterNavigationTree({
            item,
            routes,
            dynamicRouteArray: dynamicRouteArray ?? [],
            currentLocationPath: currentLocationPath,
          }),
        ),
      }

      // Assert
      expect(filteredNavigation).toStrictEqual(expected)
    })
  },
)

describe('computeDisabledReason', () => {
  const actingUser = (delegationType: AuthDelegationType[]) =>
    ({
      profile: { actor: { nationalId: '0101302399' }, delegationType },
    } as unknown as BffUser)
  const route = (path: string, notAvailableForActors?: boolean) =>
    ({ name: 'Route', path, notAvailableForActors } as PortalRoute)

  it('keeps the guardian-of-16+ reason ahead of notAvailableForActors', () => {
    expect(
      computeDisabledReason(
        actingUser([AuthDelegationType.LegalGuardian]),
        route('/heilsa/yfirlit', true),
      ),
    ).toEqual('notMinor')
  })

  it('uses notAvailableForActors for flagged routes when acting as a delegate', () => {
    expect(
      computeDisabledReason(
        actingUser([AuthDelegationType.Custom]),
        route('/menntun', true),
      ),
    ).toEqual('notAvailableForActors')
  })

  it('falls back to the default reason', () => {
    expect(
      computeDisabledReason(
        actingUser([AuthDelegationType.Custom]),
        route('/fjarmal'),
      ),
    ).toEqual('default')
  })
})
