import type { ApplicationWithAttachments } from '@island.is/application/types'
import type { User } from '@island.is/auth-nest-tools'
import type { FinanceClientService } from '@island.is/clients/finance'
import type { SharedTemplateApiService } from '../../shared'
import { NoDebtCertificateService } from './no-debt-certificate.service'

describe('NoDebtCertificateService.getDebtLessCertificate', () => {
  const auth = { nationalId: '0101307789' } as User

  const setup = () => {
    const getDebtLessCertificate = jest.fn().mockResolvedValue({
      debtLessCertificateResult: { debtLess: true },
    })
    const service = new NoDebtCertificateService(
      {} as SharedTemplateApiService,
      { getDebtLessCertificate } as unknown as FinanceClientService,
    )
    return { service, getDebtLessCertificate }
  }

  const application = (answers: Record<string, unknown>) =>
    ({ id: 'application-id', answers } as ApplicationWithAttachments)

  it('fetches the certificate in the chosen language, not the site language', async () => {
    const { service, getDebtLessCertificate } = setup()

    await service.getDebtLessCertificate({
      application: application({ certificateLanguage: 'en' }),
      auth,
      currentUserLocale: 'is',
    })

    expect(getDebtLessCertificate).toHaveBeenCalledWith(
      auth.nationalId,
      'EN',
      auth,
    )
  })

  it('fetches an Icelandic certificate when Icelandic is chosen on the English site', async () => {
    const { service, getDebtLessCertificate } = setup()

    await service.getDebtLessCertificate({
      application: application({ certificateLanguage: 'is' }),
      auth,
      currentUserLocale: 'en',
    })

    expect(getDebtLessCertificate).toHaveBeenCalledWith(
      auth.nationalId,
      'IS',
      auth,
    )
  })

  it('falls back to the site language when no language was chosen', async () => {
    const { service, getDebtLessCertificate } = setup()

    await service.getDebtLessCertificate({
      application: application({}),
      auth,
      currentUserLocale: 'en',
    })

    expect(getDebtLessCertificate).toHaveBeenCalledWith(
      auth.nationalId,
      'EN',
      auth,
    )
  })
})
