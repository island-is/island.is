import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'

import {
  AuthDelegationType,
  DelegationDTO,
  MeDelegationsApi,
  MeDelegationsControllerFindAllDirectionEnum,
  MeDelegationsControllerFindAllValidityEnum,
} from '@island.is/clients/auth/delegation-api'

import { MeDelegationsService } from './meDelegations.service'
import { CreateDelegationsInput } from '../dto'

const mockDelegationsApi = {
  withMiddleware: jest.fn(),
  meDelegationsControllerFindAll: jest.fn(),
  meDelegationsControllerFindOneRaw: jest.fn(),
  meDelegationsControllerCreate: jest.fn(),
  meDelegationsControllerPatch: jest.fn(),
  meDelegationsControllerDelete: jest.fn(),
}

const mockUser = {
  nationalId: '0101302399',
  scope: [],
  client: 'test-client',
  authorization: 'Bearer token',
  actor: undefined,
} as any

const tomorrow = addDays(startOfDay(new Date()), 1)
const nextWeek = addDays(startOfDay(new Date()), 7)
const nextMonth = addDays(startOfDay(new Date()), 30)

const makeDelegation = (
  overrides: Partial<DelegationDTO> = {},
): DelegationDTO =>
  ({
    id: 'del-1',
    fromNationalId: '0101302399',
    fromName: 'From Person',
    toNationalId: '1234567890',
    toName: 'To Person',
    type: AuthDelegationType.Custom,
    domainName: '@test.is',
    scopes: [
      {
        id: 'scope-1',
        scopeName: '@test.is/read',
        displayName: 'Read access',
        delegationId: 'del-1',
        validFrom: tomorrow,
        validTo: nextWeek,
      },
    ],
    ...overrides,
  } as DelegationDTO)

