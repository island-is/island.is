import { readFile } from 'fs/promises'
import { readNewsImageAssignments } from './news-images'

jest.mock('fs/promises', () => ({ readFile: jest.fn() }))
const readFileMock = readFile as jest.Mock

describe('news image assignment input', () => {
  it('requires the manifest path', async () => {
    await expect(readNewsImageAssignments([])).rejects.toThrow(
      'requires --images',
    )
    await expect(
      readNewsImageAssignments(['--images', '--publish']),
    ).rejects.toThrow('requires --images')
  })

  it('reads explicit post-to-asset assignments', async () => {
    readFileMock.mockResolvedValue('{"post":"image-id"}')
    await expect(
      readNewsImageAssignments(['--images', 'images.json']),
    ).resolves.toEqual({ post: 'image-id' })
    expect(readFileMock).toHaveBeenCalledWith('images.json', 'utf8')
  })

  it.each(['[]', 'null', '{"post":""}', '{"post":42}', '{"":"image"}'])(
    'rejects invalid assignments: %s',
    async (input) => {
      readFileMock.mockResolvedValue(input)
      await expect(
        readNewsImageAssignments(['--images', 'images.json']),
      ).rejects.toThrow('must be a JSON object')
    },
  )
})
