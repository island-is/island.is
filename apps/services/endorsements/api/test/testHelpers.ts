export const errorExpectedStructure = {
  error: expect.any(String),
  message: expect.anyOf([String, Array]),
  statusCode: expect.any(Number),
}

export const metaDataResponse = {
  fullName: expect.any(String),
  address: {
    streetAddress: expect.any(String),
    city: expect.any(String),
    postalCode: expect.any(String),
  },
  bulkEndorsement: expect.any(Boolean),
  invalidated: expect.any(Boolean),
}
