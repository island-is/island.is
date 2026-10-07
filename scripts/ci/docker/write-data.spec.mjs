import { describe, expect, test } from '@jest/globals'
import { buildDockerData, matrixOutputToData } from './write-data.mjs'

const matrixData = {
  value: { id1: 'build' },
  project: { id1: 'api' },
  target: { id1: 'output-express' },
  imageName: { id1: 'api' },
  imageTag: { id1: 'release_2026.5.26.0_sha_random' },
}

const reusedData = [
  {
    value: 'build',
    project: 'web',
    target: 'output-next',
    imageName: 'web',
    imageTag: 'release_2026.5.26.0_sha_random',
  },
]

describe('write-data.mjs', () => {
  test('converts cloudposse matrix output to data array', () => {
    expect(matrixOutputToData(matrixData)).toEqual([
      {
        id: 'id1',
        value: 'build',
        project: 'api',
        target: 'output-express',
        imageName: 'api',
        imageTag: 'release_2026.5.26.0_sha_random',
      },
    ])
  })

  test('merges matrix data with reused docker data', () => {
    expect(
      buildDockerData(JSON.stringify(matrixData), JSON.stringify(reusedData)),
    ).toEqual([matrixOutputToData(matrixData)[0], reusedData[0]])
  })

  test('supports reused docker data without matrix output', () => {
    expect(buildDockerData('', JSON.stringify(reusedData))).toEqual(reusedData)
  })
})
