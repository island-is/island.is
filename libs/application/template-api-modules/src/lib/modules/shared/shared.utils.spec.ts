import { BaseTemplateAPIModuleConfig } from '../../types'
import { ConfigService } from '@nestjs/config'
import * as utils from './shared.utils'

describe('objectToXML', () => {
  it('should generate an acceptable xml from an object', () => {
    const objects = {
      result: [
        {
          uuid: 'c305620d-fd8e-4709-a8a9-4c7cd8813b3d',
          status: 'nice',
          standardObject: {
            title: 'Dynamic Operations Administrator',
            company: 'Roob, Klein and Mayer',
          },
          listOfObjects: [{ hello: 'hi' }, { goodbye: 'bye' }],
          nestedObjects: [
            {
              nestedObjectsTop: [{ top: 'topObject' }],
            },
            {
              nestedObjectsBottom: [{ bottom: 'bottomObject' }],
            },
          ],
        },
      ],
    }

    const xml = `<result>
            <uuid>c305620d-fd8e-4709-a8a9-4c7cd8813b3d</uuid>
            <status>nice</status>
            <standardObject>
                <title>Dynamic Operations Administrator</title>
                <company>Roob, Klein and Mayer</company>
            </standardObject>
            <listOfObjects>
                <hello>hi</hello>
            </listOfObjects>
            <listOfObjects>
                <goodbye>bye</goodbye>
            </listOfObjects>
            <nestedObjects>
                <nestedObjectsTop>
                    <top>topObject</top>
                </nestedObjectsTop>
            </nestedObjects>
            <nestedObjects>
                <nestedObjectsBottom>
                    <bottom>bottomObject</bottom>
                </nestedObjectsBottom>
            </nestedObjects>
        </result>`

    const nonFormattedXML = xml.replace(/(?<=>)\s+(?=<)/gm, '')

    const result = utils.objectToXML(objects)

    expect(result).toEqual(nonFormattedXML)
  })
})

describe('getConfigValue', () => {
  it('should return the correct config value', () => {
    const mockClass = {
      get: jest.fn(),
    } as unknown as ConfigService<BaseTemplateAPIModuleConfig>
    jest.spyOn(mockClass, 'get').mockImplementation(() => 'x')

    const result = utils.getConfigValue(mockClass, 'attachmentBucket')

    expect(result).toEqual('x')
  })

  it('should throw when a value for a key doesnt exist', () => {
    const mockClass = {
      get: jest.fn(),
    } as unknown as ConfigService<BaseTemplateAPIModuleConfig>
    jest.spyOn(mockClass, 'get').mockImplementation(() => undefined)

    const act = () => utils.getConfigValue(mockClass, 'attachmentBucket')

    expect(act).toThrowError(
      'TemplateAPIModules.sharedService: Missing config value for attachmentBucket',
    )
  })
})
