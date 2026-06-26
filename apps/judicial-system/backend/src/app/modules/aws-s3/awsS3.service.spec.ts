import type { Logger } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { CaseType } from '@island.is/judicial-system/types'

import { awsS3ModuleConfig } from './awsS3.config'
import { AwsS3Service } from './awsS3.service'

const mockCopyObject = jest
  .fn()
  .mockReturnValue({ promise: () => Promise.resolve({}) })

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    copyObject: mockCopyObject,
  })),
}))

describe('AwsS3Service - copyObject', () => {
  const bucket = 'test-bucket'
  let service: AwsS3Service

  beforeEach(() => {
    mockCopyObject.mockClear()

    service = new AwsS3Service(
      { region: 'eu-west-1', bucket } as ConfigType<typeof awsS3ModuleConfig>,
      { error: jest.fn() } as unknown as Logger,
    )
  })

  it('URL-encodes the CopySource for keys with spaces and non-ASCII characters', async () => {
    const sourceKey = 'caseId/uuid/Dómur snidmat.pdf'
    const destKey = 'newCaseId/uuid2/Dómur snidmat.pdf'

    await service.copyObject(CaseType.INDICTMENT, sourceKey, destKey)

    expect(mockCopyObject).toHaveBeenCalledTimes(1)
    const arg = mockCopyObject.mock.calls[0][0]

    // The bucket and structural slashes are preserved, but each segment is
    // URL-encoded so the source object resolves (space -> %20, ó -> %C3%B3).
    // Without this, S3 rejects the copy with SignatureDoesNotMatch.
    expect(arg.CopySource).toBe(
      'test-bucket/indictments/caseId/uuid/D%C3%B3mur%20snidmat.pdf',
    )
    expect(arg.CopySource).not.toContain('ó')
    expect(arg.CopySource).not.toContain(' ')

    // The destination is passed via `Key`, which the SDK encodes itself.
    expect(arg.Key).toBe('indictments/newCaseId/uuid2/Dómur snidmat.pdf')
  })

  it('leaves plain ASCII keys structurally intact', async () => {
    await service.copyObject(
      CaseType.INDICTMENT,
      'caseId/uuid/file.pdf',
      'newCaseId/uuid2/file.pdf',
    )

    const arg = mockCopyObject.mock.calls[0][0]

    expect(arg.CopySource).toBe('test-bucket/indictments/caseId/uuid/file.pdf')
  })
})
