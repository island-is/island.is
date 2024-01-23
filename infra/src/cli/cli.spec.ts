import {
  GetParametersCommandInput,
  GetParametersCommandOutput,
  SSM,
} from '@aws-sdk/client-ssm'
import { renderSecretsCommand } from './render-secrets'

// jest.mock('./render-secrets')
// jest.mock('@aws-sdk/client-ssm', () => ({
//   SSM: jest.fn().mockImplementation(() => ({
//     getParameters: jest.fn(() => ({
//       Parameters: [
//         {
//           Name: '/k8s/api/A',
//           Value: 'A',
//         },
//         {
//           Name: 'A',
//           Value: 'B',
//         },
//         {
//           Name: '/k8s/api/HOUSING_BENEFIT_CALCULATOR_PASSWORD',
//           Value: '<<< NOT_UNDEFINED >>>',
//         },
//         {
//           Name: 'HOUSING_BENEFIT_CALCULATOR_PASSWORD',
//           Value: '<<< NOT_UNDEFINED >>>',
//         },
//       ],
//     })),
//   })),
// }))

// Mock the renderSecretsCommand function

describe('render-secrets command', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    /*
     * // This is how we use ssm
     * const allParams = await Promise.all(
     *   chunks.map((Names) =>
     *     client.getParameters({ Names, WithDecryption: true }),
     *   ),
     * )
     */
  })

  it('should fetch 0 secrets when there are none', async () => {
    // Arrange
    // ;(renderSecretsCommand as jest.Mock).mockResolvedValueOnce({
    //   A: 'B',
    // }) // Assuming the function returns an array of secrets
    const argv = { service: 'emptyService' }

    // Act
    const envMap = await renderSecretsCommand(argv.service)

    // Assert
    // expect(renderSecretsCommand).toHaveBeenCalledWith('emptyService')
    // expect(renderSecretsCommand).toReturnWith({})
    expect(envMap).toStrictEqual({ A: 'B' })
  })

  it.only('should fetch all secrets when there are some', async () => {
    // Arrange
    const argv = { service: 'api' }

    // Act
    const envMap = await renderSecretsCommand(argv.service)

    // Assert
    // expect(renderSecretsCommand).toHaveBeenCalledWith('emptyService')
    // expect(renderSecretsCommand).toReturnWith({})
    expect(envMap).toStrictEqual({ A: 'B' })
  })

  /*
  it('should throw an error when the requested service does not exist', async () => {
    // Arrange
    const errorMessage = 'Service not found'
    ;(renderSecretsCommand as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    )
    const argv = { service: 'nonExistentService' }

    // Act & Assert
    await expect(
      yargs
        .command(
          'render-secrets',
          'Render secrets needed by service',
          (yargs) => {
            return yargs.option('service', { demandOption: true })
          },
          async (argv) => {
            await renderSecretsCommand(argv.service)
          },
        )
        .parse(['render-secrets', '--service', argv.service]),
    ).rejects.toThrow(errorMessage)
  })

  it('should correctly fetch the correct number of secrets for a valid service', async () => {
    // Arrange
    const secrets = ['secret1', 'secret2', 'secret3']
    renderSecretsCommand.mockResolvedValueOnce(secrets)
    const argv = { service: 'validService' }

    // Act
    await yargs
      .command(
        'render-secrets',
        'Render secrets needed by service',
        (yargs) => {
          return yargs.option('service', { demandOption: true })
        },
        async (argv) => {
          await renderSecretsCommand(argv.service)
        },
      )
      .parse(['render-secrets', '--service', argv.service])

    // Assert
    expect(renderSecretsCommand).toHaveBeenCalledWith('validService')
    expect(renderSecretsCommand).toReturnWith(secrets)
  })
  */
})
