import { FileService } from './file.service'

describe('FileService deletion', () => {
  const setup = () => {
    const value = {
      json: { s3Key: ['file-key', 'retained-key'] },
      save: jest.fn().mockResolvedValue(undefined),
    }
    const valueModel = { findByPk: jest.fn().mockResolvedValue(value) }
    const s3Service = { deleteObject: jest.fn().mockResolvedValue(undefined) }
    const logger = { info: jest.fn(), error: jest.fn() }
    const service = Object.assign(Object.create(FileService.prototype), {
      config: { bucket: 'bucket' },
      valueModel,
      s3Service,
      logger,
    }) as FileService
    return { service, valueModel, value, s3Service, logger }
  }

  it('deletes archived files without looking up or modifying deleted values', async () => {
    const { service, valueModel, s3Service } = setup()

    await service.deleteFileFromStorage('file-key')

    expect(s3Service.deleteObject).toHaveBeenCalledWith({
      bucket: 'bucket',
      key: 'file-key',
    })
    expect(valueModel.findByPk).not.toHaveBeenCalled()
  })

  it('logs and propagates storage deletion errors', async () => {
    const { service, s3Service, logger } = setup()
    const error = new Error('Storage unavailable')
    s3Service.deleteObject.mockRejectedValue(error)

    await expect(service.deleteFileFromStorage('file-key')).rejects.toThrow(
      error,
    )

    expect(logger.error).toHaveBeenCalledWith(
      'Error deleting file from S3',
      error,
    )
  })

  it('continues removing the value reference for ordinary file deletion', async () => {
    const { service, value } = setup()

    await service.deleteFile('file-key', 'value-id')

    expect(value.json.s3Key).toEqual(['retained-key'])
    expect(value.save).toHaveBeenCalledWith()
  })
})
