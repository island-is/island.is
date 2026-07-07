import { ForbiddenException } from '@nestjs/common'
import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  ApplicationTypes,
  InstitutionNationalIds,
} from '@island.is/application/types'

import { TranslationAccessService } from './translation-access.service'

describe('TranslationAccessService', () => {
  const service = new TranslationAccessService()

  const superAdminUser = {
    nationalId: '0101302989',
    scope: [AdminPortalScope.applicationSystemAdmin],
    authorization: 'Bearer token',
    client: 'client',
  }

  const hmsUser = {
    nationalId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
    scope: [AdminPortalScope.applicationSystemInstitution],
    authorization: 'Bearer token',
    client: 'client',
  }

  it('does not throw for super admin accessing any typeId', () => {
    expect(() =>
      service.assertTypeIdAccess(superAdminUser, ApplicationTypes.PASSPORT),
    ).not.toThrow()
  })

  it('throws for institution user accessing another institution typeId', () => {
    expect(() =>
      service.assertTypeIdAccess(hmsUser, ApplicationTypes.PASSPORT),
    ).toThrow(ForbiddenException)
  })

  it('allows institution user to access own typeId', () => {
    expect(() =>
      service.assertTypeIdAccess(hmsUser, ApplicationTypes.RENTAL_AGREEMENT),
    ).not.toThrow()
  })

  it('throws for institution user accessing unauthorized namespace', () => {
    expect(() =>
      service.assertNamespaceAccess(hmsUser, 'pa.application'),
    ).toThrow(ForbiddenException)
  })

  it('filters type IDs for institution users', () => {
    const filtered = service.filterTypeIds(hmsUser, [
      ApplicationTypes.RENTAL_AGREEMENT,
      ApplicationTypes.PASSPORT,
    ])

    expect(filtered).toEqual([ApplicationTypes.RENTAL_AGREEMENT])
  })

  it('returns all type IDs for super admin', () => {
    const typeIds = [
      ApplicationTypes.RENTAL_AGREEMENT,
      ApplicationTypes.PASSPORT,
    ]
    expect(service.filterTypeIds(superAdminUser, typeIds)).toEqual(typeIds)
  })

  it('filters namespaces for institution users', () => {
    const filtered = service.filterNamespaces(hmsUser, [
      'ra.application',
      'pa.application',
    ])

    expect(filtered).toEqual(['ra.application'])
  })
})
