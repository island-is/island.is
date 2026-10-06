import { User } from '@island.is/auth-nest-tools'
import { FormStatus } from '@island.is/form-system/shared'

import { ApplicationsService } from './applications.service'
import { Form } from '../forms/models/form.model'

describe('ApplicationsService fake user access', () => {
  const originalEnvironment = process.env.name
  const authorization = (idp?: string) => {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256' })).toString(
      'base64url',
    )
    const payload = Buffer.from(JSON.stringify({ idp })).toString('base64url')
    return `Bearer ${header}.${payload}.signature`
  }

  afterEach(() => {
    if (originalEnvironment === undefined) {
      delete process.env.name
    } else {
      process.env.name = originalEnvironment
    }
    jest.restoreAllMocks()
  })

  const setup = (status: string, idp?: string) => {
    const form = { id: 'form-id', status } as Form
    const user: User = {
      nationalId: 'user',
      scope: [],
      client: 'form-system',
      authorization: authorization(idp),
    }
    const applicationModel = {
      findOne: jest.fn().mockResolvedValue({ formId: form.id }),
      create: jest.fn(),
    }
    const transaction = jest.fn()
    const dependencies = [
      applicationModel,
      {},
      {},
      {},
      {},
      {},
      {},
      { warn: jest.fn(), error: jest.fn() },
      { mapFormToApplicationDto: jest.fn() },
      {},
      {},
      { transaction },
    ] as unknown as ConstructorParameters<typeof ApplicationsService>
    const service = new ApplicationsService(...dependencies)
    const accessHelpers = service as unknown as {
      getForm: (slug: string) => Promise<Form>
      getAllowedLoginTypes: (form: Form) => Promise<string[]>
    }
    jest.spyOn(accessHelpers, 'getForm').mockResolvedValue(form)
    jest.spyOn(service, 'getApplicationForm').mockResolvedValue(form)
    const nextAccessCheck = new Error('Reached normal login checks')
    const getAllowedLoginTypes = jest
      .spyOn(accessHelpers, 'getAllowedLoginTypes')
      .mockRejectedValue(nextAccessCheck)

    return {
      service,
      user,
      applicationModel,
      transaction,
      nextAccessCheck,
      getAllowedLoginTypes,
    }
  }

  const operations = [
    'create',
    'getApplication',
    'findAllBySlugAndUser',
  ] as const

  describe.each(operations)('%s', (operation) => {
    const invoke = (service: ApplicationsService, user: User | null) =>
      operation === 'getApplication'
        ? service.getApplication('application-id', 'form-slug', user)
        : service[operation]('form-slug', user as User)

    it('denies fake users on published production forms before further access or writes', async () => {
      process.env.name = 'production'
      const {
        service,
        user,
        applicationModel,
        transaction,
        getAllowedLoginTypes,
      } = setup(FormStatus.PUBLISHED, 'gervimadur')

      await expect(invoke(service, user)).resolves.toMatchObject({
        isLoginTypeAllowed: false,
      })
      expect(getAllowedLoginTypes).not.toHaveBeenCalled()
      expect(applicationModel.create).not.toHaveBeenCalled()
      expect(transaction).not.toHaveBeenCalled()
    })

    it.each([
      ['production', FormStatus.IN_DEVELOPMENT, 'gervimadur'],
      ['staging', FormStatus.PUBLISHED, 'gervimadur'],
      ['dev', FormStatus.PUBLISHED, 'gervimadur'],
      ['production', FormStatus.PUBLISHED, 'audkenni'],
      ['production', FormStatus.PUBLISHED, undefined],
    ])(
      'preserves normal access checks for environment=%s, status=%s, idp=%s',
      async (environment, status, idp) => {
        process.env.name = environment
        const { service, user, getAllowedLoginTypes } = setup(status, idp)

        await expect(invoke(service, user)).rejects.toThrow()
        expect(getAllowedLoginTypes).toHaveBeenCalled()
      },
    )

    if (operation === 'getApplication') {
      it('preserves internal reads without a user', async () => {
        process.env.name = 'production'
        const { service, getAllowedLoginTypes } = setup(FormStatus.PUBLISHED)

        await expect(invoke(service, null)).rejects.toThrow()
        expect(getAllowedLoginTypes).toHaveBeenCalled()
      })
    }
  })
})
