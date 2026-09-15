import { createCurrentUser } from '@island.is/testing/fixtures'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  NationalRegistryParameters,
  ChildrenCustodyInformationParameters,
} from '@island.is/application/types'
import { NationalRegistryV3Service } from './national-registry-v3.service'
import {
  CitizenshipDto,
  CohabitationDto,
  IndividualDto,
} from '@island.is/clients/national-registry-v3-applications'

const buildIndividual = (overrides: Partial<IndividualDto> = {}): IndividualDto => ({
  nationalId: '1234567890',
  name: 'Jón Jónsson',
  givenName: 'Jón',
  middleName: null,
  familyName: 'Jónsson',
  fullName: 'Jón Jónsson',
  genderCode: '1',
  genderDescription: 'Karl',
  exceptionFromDirectMarketing: false,
  birthdate: new Date('1990-01-01'),
  legalDomicile: {
    streetAddress: 'Testgata 1',
    postalCode: '101',
    locality: 'Reykjavík',
    municipalityNumber: '0000',
  },
  residence: null,
  ...overrides,
})

const buildCitizenship = (
  overrides: Partial<CitizenshipDto> = {},
): CitizenshipDto => ({
  countryCode: 'IS',
  countryName: 'Iceland',
  ...overrides,
})

const buildCohabitation = (
  overrides: Partial<CohabitationDto> = {},
): CohabitationDto => ({
  cohabitationCode: 'G',
  cohabitationCodeDescription: 'Gift/ur',
  spouseName: 'Maki Makason',
  spouseNationalId: '9876543210',
  lastModified: new Date('2020-01-01'),
  ...overrides,
})

