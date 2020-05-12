import { applicationFactory } from '../../factory'

describe('Application model', () => {
  it('should provide a default id', async () => {
    // Arrange
    const ssn = '123456-7890'
    const application = await applicationFactory({ ssn })

    // Assert
    expect(!!application.id).toBeTruthy()
  })

  it('should trigger modified on update', async () => {
    // Arrange
    const ssn = '123456-7890'
    const application = await applicationFactory({ ssn })
    const lastModified = application.modified
    application.changed('modified', true)

    // Act
    application.id = '00000000-0000-0000-0000-000000000000'
    await application.save()

    // Assert
    expect(application.modified > lastModified).toBeTruthy()
  })
})
