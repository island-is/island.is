export const createMockApiResponse = <T>(value: T) =>
  Promise.resolve({
    raw: {},
    value: () => Promise.resolve(value),
  })
