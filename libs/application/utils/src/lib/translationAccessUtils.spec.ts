import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  ApplicationTypes,
  InstitutionNationalIds,
} from '@island.is/application/types'

import {
  CORE_TRANSLATION_NAMESPACE,
  getAllowedTranslationTypeIds,
  getSharedTranslationNamespaces,
  getTypeIdsForNamespace,
  encodeTranslationNamespaceForUrlPath,
  filterOwnedTranslationDescriptors,
  getOwnedTranslationNamespaces,
  hasGlobalTranslationAccess,
  isOwnedTranslationMessageId,
  isSharedTranslationNamespace,
  isTranslationNamespaceAllowed,
  isTranslationTypeIdAllowed,
} from './translationAccessUtils'

const hmsUser = {
  nationalId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
  scope: [AdminPortalScope.applicationSystemInstitution],
}

const superAdminUser = {
  nationalId: '0101302989',
  scope: [AdminPortalScope.applicationSystemAdmin],
}

const delegatedHmsUser = {
  nationalId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
  scope: [AdminPortalScope.applicationSystemInstitution],
}

const superAdminActingAsInstitution = {
  nationalId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
  scope: [AdminPortalScope.applicationSystemInstitution],
  actor: {
    scope: [AdminPortalScope.applicationSystemAdmin],
  },
}

