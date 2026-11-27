import { Transaction } from 'sequelize'
import { FileService } from './file.service'

describe('FileService deletion', () => {
  const setup = (
    json: { s3Key?: unknown } = { s3Key: ['file-key', 'retained-key'] },
  ) => {
    const value = {
      json,
      save: jest.fn().mockResolvedValue(undefined),
    }
    const valueModel = { findByPk: jest.fn().mockResolvedValue(value) }
    const s3Service = { deleteObject: jest.fn().mockResolvedValue(true) }
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

  it('retains the file reference and propagates a false storage deletion result', async () => {
    const { service, valueModel, value, s3Service, logger } = setup()
    s3Service.deleteObject.mockResolvedValue(false)

    await expect(service.deleteFile('file-key', 'value-id')).rejects.toThrow(
      "Failed to delete file 'file-key' from S3",
    )

    expect(logger.error).toHaveBeenCalled()
    expect(valueModel.findByPk).not.toHaveBeenCalled()
    expect(value.save).not.toHaveBeenCalled()
    expect(value.json.s3Key).toEqual(['file-key', 'retained-key'])
  })

  it('removes references transactionally without deleting stored files', async () => {
    const { service, valueModel, value, s3Service } = setup()
    const transaction: Transaction = Object.create(Transaction.prototype)

    await service.removeFileReference('file-key', 'value-id', transaction)

    expect(valueModel.findByPk).toHaveBeenCalledWith('value-id', {
      transaction,
    })
    expect(value.json.s3Key).toEqual(['retained-key'])
    expect(value.save).toHaveBeenCalledWith({ transaction })
    expect(s3Service.deleteObject).not.toHaveBeenCalled()
  })

  it.each([
    { storedKeys: ['file-key', 'retained-key'], expected: ['retained-key'] },
    { storedKeys: 'file-key', expected: [] },
  ])(
    'preserves stringified JSON metadata when removing $storedKeys',
    async ({ storedKeys, expected }) => {
      const { service, valueModel, s3Service } = setup()
      const metadata = { fileName: 'document.pdf', custom: { retained: true } }
      const value = {
        json: JSON.stringify({ ...metadata, s3Key: storedKeys }),
        save: jest.fn().mockResolvedValue(undefined),
      }
      valueModel.findByPk.mockResolvedValue(value)
      const transaction: Transaction = Object.create(Transaction.prototype)

      await service.removeFileReference('file-key', 'value-id', transaction)

      expect(value.json).toEqual({ ...metadata, s3Key: expected })
      expect(valueModel.findByPk).toHaveBeenCalledWith('value-id', {
        transaction,
      })
      expect(value.save).toHaveBeenCalledWith({ transaction })
      expect(s3Service.deleteObject).not.toHaveBeenCalled()
    },
  )

  it.each(['{invalid', 'null'])(
    'logs and rejects invalid stringified payload %s without saving',
    async (json) => {
      const { service, valueModel, logger } = setup()
      const value = { json, save: jest.fn() }
      valueModel.findByPk.mockResolvedValue(value)

      await expect(
        service.removeFileReference('file-key', 'value-id'),
      ).rejects.toThrow()

      expect(value.json).toBe(json)
      expect(value.save).not.toHaveBeenCalled()
      expect(logger.error).toHaveBeenCalledWith(
        'Error parsing file value JSON',
        { valueId: 'value-id', error: expect.any(Error) },
      )
    },
  )

  it.each([
    { storedKeys: 'file-key', expected: [] },
    { storedKeys: 'retained-key', expected: ['retained-key'] },
    { storedKeys: undefined, expected: [] },
    { storedKeys: null, expected: [] },
    { storedKeys: 42, expected: [] },
    { storedKeys: { key: 'file-key' }, expected: [] },
  ])(
    'normalizes stored keys $storedKeys before removing a reference',
    async ({ storedKeys, expected }) => {
      const { service, valueModel, value, s3Service } = setup({
        s3Key: storedKeys,
      })
      const transaction: Transaction = Object.create(Transaction.prototype)

      await service.removeFileReference('file-key', 'value-id', transaction)

      expect(value.json.s3Key).toEqual(expected)
      expect(valueModel.findByPk).toHaveBeenCalledWith('value-id', {
        transaction,
      })
      expect(value.save).toHaveBeenCalledWith({ transaction })
      expect(s3Service.deleteObject).not.toHaveBeenCalled()
    },
  )
})
