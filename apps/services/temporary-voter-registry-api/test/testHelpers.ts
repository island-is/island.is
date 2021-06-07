export const errorExpectedStructure = {
  error: expect.any(String),
  message: expect.anyOf([String, Array]),
  statusCode: expect.any(Number),
}
export const emptyResponseExpectedStructure = {
  id: '0',
  regionNumber: 0,
  regionName: 'Ekki á skrá',
  nationalId: expect.any(String),
}