describe('MeDelegationsService', () => {
  let service: MeDelegationsService

  beforeEach(() => {
    jest.resetAllMocks()
    // Restore withMiddleware to return the mock itself
    mockDelegationsApi.withMiddleware.mockReturnThis()
    // Default FindOneRaw: 204 No Content
    mockDelegationsApi.meDelegationsControllerFindOneRaw.mockResolvedValue({
      raw: { status: 204 },
      value: jest.fn().mockResolvedValue(null),
    })
    service = new MeDelegationsService(
      mockDelegationsApi as unknown as MeDelegationsApi,
    )
  })

  describe('createOrUpdateDelegations', () => {
    it('creates delegations for each toNationalId and domain combination', async () => {
      const toNationalId1 = '1234567890'
      const toNationalId2 = '0987654321'
      const input: CreateDelegationsInput = {
        toNationalIds: [toNationalId1, toNationalId2],
        scopes: [
          { name: '@test.is/read', domainName: '@test.is', validTo: nextWeek },
          {
            name: '@other.is/write',
            domainName: '@other.is',
            validTo: nextMonth,
          },
        ],
      }

      const delegation1 = makeDelegation({
        toNationalId: toNationalId1,
        domainName: '@test.is',
      })
      const delegation2 = makeDelegation({
        toNationalId: toNationalId1,
        domainName: '@other.is',
      })
      const delegation3 = makeDelegation({
        toNationalId: toNationalId2,
        domainName: '@test.is',
      })
      const delegation4 = makeDelegation({
        toNationalId: toNationalId2,
        domainName: '@other.is',
      })

      // No existing delegations, so all will be created
      mockDelegationsApi.meDelegationsControllerFindAll.mockResolvedValue([])
      mockDelegationsApi.meDelegationsControllerCreate
        .mockResolvedValueOnce(delegation1)
        .mockResolvedValueOnce(delegation2)
        .mockResolvedValueOnce(delegation3)
        .mockResolvedValueOnce(delegation4)

      // Act
      const result = await service.createOrUpdateDelegations(mockUser, input)

      // Assert: one create call per (toNationalId, domain) pair = 2 * 2 = 4
      expect(
        mockDelegationsApi.meDelegationsControllerCreate,
      ).toHaveBeenCalledTimes(4)
      expect(result).toHaveLength(4)
    })

    it('updates existing delegations instead of creating new ones', async () => {
      const toNationalId = '1234567890'
      const existingDelegation = makeDelegation({
        id: 'existing-del',
        toNationalId,
        domainName: '@test.is',
        scopes: [
          {
            id: 'old-scope',
            scopeName: '@test.is/read',
            displayName: 'Read',
            delegationId: 'existing-del',
            validFrom: tomorrow,
            validTo: nextWeek,
          },
        ],
      })
      const input: CreateDelegationsInput = {
        toNationalIds: [toNationalId],
        scopes: [
          {
            name: '@test.is/write',
            domainName: '@test.is',
            validTo: nextMonth,
          },
        ],
      }

      // getDelegationByOtherUser resolves with existing delegation
      mockDelegationsApi.meDelegationsControllerFindAll.mockResolvedValue([
        existingDelegation,
      ])

      // getDelegationById (called inside updateDelegation) resolves via FindOneRaw
      mockDelegationsApi.meDelegationsControllerFindOneRaw.mockResolvedValue({
        raw: { status: 200 },
        value: jest.fn().mockResolvedValue(existingDelegation),
      })

      const patchedDelegation = makeDelegation({
        id: 'existing-del',
        toNationalId,
      })
      mockDelegationsApi.meDelegationsControllerPatch.mockResolvedValue(
        patchedDelegation,
      )

      // Act
      const result = await service.createOrUpdateDelegations(mockUser, input)

      // Assert: patch called instead of create
      expect(
        mockDelegationsApi.meDelegationsControllerCreate,
      ).not.toHaveBeenCalled()
      expect(
        mockDelegationsApi.meDelegationsControllerPatch,
      ).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(1)
    })
  })

  describe('getDelegationsGroupedByIdentity', () => {
    it('groups outgoing delegations by toNationalId', async () => {
      const toNationalId1 = '1234567890'
      const toNationalId2 = '0987654321'

      const delegations: DelegationDTO[] = [
        makeDelegation({
          id: 'del-1',
          toNationalId: toNationalId1,
          toName: 'Person One',
          domainName: '@domain1.is',
          type: AuthDelegationType.Custom,
          scopes: [
            {
              id: 's1',
              scopeName: '@domain1.is/read',
              displayName: 'Read',
              delegationId: 'del-1',
              validFrom: tomorrow,
              validTo: nextWeek,
            },
          ],
        }),
        makeDelegation({
          id: 'del-2',
          toNationalId: toNationalId1,
          toName: 'Person One',
          domainName: '@domain2.is',
          type: AuthDelegationType.Custom,
          scopes: [
            {
              id: 's2',
              scopeName: '@domain2.is/write',
              displayName: 'Write',
              delegationId: 'del-2',
              validFrom: tomorrow,
              validTo: nextMonth,
            },
          ],
        }),
        makeDelegation({
          id: 'del-3',
          toNationalId: toNationalId2,
          toName: 'Person Two',
          domainName: '@domain1.is',
          type: AuthDelegationType.Custom,
          scopes: [
            {
              id: 's3',
              scopeName: '@domain1.is/read',
              displayName: 'Read',
              delegationId: 'del-3',
              validFrom: tomorrow,
              validTo: nextWeek,
            },
          ],
        }),
      ]

      mockDelegationsApi.meDelegationsControllerFindAll.mockResolvedValue(
        delegations,
      )

      // Act
      const result = await service.getDelegationsGroupedByIdentity(mockUser, {
        direction: MeDelegationsControllerFindAllDirectionEnum.outgoing,
      })

      // Assert
      expect(result).toHaveLength(2)
      expect(
        mockDelegationsApi.meDelegationsControllerFindAll,
      ).toHaveBeenCalledWith({
        direction: MeDelegationsControllerFindAllDirectionEnum.outgoing,
        validity: MeDelegationsControllerFindAllValidityEnum.includeFuture,
      })

      const group1 = result.find((g) => g.nationalId === toNationalId1)
      expect(group1).toBeDefined()
      expect(group1!.name).toBe('Person One')
      expect(group1!.totalScopeCount).toBe(2)
      expect(group1!.scopes).toHaveLength(2)
      // Earliest validFrom across both scopes
      expect(group1!.earliestValidFrom).toEqual(tomorrow)
      // Latest validTo across both scopes
      expect(group1!.latestValidTo).toEqual(nextMonth)

      const group2 = result.find((g) => g.nationalId === toNationalId2)
      expect(group2).toBeDefined()
      expect(group2!.totalScopeCount).toBe(1)
    })

    it('groups incoming delegations by fromNationalId', async () => {
      const fromNationalId = '1111111119'

      const delegation = makeDelegation({
        id: 'del-in-1',
        fromNationalId,
        fromName: 'Grantor',
        toNationalId: mockUser.nationalId,
        domainName: '@test.is',
        type: AuthDelegationType.Custom,
        scopes: [
          {
            id: 'si1',
            scopeName: '@test.is/read',
            displayName: 'Read',
            delegationId: 'del-in-1',
            validFrom: tomorrow,
            validTo: nextWeek,
          },
        ],
      })

      mockDelegationsApi.meDelegationsControllerFindAll.mockResolvedValue([
        delegation,
      ])

      // Act
      const result = await service.getDelegationsGroupedByIdentity(mockUser, {
        direction: MeDelegationsControllerFindAllDirectionEnum.incoming,
      })

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].nationalId).toBe(fromNationalId)
      expect(result[0].name).toBe('Grantor')
      expect(result[0].totalScopeCount).toBe(1)
    })

    it('returns empty array when there are no delegations', async () => {
      mockDelegationsApi.meDelegationsControllerFindAll.mockResolvedValue([])

      const result = await service.getDelegationsGroupedByIdentity(mockUser, {
        direction: MeDelegationsControllerFindAllDirectionEnum.outgoing,
      })

      expect(result).toEqual([])
    })

    it('excludes expired scopes when grouping', async () => {
      const yesterday = addDays(startOfDay(new Date()), -1)
      const toNationalId = '1234567890'

      const delegation = makeDelegation({
        id: 'del-expired',
        toNationalId,
        domainName: '@test.is',
        type: AuthDelegationType.Custom,
        scopes: [
          {
            id: 'expired-scope',
            scopeName: '@test.is/read',
            displayName: 'Read',
            delegationId: 'del-expired',
            validFrom: addDays(yesterday, -10),
            validTo: yesterday,
          },
        ],
      })

      mockDelegationsApi.meDelegationsControllerFindAll.mockResolvedValue([
        delegation,
      ])

      const result = await service.getDelegationsGroupedByIdentity(mockUser, {
        direction: MeDelegationsControllerFindAllDirectionEnum.outgoing,
      })

      // The delegation group may exist but with 0 scopes since includeDomainNameInScopes filters expired ones
      const group = result.find((g) => g.nationalId === toNationalId)
      if (group) {
        expect(group.totalScopeCount).toBe(0)
        expect(group.scopes).toHaveLength(0)
      } else {
        // Group may not exist at all if it has no valid scopes
        expect(result).toHaveLength(0)
      }
    })
  })
})
