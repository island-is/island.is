import { PortalNavigationItem } from '../../types/portalCore'
import { filterNavigationTree } from './filterNavigationTree'
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
