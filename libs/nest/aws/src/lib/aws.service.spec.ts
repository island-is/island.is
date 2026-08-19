import { Test, TestingModule } from '@nestjs/testing'
import { AwsModule } from './aws.module'
import { AwsService } from './aws.service'
import { randomBytes, createHash } from 'crypto'
import { S3ServiceException } from '@aws-sdk/client-s3'

const TEST_BUCKET = process.env.AWS_TEST_BUCKET ?? 'island-is-dev-upload-api'
const TEST_FILE_NAME = 'test-file.txt'
const TEST_FILE_CONTENT = 'foo'
const LARGE_FILE_NAME = 'large-file.bin'
const LARGE_FILE_SIZE = 5 * 1024 * 1024 // 10 MB file

describe('AwsService E2E', () => {
  let awsService: AwsService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AwsModule],
    }).compile()

    awsService = module.get<AwsService>(AwsService)
  })

  afterAll(async () => {
    // Cleanup: ensure large file is deleted after all tests
    try {
      await awsService.deleteObject(TEST_BUCKET, LARGE_FILE_NAME)
    } catch (error) {
      console.error('Error during cleanup:', error)
    }
  })

  afterEach(async () => {
    // Clean up any files created during tests
    try {
      await awsService.deleteObject(TEST_BUCKET, TEST_FILE_NAME)
    } catch (error) {
      // Ignore errors if file doesn't exist
    }
  })

  it('should upload, get, and delete a file', async () => {
    // Upload file
    const uploadUrl = await awsService.uploadFile(
      Buffer.from(TEST_FILE_CONTENT),
      TEST_BUCKET,
      TEST_FILE_NAME,
    )
    expect(uploadUrl).toBeTruthy()

    // Check if file exists
    const exists = await awsService.fileExists(TEST_BUCKET, TEST_FILE_NAME)
    expect(exists).toBe(true)

    // Get file content
    const fileContent = await awsService.getFileEncoded({
      bucket: TEST_BUCKET,
      fileName: TEST_FILE_NAME,
      encoding: 'utf-8',
    })
    expect(fileContent).toBe(TEST_FILE_CONTENT)

    // Get presigned URL
    const presignedUrl = await awsService.getPresignedUrl(
      TEST_BUCKET,
      TEST_FILE_NAME,
    )
    expect(presignedUrl).toContain(TEST_BUCKET)
    expect(presignedUrl).toContain(TEST_FILE_NAME)

    // Delete file
    await awsService.deleteObject(TEST_BUCKET, TEST_FILE_NAME)

    // Verify file no longer exists
    const existsAfterDelete = await awsService.fileExists(
      TEST_BUCKET,
      TEST_FILE_NAME,
    )
    expect(existsAfterDelete).toBe(false)
  })

  it('should handle non-existent files', async () => {
    const nonExistentFile = 'non-existent-file.txt'

    const exists = await awsService.fileExists(TEST_BUCKET, nonExistentFile)
    expect(exists).toBe(false)

    await expect(
      awsService.getFile({
        bucket: TEST_BUCKET,
        fileName: nonExistentFile,
      }),
    ).rejects.toThrow()
  })

  it('should handle S3 URIs', async () => {
    const s3Uri = `s3://${TEST_BUCKET}/${TEST_FILE_NAME}`

    // Upload file first
    await awsService.uploadFile(
      Buffer.from(TEST_FILE_CONTENT),
      TEST_BUCKET,
      TEST_FILE_NAME,
    )

    const fileContent = await awsService.getFileEncoded({
      s3Uri,
      encoding: 'utf-8',
    })
    expect(fileContent).toBe(TEST_FILE_CONTENT)
  })

  describe('Large File Operations', () => {
    it('should handle large files', async () => {
      jest.setTimeout(300000) // 5 minutes timeout

      const largeContent = randomBytes(LARGE_FILE_SIZE)
      const originalHash = createHash('md5').update(largeContent).digest('hex')

      console.log('Starting large file upload...')
      let uploadUrl
      try {
        uploadUrl = await awsService.uploadFile(
          largeContent,
          TEST_BUCKET,
          LARGE_FILE_NAME,
        )
        console.log('Large file uploaded successfully')
      } catch (error) {
        console.error('Error during file upload:', error)
        if (error instanceof S3ServiceException) {
          console.error('S3 Error Code:', error.name)
          console.error('S3 Error Message:', error.message)
        }
        throw error
      }
      expect(uploadUrl).toBeTruthy()

      console.log('Checking if file exists...')
      let exists
      try {
        exists = await awsService.fileExists(TEST_BUCKET, LARGE_FILE_NAME)
        console.log('File existence check completed')
      } catch (error) {
        console.error('Error checking file existence:', error)
        throw error
      }
      expect(exists).toBe(true)

      console.log('Downloading and verifying file content...')
      try {
        const fileContent = await awsService.getFile({
          bucket: TEST_BUCKET,
          fileName: LARGE_FILE_NAME,
        })

        if (
          fileContent.Body &&
          typeof fileContent.Body.transformToByteArray === 'function'
        ) {
          const downloadedContent =
            await fileContent.Body.transformToByteArray()
          const downloadedHash = createHash('md5')
            .update(Buffer.from(downloadedContent))
            .digest('hex')

          expect(downloadedHash).toEqual(originalHash)
          console.log('File content verified successfully')
        } else {
          throw new Error('Unexpected response format from getFile')
        }
      } catch (error) {
        console.error('Error retrieving or verifying file content:', error)
        if (error instanceof S3ServiceException) {
          console.error('S3 Error Code:', error.name)
          console.error('S3 Error Message:', error.message)
        }
        throw error
      }

      console.log('Deleting test file...')
      try {
        await awsService.deleteObject(TEST_BUCKET, LARGE_FILE_NAME)
        console.log('Test file deleted successfully')
      } catch (error) {
        console.error('Error deleting test file:', error)
        throw error
      }

      console.log('Large file test completed successfully')
    })
  })

  it('should handle different encodings', async () => {
    const testString = 'Hello, 世界!'
    await awsService.uploadFile(
      Buffer.from(testString, 'utf-8'),
      TEST_BUCKET,
      TEST_FILE_NAME,
    )

    const utf8Content = await awsService.getFileEncoded({
      bucket: TEST_BUCKET,
      fileName: TEST_FILE_NAME,
      encoding: 'utf-8',
    })
    expect(utf8Content).toBe(testString)

    const base64Content = await awsService.getFileEncoded({
      bucket: TEST_BUCKET,
      fileName: TEST_FILE_NAME,
      encoding: 'base64',
    })
    if (base64Content) {
      expect(Buffer.from(base64Content, 'base64').toString('utf-8')).toBe(
        testString,
      )
    }
  })

  it('should handle file metadata', async () => {
    const metadata = {
      ContentType: 'text/plain',
      ContentDisposition: 'attachment; filename="test.txt"',
      ContentEncoding: 'gzip',
    }

    await awsService.uploadFile(
      Buffer.from(TEST_FILE_CONTENT),
      TEST_BUCKET,
      TEST_FILE_NAME,
      metadata,
    )

    const fileMetadata = await awsService.getFile({
      bucket: TEST_BUCKET,
      fileName: TEST_FILE_NAME,
    })

    expect(fileMetadata.ContentType).toBe(metadata.ContentType)
    expect(fileMetadata.ContentDisposition).toBe(metadata.ContentDisposition)
    expect(fileMetadata.ContentEncoding).toBe(metadata.ContentEncoding)
  })

  it('should handle errors gracefully', async () => {
    const invalidBucket = 'non-existent-bucket'

    await expect(
      awsService.uploadFile(
        Buffer.from(TEST_FILE_CONTENT),
        invalidBucket,
        TEST_FILE_NAME,
      ),
    ).rejects.toThrow()

    await expect(
      awsService.getFile({
        bucket: invalidBucket,
        fileName: TEST_FILE_NAME,
      }),
    ).rejects.toThrow()

    await expect(
      awsService.deleteObject(invalidBucket, TEST_FILE_NAME),
    ).rejects.toThrow()
  })

  it('should generate correct presigned URLs', async () => {
    await awsService.uploadFile(
      Buffer.from(TEST_FILE_CONTENT),
      TEST_BUCKET,
      TEST_FILE_NAME,
    )

    const presignedUrl = await awsService.getPresignedUrl(
      TEST_BUCKET,
      TEST_FILE_NAME,
      60,
    ) // 60 seconds expiry

    expect(presignedUrl).toContain(TEST_BUCKET)
    expect(presignedUrl).toContain(TEST_FILE_NAME)
    expect(presignedUrl).toContain('X-Amz-Expires=60')
  })
})
