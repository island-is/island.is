// NOTE: To run this locally, you'll need to portforward soffia and set
// the environment variable "SOFFIA_SOAP_URL" to https://localhost:8443
// kubectl port-forward svc/socat-soffia 8443:443 -n socat
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'

describe('is.island.external.national', () => {
  let client: NationalRegistryApi
  beforeAll(async () => {
    client = await NationalRegistryApi.instantiateClass({
      baseSoapUrl: process.env.SOFFIA_SOAP_URL!,
      user: process.env.SOFFIA_USER!,
      password: process.env.SOFFIA_PASS!,
      host: process.env.SOFFIA_HOST_URL!,
    })
  })
  it('should get user correctly', async () => {
    const user = await client.getUser('0101302989')
    expect(user.Fulltnafn).toEqual('Gervimaður Ameríka')
  })
  it('throws error if user is not found', async () => {
    await expect(client.getUser('0123456789')).rejects.toThrow(
      'user with nationalId 0123456789 not found in national Registry',
    )
  })
})
