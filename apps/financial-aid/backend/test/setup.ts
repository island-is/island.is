jest.setTimeout(20000)

jest.mock('pdfkit', function () {
  class MockPDFDocument {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pipe(stream: any) {
      return stream
    }
    font() {
      return this
    }
    fontSize() {
      return this
    }
    lineGap() {
      return this
    }
    text() {
      return this
    }
    bufferedPageRange() {
      return this
    }
    end() {
      return this
    }
    translate() {
      return this
    }
    scale() {
      return this
    }
    path() {
      return this
    }
    fillColor() {
      return this
    }
    fill() {
      return this
    }
    strokeColor() {
      return this
    }
    lineWidth() {
      return this
    }
    miterLimit() {
      return this
    }
    stroke() {
      return this
    }
    lineJoin() {
      return this
    }
    addPage() {
      return this
    }
  }

  return MockPDFDocument
})

jest.mock('stream-buffers', function () {
  class MockWritableStreamBuffer {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(_: any, fn: () => void) {
      fn()
    }
    getContentsAsString() {
      return ''
    }
  }

  return {
    ReadableStreamBuffer: jest.fn(),
    WritableStreamBuffer: MockWritableStreamBuffer,
  }
})