describe('NationalRegistryV3Service', () => {
  let nationalRegistryV3Api: {
    [key: string]: jest.Mock
  }
  let service: NationalRegistryV3Service
  const auth = createCurrentUser({ nationalId: '1234567890' })

  beforeEach(() => {
    nationalRegistryV3Api = {
      getIndividual: jest.fn(),
      getOtherIndividual: jest.fn(),
      getCitizenship: jest.fn(),
      getCohabitationInfo: jest.fn(),
      getCustodyChildren: jest.fn(),
      getLegalParents: jest.fn(),
      getFamily: jest.fn(),
      getOtherCustodyParents: jest.fn(),
      getBirthplace: jest.fn(),
      getCurrentResidence: jest.fn(),
      getResidenceHistory: jest.fn(),
      getCohabitants: jest.fn(),
      getMyCustodians: jest.fn(),
      getNationalIdType: jest.fn(),
    }

    service = new NationalRegistryV3Service(nationalRegistryV3Api as any)
  })

  describe('getIndividual', () => {
    it('returns a formatted individual', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(buildIndividual())
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())
      nationalRegistryV3Api.getCohabitationInfo.mockResolvedValue(
        buildCohabitation(),
      )

      const result = await service.getIndividual('1234567890', auth)

      expect(result).toMatchObject({
        nationalId: '1234567890',
        givenName: 'Jón',
        familyName: 'Jónsson',
        fullName: 'Jón Jónsson',
        citizenship: { code: 'IS', name: 'Iceland' },
        maritalTitle: { code: 'G', description: 'Gift/ur' },
      })
      expect(nationalRegistryV3Api.getCohabitationInfo).toHaveBeenCalled()
    })

    it('skips fetching marital title when skipMaritalTitle is set', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(buildIndividual())
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())

      await service.getIndividual('1234567890', auth, {
        skipMaritalTitle: true,
      } as NationalRegistryParameters)

      expect(nationalRegistryV3Api.getCohabitationInfo).not.toHaveBeenCalled()
    })

    it('returns null when the person is not found', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(null)
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(null)

      const result = await service.getIndividual('1234567890', auth, {
        skipMaritalTitle: true,
      } as NationalRegistryParameters)

      expect(result).toBeNull()
    })

    it('throws when validateAlreadyHasIcelandicCitizenship is set and citizenship is already Icelandic', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(buildIndividual())
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())

      await expect(
        service.getIndividual('1234567890', auth, {
          skipMaritalTitle: true,
          validateAlreadyHasIcelandicCitizenship: true,
        } as NationalRegistryParameters),
      ).rejects.toThrow(TemplateApiError)
    })
  })

  describe('nationalRegistry', () => {
    const buildProps = (params?: NationalRegistryParameters) => ({
      auth,
      params,
    })

    it('throws a 404 when the applicant is not found in the national registry', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(null)
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(null)

      await expect(
        service.nationalRegistry(buildProps() as any),
      ).rejects.toThrow(TemplateApiError)
    })

    it('validates custody children when allowPassOnChild is set', async () => {
      nationalRegistryV3Api.getIndividual
        .mockResolvedValueOnce(buildIndividual())
        .mockResolvedValueOnce(buildIndividual({ nationalId: 'child-1' }))
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())
      nationalRegistryV3Api.getCustodyChildren.mockResolvedValue(['child-1'])

      const result = await service.nationalRegistry(
        buildProps({
          allowPassOnChild: true,
          legalDomicileIceland: true,
        } as NationalRegistryParameters) as any,
      )

      expect(result).toMatchObject({ nationalId: '1234567890' })
      expect(nationalRegistryV3Api.getCustodyChildren).toHaveBeenCalledWith(
        auth,
      )
    })

    it('skips the applicant citizenship check when a child already has Icelandic citizenship', async () => {
      nationalRegistryV3Api.getIndividual
        .mockResolvedValueOnce(buildIndividual({ nationalId: 'applicant' }))
        .mockResolvedValueOnce(buildIndividual({ nationalId: 'child-1' }))
      nationalRegistryV3Api.getCitizenship
        .mockResolvedValueOnce(buildCitizenship({ countryCode: 'US' }))
        .mockResolvedValueOnce(buildCitizenship({ countryCode: 'IS' }))
      nationalRegistryV3Api.getCustodyChildren.mockResolvedValue(['child-1'])

      const result = await service.nationalRegistry(
        buildProps({
          allowIfChildHasCitizenship: true,
          icelandicCitizenship: true,
        } as NationalRegistryParameters) as any,
      )

      expect(result).toMatchObject({ nationalId: 'applicant' })
    })

    it('throws when the applicant does not have Icelandic citizenship and no child does either', async () => {
      nationalRegistryV3Api.getIndividual
        .mockResolvedValueOnce(buildIndividual({ nationalId: 'applicant' }))
        .mockResolvedValueOnce(buildIndividual({ nationalId: 'child-1' }))
      nationalRegistryV3Api.getCitizenship
        .mockResolvedValueOnce(buildCitizenship({ countryCode: 'US' }))
        .mockResolvedValueOnce(buildCitizenship({ countryCode: 'US' }))
      nationalRegistryV3Api.getCustodyChildren.mockResolvedValue(['child-1'])

      await expect(
        service.nationalRegistry(
          buildProps({
            allowIfChildHasCitizenship: true,
            icelandicCitizenship: true,
          } as NationalRegistryParameters) as any,
        ),
      ).rejects.toThrow(TemplateApiError)
    })

    it('throws when legalDomicileIceland is set and the applicant has no domicile in Iceland', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(
        buildIndividual({
          legalDomicile: {
            streetAddress: 'Erlendagata 1',
            postalCode: '9999',
            locality: 'Foreign City',
            municipalityNumber: '9999',
          },
        }),
      )
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())

      await expect(
        service.nationalRegistry(
          buildProps({
            legalDomicileIceland: true,
          } as NationalRegistryParameters) as any,
        ),
      ).rejects.toThrow(TemplateApiError)
    })

    it('does not throw when legalDomicileIceland is set and the applicant has a domicile in Iceland', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(buildIndividual())
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())

      const result = await service.nationalRegistry(
        buildProps({
          legalDomicileIceland: true,
        } as NationalRegistryParameters) as any,
      )

      expect(result).toMatchObject({ nationalId: '1234567890' })
    })

    it('throws when icelandicCitizenship is set and the applicant is not Icelandic', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(buildIndividual())
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(
        buildCitizenship({ countryCode: 'US' }),
      )

      await expect(
        service.nationalRegistry(
          buildProps({
            icelandicCitizenship: true,
          } as NationalRegistryParameters) as any,
        ),
      ).rejects.toThrow(TemplateApiError)
    })

    it('does not throw when icelandicCitizenship is set and the applicant is Icelandic', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(buildIndividual())
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())

      const result = await service.nationalRegistry(
        buildProps({
          icelandicCitizenship: true,
        } as NationalRegistryParameters) as any,
      )

      expect(result).toMatchObject({ nationalId: '1234567890' })
    })

    describe('ageToValidate', () => {
      afterEach(() => {
        jest.useRealTimers()
      })

      it('throws when the applicant is younger than ageToValidate', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2024-01-01'))
        nationalRegistryV3Api.getIndividual.mockResolvedValue(
          buildIndividual({ birthdate: new Date('2010-01-01') }),
        )
        nationalRegistryV3Api.getCitizenship.mockResolvedValue(
          buildCitizenship(),
        )

        await expect(
          service.nationalRegistry(
            buildProps({
              ageToValidate: 18,
            } as NationalRegistryParameters) as any,
          ),
        ).rejects.toThrow(TemplateApiError)
      })

      it('throws the custom ageToValidateError when provided', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2024-01-01'))
        nationalRegistryV3Api.getIndividual.mockResolvedValue(
          buildIndividual({ birthdate: new Date('2010-01-01') }),
        )
        nationalRegistryV3Api.getCitizenship.mockResolvedValue(
          buildCitizenship(),
        )
        const ageToValidateError = {
          title: 'Custom title',
          summary: 'Custom summary',
        }

        await expect(
          service.nationalRegistry(
            buildProps({
              ageToValidate: 18,
              ageToValidateError,
            } as NationalRegistryParameters) as any,
          ),
        ).rejects.toMatchObject({
          problem: { errorReason: ageToValidateError },
        })
      })

      it('does not throw when the applicant meets ageToValidate', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2024-01-01'))
        nationalRegistryV3Api.getIndividual.mockResolvedValue(
          buildIndividual({ birthdate: new Date('1990-01-01') }),
        )
        nationalRegistryV3Api.getCitizenship.mockResolvedValue(
          buildCitizenship(),
        )

        const result = await service.nationalRegistry(
          buildProps({
            ageToValidate: 18,
          } as NationalRegistryParameters) as any,
        )

        expect(result).toMatchObject({ nationalId: '1234567890' })
      })
    })

    it('throws when citizenshipWithinEES is set and the citizenship is outside the EES', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(buildIndividual())
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(
        buildCitizenship({ countryCode: 'US' }),
      )

      await expect(
        service.nationalRegistry(
          buildProps({
            citizenshipWithinEES: true,
          } as NationalRegistryParameters) as any,
        ),
      ).rejects.toThrow(TemplateApiError)
    })

    it('does not throw when citizenshipWithinEES is set and the citizenship is within the EES', async () => {
      nationalRegistryV3Api.getIndividual.mockResolvedValue(buildIndividual())
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(
        buildCitizenship({ countryCode: 'DE', countryName: 'Germany' }),
      )

      const result = await service.nationalRegistry(
        buildProps({
          citizenshipWithinEES: true,
        } as NationalRegistryParameters) as any,
      )

      expect(result).toMatchObject({ nationalId: '1234567890' })
    })
  })

  describe('getOtherIndividual', () => {
    it('returns a formatted other-individual', async () => {
      nationalRegistryV3Api.getOtherIndividual.mockResolvedValue(
        buildIndividual(),
      )

      const result = await service.getOtherIndividual('1234567890', auth)

      expect(result).toEqual({
        nationalId: '1234567890',
        fullName: 'Jón Jónsson',
        address: {
          streetAddress: 'Testgata 1',
          postalCode: '101',
          locality: 'Reykjavík',
          city: 'Reykjavík',
          municipalityCode: '0000',
        },
      })
    })

    it('returns null when not found', async () => {
      nationalRegistryV3Api.getOtherIndividual.mockResolvedValue(null)

      const result = await service.getOtherIndividual('1234567890', auth)

      expect(result).toBeNull()
    })
  })

  describe('getParents', () => {
    it('returns an empty list when there are no legal parents', async () => {
      nationalRegistryV3Api.getLegalParents.mockResolvedValue([])

      const result = await service.getParents({ auth } as any)

      expect(result).toEqual([])
    })

    it('splits the full name into given/family name for each parent', async () => {
      nationalRegistryV3Api.getLegalParents.mockResolvedValue([
        'parent-1',
        'parent-2',
      ])
      nationalRegistryV3Api.getOtherIndividual
        .mockResolvedValueOnce(buildIndividual({ name: 'Anna Jónsdóttir' }))
        .mockResolvedValueOnce(buildIndividual({ name: 'Einar' }))

      const result = await service.getParents({ auth } as any)

      expect(result).toEqual([
        expect.objectContaining({ givenName: 'Anna', familyName: 'Jónsdóttir' }),
        expect.objectContaining({ givenName: 'Einar', familyName: null }),
      ])
    })
  })

  describe('childrenCustodyInformation', () => {
    const buildProps = (params?: ChildrenCustodyInformationParameters) => ({
      auth,
      params,
    })

    it('throws when validateHasChildren is set and there are no children', async () => {
      nationalRegistryV3Api.getCustodyChildren.mockResolvedValue([])

      await expect(
        service.childrenCustodyInformation(
          buildProps({
            validateHasChildren: true,
          } as ChildrenCustodyInformationParameters) as any,
        ),
      ).rejects.toThrow(TemplateApiError)
    })

    it('returns an empty list when there are no children and validation is not requested', async () => {
      nationalRegistryV3Api.getCustodyChildren.mockResolvedValue([])

      const result = await service.childrenCustodyInformation(
        buildProps() as any,
      )

      expect(result).toEqual([])
    })

    it('marks a child as living with both parents only when parent B shares the family', async () => {
      nationalRegistryV3Api.getCustodyChildren.mockResolvedValue(['child-1'])
      nationalRegistryV3Api.getFamily.mockResolvedValue({
        familyId: 'family-1',
        individuals: [{ nationalId: 'child-1' }, { nationalId: 'parent-b' }],
      })
      nationalRegistryV3Api.getIndividual.mockResolvedValue(
        buildIndividual({ nationalId: 'child-1' }),
      )
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())
      nationalRegistryV3Api.getOtherCustodyParents.mockResolvedValue([
        auth.nationalId,
        'parent-b',
      ])
      nationalRegistryV3Api.getOtherIndividual.mockResolvedValue(
        buildIndividual({ nationalId: 'parent-b' }),
      )

      const [child] = await service.childrenCustodyInformation(
        buildProps() as any,
      )

      expect(child).toMatchObject({
        nationalId: 'child-1',
        livesWithApplicant: true,
        livesWithBothParents: true,
      })
    })

    it('marks domicileInIceland as false when the municipality code is missing', async () => {
      nationalRegistryV3Api.getCustodyChildren.mockResolvedValue(['child-1'])
      nationalRegistryV3Api.getFamily.mockResolvedValue({
        familyId: 'family-1',
        individuals: [{ nationalId: 'child-1' }],
      })
      nationalRegistryV3Api.getIndividual.mockResolvedValue(
        buildIndividual({ nationalId: 'child-1', legalDomicile: null }),
      )
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())
      nationalRegistryV3Api.getOtherCustodyParents.mockResolvedValue([
        auth.nationalId,
      ])

      const [child] = await service.childrenCustodyInformation(
        buildProps() as any,
      )

      expect(child).toMatchObject({ domicileInIceland: false })
    })

    it('marks domicileInIceland as false when the municipality code starts with 99', async () => {
      nationalRegistryV3Api.getCustodyChildren.mockResolvedValue(['child-1'])
      nationalRegistryV3Api.getFamily.mockResolvedValue({
        familyId: 'family-1',
        individuals: [{ nationalId: 'child-1' }],
      })
      nationalRegistryV3Api.getIndividual.mockResolvedValue(
        buildIndividual({
          nationalId: 'child-1',
          legalDomicile: {
            streetAddress: 'Erlendagata 1',
            postalCode: '9999',
            locality: 'Foreign City',
            municipalityNumber: '9999',
          },
        }),
      )
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())
      nationalRegistryV3Api.getOtherCustodyParents.mockResolvedValue([
        auth.nationalId,
      ])

      const [child] = await service.childrenCustodyInformation(
        buildProps() as any,
      )

      expect(child).toMatchObject({ domicileInIceland: false })
    })

    it('filters out a custody child that cannot be resolved to an individual', async () => {
      nationalRegistryV3Api.getCustodyChildren.mockResolvedValue(['child-1'])
      nationalRegistryV3Api.getFamily.mockResolvedValue({
        familyId: 'family-1',
        individuals: [],
      })
      nationalRegistryV3Api.getIndividual.mockResolvedValue(null)

      const result = await service.childrenCustodyInformation(
        buildProps() as any,
      )

      expect(result).toEqual([])
      expect(
        nationalRegistryV3Api.getOtherCustodyParents,
      ).not.toHaveBeenCalled()
    })

    it('throws when validateHasJointCustody is set and no child has another parent', async () => {
      nationalRegistryV3Api.getCustodyChildren.mockResolvedValue(['child-1'])
      nationalRegistryV3Api.getFamily.mockResolvedValue({
        familyId: 'family-1',
        individuals: [],
      })
      nationalRegistryV3Api.getIndividual.mockResolvedValue(
        buildIndividual({ nationalId: 'child-1' }),
      )
      nationalRegistryV3Api.getCitizenship.mockResolvedValue(buildCitizenship())
      nationalRegistryV3Api.getOtherCustodyParents.mockResolvedValue([
        auth.nationalId,
      ])

      await expect(
        service.childrenCustodyInformation(
          buildProps({
            validateHasJointCustody: true,
          } as ChildrenCustodyInformationParameters) as any,
        ),
      ).rejects.toThrow(TemplateApiError)
    })
  })

  describe('getSpouse', () => {
    it('returns falsy when there is no cohabitation info', async () => {
      nationalRegistryV3Api.getCohabitationInfo.mockResolvedValue(null)

      const result = await service.getSpouse({ auth } as any)

      expect(result).toBeFalsy()
    })

    it('resolves the spouse address but leaves birthplace/citizenship null (unavailable in V3)', async () => {
      nationalRegistryV3Api.getCohabitationInfo.mockResolvedValue(
        buildCohabitation(),
      )
      nationalRegistryV3Api.getOtherIndividual.mockResolvedValue(
        buildIndividual({ nationalId: '9876543210' }),
      )

      const result = await service.getSpouse({ auth } as any)

      expect(result).toMatchObject({
        nationalId: '9876543210',
        name: 'Maki Makason',
        birthplace: null,
        citizenship: null,
        address: { streetAddress: 'Testgata 1' },
      })
    })
  })

  describe('getMaritalTitle', () => {
    it('returns null when there is no cohabitation info', async () => {
      nationalRegistryV3Api.getCohabitationInfo.mockResolvedValue(null)

      const result = await service.getMaritalTitle({ auth } as any)

      expect(result).toBeNull()
    })

    it('returns the marital title code and description', async () => {
      nationalRegistryV3Api.getCohabitationInfo.mockResolvedValue(
        buildCohabitation(),
      )

      const result = await service.getMaritalTitle({ auth } as any)

      expect(result).toEqual({
        code: 'G',
        description: 'Gift/ur',
      })
    })
  })

  describe('getBirthplace', () => {
    it('throws when validateNotEmpty is set and locality is missing', async () => {
      nationalRegistryV3Api.getBirthplace.mockResolvedValue({
        birthdate: new Date('1990-01-01'),
        locality: null,
        municipalityNumber: null,
      })

      await expect(
        service.getBirthplace({
          auth,
          params: { validateNotEmpty: true },
        } as any),
      ).rejects.toThrow(TemplateApiError)
    })

    it('does not throw when validateNotEmpty is not set', async () => {
      nationalRegistryV3Api.getBirthplace.mockResolvedValue({
        birthdate: new Date('1990-01-01'),
        locality: null,
        municipalityNumber: null,
      })

      const result = await service.getBirthplace({ auth } as any)

      expect(result).toMatchObject({ location: null })
    })
  })

  describe('getCurrentResidence', () => {
    it('throws a 404 when residence is missing', async () => {
      nationalRegistryV3Api.getCurrentResidence.mockResolvedValue(null)

      await expect(
        service.getCurrentResidence({ auth } as any),
      ).rejects.toThrow(TemplateApiError)
    })
  })

  describe('getResidenceHistory', () => {
    it('throws a 404 when residence history is missing', async () => {
      nationalRegistryV3Api.getResidenceHistory.mockResolvedValue(null)

      await expect(
        service.getResidenceHistory({ auth } as any),
      ).rejects.toThrow(TemplateApiError)
    })
  })

  describe('getCohabitants', () => {
    it('throws a 404 when cohabitants are missing', async () => {
      nationalRegistryV3Api.getCohabitants.mockResolvedValue(null)

      await expect(service.getCohabitants({ auth } as any)).rejects.toThrow(
        TemplateApiError,
      )
    })

    it('returns the cohabitant national ids', async () => {
      nationalRegistryV3Api.getCohabitants.mockResolvedValue(['9876543210'])

      const result = await service.getCohabitants({ auth } as any)

      expect(result).toEqual(['9876543210'])
    })
  })

  describe('getCohabitantsDetailed', () => {
    it('resolves details for each cohabitant', async () => {
      nationalRegistryV3Api.getCohabitants.mockResolvedValue(['9876543210'])
      nationalRegistryV3Api.getOtherIndividual.mockResolvedValue(
        buildIndividual({ nationalId: '9876543210' }),
      )

      const result = await service.getCohabitantsDetailed({ auth } as any)

      expect(result).toEqual([
        expect.objectContaining({ nationalId: '9876543210' }),
      ])
    })
  })

  describe('getCustodians', () => {
    it('skips custodians that cannot be resolved', async () => {
      nationalRegistryV3Api.getMyCustodians.mockResolvedValue([
        'custodian-1',
        'custodian-2',
      ])
      nationalRegistryV3Api.getOtherIndividual
        .mockResolvedValueOnce(buildIndividual({ nationalId: 'custodian-1' }))
        .mockResolvedValueOnce(null)

      const result = await service.getCustodians({ auth } as any)

      expect(result).toEqual([
        expect.objectContaining({ nationalId: 'custodian-1' }),
      ])
    })

    it('maps the resolved custodian legal domicile from the address details', async () => {
      nationalRegistryV3Api.getMyCustodians.mockResolvedValue(['custodian-1'])
      nationalRegistryV3Api.getOtherIndividual.mockResolvedValue(
        buildIndividual({ nationalId: 'custodian-1', name: 'Custodian Name' }),
      )

      const result = await service.getCustodians({ auth } as any)

      expect(result).toEqual([
        {
          nationalId: 'custodian-1',
          name: 'Custodian Name',
          legalDomicile: {
            streetAddress: 'Testgata 1',
            postalCode: '101',
            locality: 'Reykjavík',
            municipalityNumber: '0000',
          },
        },
      ])
    })

    it('sets legalDomicile to null when the custodian has no address', async () => {
      nationalRegistryV3Api.getMyCustodians.mockResolvedValue(['custodian-1'])
      nationalRegistryV3Api.getOtherIndividual.mockResolvedValue(
        buildIndividual({ nationalId: 'custodian-1', legalDomicile: null }),
      )

      const result = await service.getCustodians({ auth } as any)

      expect(result).toEqual([
        expect.objectContaining({
          nationalId: 'custodian-1',
          legalDomicile: null,
        }),
      ])
    })
  })

  describe('getNationalIdType', () => {
    it('returns the national id type from the client', async () => {
      const nationalIdType = {
        nationalId: '1234567890',
        name: 'Einstaklingur',
        registryCode: '1',
        registryDescription: 'Einstaklingur',
      }
      nationalRegistryV3Api.getNationalIdType.mockResolvedValue(nationalIdType)

      const result = await service.getNationalIdType('1234567890', auth)

      expect(nationalRegistryV3Api.getNationalIdType).toHaveBeenCalledWith(
        '1234567890',
        auth,
      )
      expect(result).toEqual(nationalIdType)
    })

    it('returns null when the client returns null', async () => {
      nationalRegistryV3Api.getNationalIdType.mockResolvedValue(null)

      const result = await service.getNationalIdType('1234567890', auth)

      expect(result).toBeNull()
    })
  })
})
