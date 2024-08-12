import { Readable } from 'stream'
import { streamToBuffer } from './aws' // Assuming the function is exported from aws.ts

describe('streamToBuffer', () => {
  it('should correctly convert NodeJS.ReadableStream to Buffer', async () => {
    const testData = 'Hello, World!'
    const stream = Readable.from(Buffer.from(testData))

    const result = await streamToBuffer(stream)
    expect(result).toBeInstanceOf(Buffer)
    expect(result.toString()).toBe(testData)
  })

  it('should correctly handle empty NodeJS.ReadableStream', async () => {
    const stream = Readable.from([])

    const result = await streamToBuffer(stream)
    expect(result).toBeInstanceOf(Buffer)
    expect(result.length).toBe(0)
  })

  it('should correctly handle large NodeJS.ReadableStream', async () => {
    const largeData = Buffer.alloc(100 * 1024 * 1024, 'a') // 100MB of 'a'
    const stream = Readable.from(largeData)

    const result = await streamToBuffer(stream)
    expect(result).toBeInstanceOf(Buffer)
    expect(result.length).toBe(largeData.length)
    expect(result.toString()).toBe(largeData.toString())
  })

  it('should handle NodeJS.ReadableStream with multiple chunks', async () => {
    const chunks = ['Hello', ' ', 'World', '!']
    const stream = Readable.from(chunks)

    const result = await streamToBuffer(stream)
    expect(result).toBeInstanceOf(Buffer)
    expect(result.toString()).toBe(chunks.join(''))
  })

  it('should handle NodeJS.ReadableStream in object mode', async () => {
    const objects = [{ a: 1 }, { b: 2 }, { c: 3 }]
    const stream = Readable.from(objects, { objectMode: true })

    const result = await streamToBuffer(stream)
    expect(result).toBeInstanceOf(Buffer)
    const parsedResult = JSON.parse(result.toString())
    expect(parsedResult).toEqual(objects)
  })
})