describe('translationAccessUtils', () => {
  describe('hasGlobalTranslationAccess', () => {
    it('returns true for super admin', () => {
      expect(hasGlobalTranslationAccess(superAdminUser)).toBe(true)
    })

    it('returns false for institution users', () => {
      expect(hasGlobalTranslationAccess(hmsUser)).toBe(false)
    })

    it('returns false for a delegated institution session', () => {
      expect(hasGlobalTranslationAccess(delegatedHmsUser)).toBe(false)
    })

    it('does not escalate via actor scopes when a super admin acts as an institution', () => {
      expect(hasGlobalTranslationAccess(superAdminActingAsInstitution)).toBe(
        false,
      )
    })
  })

  describe('getAllowedTranslationTypeIds', () => {
    it('returns null for super admin', () => {
      expect(getAllowedTranslationTypeIds(superAdminUser)).toBeNull()
    })

    it('narrows to the institution when a super admin acts as that institution', () => {
      const allowed = getAllowedTranslationTypeIds(
        superAdminActingAsInstitution,
      )
      expect(allowed).toContain(ApplicationTypes.RENTAL_AGREEMENT)
      expect(allowed).toContain(ApplicationTypes.HOUSING_BENEFITS)
      expect(allowed).not.toContain(ApplicationTypes.PASSPORT)
    })

    it('returns HMS type IDs for HMS institution user', () => {
      const allowed = getAllowedTranslationTypeIds(hmsUser)
      expect(allowed).toContain(ApplicationTypes.RENTAL_AGREEMENT)
      expect(allowed).toContain(ApplicationTypes.HOUSING_BENEFITS)
      expect(allowed).not.toContain(ApplicationTypes.PASSPORT)
    })

    it('returns empty list for unknown institution', () => {
      expect(
        getAllowedTranslationTypeIds({
          nationalId: '0000000000',
          scope: [AdminPortalScope.applicationSystemInstitution],
        }),
      ).toEqual([])
    })
  })

  describe('isTranslationTypeIdAllowed', () => {
    it('allows any type for super admin', () => {
      expect(
        isTranslationTypeIdAllowed(superAdminUser, ApplicationTypes.PASSPORT),
      ).toBe(true)
    })

    it('allows HMS applications for HMS institution user', () => {
      expect(
        isTranslationTypeIdAllowed(hmsUser, ApplicationTypes.RENTAL_AGREEMENT),
      ).toBe(true)
    })

    it('denies non-HMS applications for HMS institution user', () => {
      expect(
        isTranslationTypeIdAllowed(hmsUser, ApplicationTypes.PASSPORT),
      ).toBe(false)
    })

    it('denies other institutions when a super admin acts as HMS', () => {
      expect(
        isTranslationTypeIdAllowed(
          superAdminActingAsInstitution,
          ApplicationTypes.PASSPORT,
        ),
      ).toBe(false)
    })

    it('allows HMS applications when a super admin acts as HMS', () => {
      expect(
        isTranslationTypeIdAllowed(
          superAdminActingAsInstitution,
          ApplicationTypes.RENTAL_AGREEMENT,
        ),
      ).toBe(true)
    })
  })

  describe('getTypeIdsForNamespace', () => {
    it('returns type IDs that use the namespace', () => {
      const typeIds = getTypeIdsForNamespace('ra.application')
      expect(typeIds).toContain(ApplicationTypes.RENTAL_AGREEMENT)
    })
  })

  describe('isTranslationNamespaceAllowed', () => {
    it('allows app namespace for HMS institution user', () => {
      expect(isTranslationNamespaceAllowed(hmsUser, 'ra.application')).toBe(
        true,
      )
    })

    it('denies unrelated namespace for HMS institution user', () => {
      expect(isTranslationNamespaceAllowed(hmsUser, 'pa.application')).toBe(
        false,
      )
    })

    it('allows any namespace for super admin', () => {
      expect(
        isTranslationNamespaceAllowed(superAdminUser, 'pa.application'),
      ).toBe(true)
    })

    it('denies core namespace for institution user', () => {
      expect(
        isTranslationNamespaceAllowed(hmsUser, CORE_TRANSLATION_NAMESPACE),
      ).toBe(false)
    })

    it('denies core namespace when a super admin acts as an institution', () => {
      expect(
        isTranslationNamespaceAllowed(
          superAdminActingAsInstitution,
          CORE_TRANSLATION_NAMESPACE,
        ),
      ).toBe(false)
    })
  })

  describe('getSharedTranslationNamespaces', () => {
    it('always includes application.system', () => {
      const namespaces = getSharedTranslationNamespaces()
      expect(
        namespaces.some(
          (entry) => entry.namespace === CORE_TRANSLATION_NAMESPACE,
        ),
      ).toBe(true)
    })

    it('includes namespaces used by at least two application types', () => {
      const uiForms = getSharedTranslationNamespaces().find(
        (entry) => entry.namespace === 'uiForms.application',
      )
      expect(uiForms).toBeDefined()
      expect(uiForms?.usedByCount).toBeGreaterThanOrEqual(2)
    })

    it('excludes single-app namespaces', () => {
      const rentalAgreementNamespace = getSharedTranslationNamespaces().find(
        (entry) => entry.namespace === 'ra.application',
      )
      expect(rentalAgreementNamespace).toBeUndefined()
    })
  })

  describe('isSharedTranslationNamespace', () => {
    it('returns true for core and multi-app namespaces', () => {
      expect(isSharedTranslationNamespace(CORE_TRANSLATION_NAMESPACE)).toBe(
        true,
      )
      expect(isSharedTranslationNamespace('uiForms.application')).toBe(true)
    })

    it('returns false for single-app namespaces', () => {
      expect(isSharedTranslationNamespace('ra.application')).toBe(false)
    })
  })

  describe('getOwnedTranslationNamespaces', () => {
    it('drops shared namespaces used by housing benefits', () => {
      expect(
        getOwnedTranslationNamespaces([
          'hb.application',
          'uiForms.application',
        ]),
      ).toEqual(['hb.application'])
    })

    it('drops sia.application and uiForms.application for SIA templates', () => {
      expect(
        getOwnedTranslationNamespaces([
          'oap.application',
          'sia.application',
          'uiForms.application',
        ]),
      ).toEqual(['oap.application'])
    })

    it('keeps a single-app namespace', () => {
      expect(getOwnedTranslationNamespaces(['pa.application'])).toEqual([
        'pa.application',
      ])
    })

    it('falls back to the configured list when every namespace is shared', () => {
      expect(getOwnedTranslationNamespaces(['uiForms.application'])).toEqual([
        'uiForms.application',
      ])
    })
  })

  describe('isOwnedTranslationMessageId', () => {
    it('matches ids in owned namespaces only', () => {
      expect(
        isOwnedTranslationMessageId('hb.application:draft.title', [
          'hb.application',
        ]),
      ).toBe(true)
      expect(
        isOwnedTranslationMessageId(
          'uiForms.application:applicantInfo.labels.name',
          ['hb.application'],
        ),
      ).toBe(false)
    })
  })

  describe('filterOwnedTranslationDescriptors', () => {
    it('keeps application-namespace strings and drops shared ones', () => {
      const filtered = filterOwnedTranslationDescriptors(
        [
          { id: 'hb.application:draft.title' },
          { id: 'uiForms.application:applicantInfo.labels.name' },
          { id: 'application.system:button.next' },
        ],
        ['hb.application', 'uiForms.application'],
      )
      expect(filtered.map((descriptor) => descriptor.id)).toEqual([
        'hb.application:draft.title',
      ])
    })
  })

  describe('encodeTranslationNamespaceForUrlPath', () => {
    it('encodes dots in namespace for URL paths', () => {
      expect(encodeTranslationNamespaceForUrlPath('application.system')).toBe(
        'application%2Esystem',
      )
    })
  })
})
