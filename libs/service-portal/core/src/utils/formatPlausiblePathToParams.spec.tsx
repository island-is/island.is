import '@testing-library/jest-dom'
import { ServicePortalPaths } from '../lib/navigation/paths'

import { formatPlausiblePathToParams } from './formatPlausiblePathToParams'
const AssetDetailPath = '/fasteignir/:id'

describe('formatPlausiblePathToParams', () => {
  it('should return path object when path matches from string', async () => {
    // arrange
    const anyPath = '/fjarmal'
    const pageOrigin = window.location.origin
    const rootPath = ServicePortalPaths.Base
    // assert
    expect(formatPlausiblePathToParams(anyPath, [anyPath])).toStrictEqual({
      url: `${pageOrigin}${rootPath}${anyPath}`,
      location: anyPath,
    })
  })

  it('should return path object when no overwrite provided', async () => {
    // arrange
    const anyPath = '/fjarmal'
    const pageOrigin = window.location.origin
    const rootPath = ServicePortalPaths.Base
    // assert
    expect(formatPlausiblePathToParams(anyPath)).toStrictEqual({
      url: `${pageOrigin}${rootPath}${anyPath}`,
      location: anyPath,
    })
  })

  it('should match non identifiable service-portal path when given identifiable path', async () => {
    // arrange
    const anyPath = AssetDetailPath.replace(':id', '123')
    const pageOrigin = window.location.origin
    const rootPath = ServicePortalPaths.Base

    // assert

    // On array
    expect(
      formatPlausiblePathToParams(anyPath, [AssetDetailPath]),
    ).toStrictEqual({
      url: `${pageOrigin}${rootPath}${AssetDetailPath}`,
      location: AssetDetailPath,
    })

    // On string
    expect(formatPlausiblePathToParams(anyPath, AssetDetailPath)).toStrictEqual(
      {
        url: `${pageOrigin}${rootPath}${AssetDetailPath}`,
        location: AssetDetailPath,
      },
    )
  })

  it('should return root url and empty location when path is not available in overwrite', async () => {
    // arrange
    const anyPath = '/non-existant-path'
    const pageOrigin = window.location.origin
    const rootPath = ServicePortalPaths.Base
    // assert
    expect(
      formatPlausiblePathToParams(anyPath, ['/some-other-path']),
    ).toStrictEqual({
      url: `${pageOrigin}${rootPath}`,
      location: '',
    })
  })

  it('should return filename when provided', async () => {
    // arrange
    const fileName = 'file_name.jpg'
    // assert
    expect(formatPlausiblePathToParams('/', '', fileName).fileName).toBe(
      fileName,
    )
  })
})
