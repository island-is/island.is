import { SharedModuleConfig } from '../../types'
import { ConfigService } from '@nestjs/config'
import * as utils from './shared.utils'

const mockConfig = {
  SharedModuleConfig: {
    clientLocationOrigin: 'http://localhost:4242',
    baseApiUrl: 'http://localhost:4444',
    attachmentBucket: 'attachmentBucket',
    templateApi: {
      clientLocationOrigin: 'http://localhost:4242/umsoknir',
      email: {
        sender: 'Devland.is',
        address: 'development@island.is',
      },
      jwtSecret: 'supersecret',
      xRoadBasePathWithEnv: '',
      baseApiUrl: 'http://localhost:4444',
      presignBucket: '',
      attachmentBucket: 'island-is-dev-storage-application-system',
      generalPetition: {
        endorsementApiBasePath: 'http://localhost:4246',
      },
      userProfile: {
        serviceBasePath: 'http://localhost:3366',
      },
    },
  },
}

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

describe('shared utils', () => {
  let configService: ConfigService<SharedModuleConfig>

  beforeEach(() => {
    configService = new ConfigService(mockConfig)
  })

  it('should get the client location origin from the config', () => {
    const result = utils.getConfigValue(configService, 'clientLocationOrigin')

    expect(result).toEqual('http://localhost:4242')
  })
})
