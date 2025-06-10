import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  FormDto,
  FriggApi,
  KeyOption,
  OrganizationModel,
  FormSubmitSuccessModel,
  UserModel,
} from '../../gen/fetch'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class FriggClientService {
  constructor(private readonly friggApi: FriggApi) {}

  private friggApiWithAuth = (user: User) =>
    this.friggApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getAllKeyOptions(
    user: User,
    type: string | undefined,
  ): Promise<KeyOption[]> {
    return await this.friggApiWithAuth(user).getAllKeyOptions({
      type: type,
    })
  }

  async getAllSchoolsByMunicipality(user: User): Promise<OrganizationModel[]> {
    return await this.friggApiWithAuth(user).getAllSchoolsByMunicipality({})
  }

  async getUserById(
    user: User,
    childNationalId: string,
  ): Promise<UserModel | null> {
    return Promise.resolve({
      id: '1234567890',
      phone: {},
      mobile: {},
      nationalId: '0101302399',
      name: 'Stuttli Maack',
      preferredName: { name: 'Fullorðni Maðurinn' },
      pronouns: ['Hann'],
      gradeLevel: '7',
      email: { address: 'stuttli.maack@example.com' },
      domicile: {
        id: '1234567890',
        address: '123 Main St',
        municipality: { name: 'ExampleSýsla' },
        postCode: '12345',
        country: { name: 'Exampleland' },
        houseNumber: { number: '12' },
        streetNumber: { number: '34' },
        apartmentNumber: { number: '56' },
        municipalityId: { id: '7890' },
      },
      residence: {
        id: '1234567890',
        address: '123 Main St',
        municipality: { name: 'ExampleSýsla' },
        postCode: '12345',
        country: { name: 'Exampleland' },
        houseNumber: { number: '12' },
        streetNumber: { number: '34' },
        apartmentNumber: { number: '56' },
        municipalityId: { id: '7890' },
      },
      primaryOrgId: { id: '1234567890' },
      memberships: null,
      agents: null,
      nationality: 'Exampleland',
      healthProfile: null,
      affiliations: [],
      spokenLanguages: ['Icelandic'],
      preferredLanguage: 'Icelandic',
    })
    return await this.friggApiWithAuth(user)
      .getUserBySourcedId({
        nationalId: childNationalId,
      })
      .catch(handle404)
  }

  sendApplication(user: User, form: FormDto): Promise<FormSubmitSuccessModel> {
    return this.friggApiWithAuth(user).submitForm({ formDto: form })
  }
}
