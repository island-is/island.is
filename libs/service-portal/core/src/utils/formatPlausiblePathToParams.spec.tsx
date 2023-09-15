import '@testing-library/jest-dom'
import { ServicePortalPath } from '../lib/navigation/paths'

import { formatPlausiblePathToParams } from './formatPlausiblePathToParams'

describe('formatPlausiblePathToParams', () => {
  it('should return path object when path exists in ServicePortalPath enum', async () => {
    // arrange
    const anyPath = ServicePortalPath.FinanceRoot
    const pageOrigin = window.location.origin
    const rootPath = ServicePortalPath.MinarSidurPath
    // assert
    expect(formatPlausiblePathToParams(anyPath)).toStrictEqual({
      url: `${pageOrigin}${rootPath}${anyPath}`,
      location: anyPath,
    })
  })

  it('should match non identifiable service-portal path when given identifiable path', async () => {
    // arrange
    const anyPath = ServicePortalPath.AssetsRealEstateDetail.replace(
      ':id',
      '123',
    )
    const pageOrigin = window.location.origin
    const rootPath = ServicePortalPath.MinarSidurPath

    // assert
    expect(formatPlausiblePathToParams(anyPath)).toStrictEqual({
      url: `${pageOrigin}${rootPath}${ServicePortalPath.AssetsRealEstateDetail}`,
      location: ServicePortalPath.AssetsRealEstateDetail,
    })
  })

  it('should return root url and current location when path is not available in ServicePortalPath enum', async () => {
    // arrange
    const anyPath = '/non-existant-path'
    const pageOrigin = window.location.origin
    const rootPath = ServicePortalPath.MinarSidurPath
    // assert
    expect(formatPlausiblePathToParams(anyPath)).toStrictEqual({
      url: `${pageOrigin}${rootPath}`,
      location: undefined,
    })
  })

  it('should return filename when provided', async () => {
    // arrange
    const fileName = 'file_name.jpg'
    // assert
    expect(formatPlausiblePathToParams('/', fileName).fileName).toBe(fileName)
  })
})
