import { createXRoadAPIPath, XRoadMemberClass } from './createXRoadAPIPath'

describe('createXRoadAPIPath', () => {
  it('should create urls as expected', () => {
    const xRoadBasePath = 'http://samplexroadpath.island.is/something'
    const xRoadMemberClass = XRoadMemberClass.GovernmentInstitution
    const xRoadMemberCode = '1000'
    const xRoadAPIPath = '/SampleInstitution-SampleAPI-Protected/SampleAPI-v1'

    const expected = `${xRoadBasePath}/${xRoadMemberClass}/${xRoadMemberCode}${xRoadAPIPath}`

    const result = createXRoadAPIPath(
      xRoadBasePath,
      xRoadMemberClass,
      xRoadMemberCode,
      xRoadAPIPath,
    )

    expect(result).toBe(expected)
  })
})
