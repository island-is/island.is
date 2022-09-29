import {
  ApiScope,
  Delegation,
  DelegationDTO,
  DelegationScope,
  DelegationType,
} from '@island.is/auth-api-lib'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeScopePermission,
  PersonalRepresentativeType,
} from '@island.is/auth-api-lib/personal-representative'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'
import { getModelToken } from '@nestjs/sequelize'
import subDays from 'date-fns/subDays'
import times from 'lodash/times'
import faker from 'faker'
import request from 'supertest'
import { setupWithAuth, defaultScopes } from '../../../../test/setup'
import { createDelegation } from '../../../../test/fixtures'

import {
  getFakeName,
  getFakeNationalId,
  NameIdTuple,
} from '../../../../test/stubs/genericStubs'
import {
  getPersonalRepresentativeRelationship,
  getPersonalRepresentativeRights,
  getPersonalRepresentativeRightType,
  getPRenabledApiScope,
  getScopePermission,
  personalRepresentativeType,
} from '../../../../test/stubs/personalRepresentativeStubs'
import { isDefined } from '@island.is/shared/utils'

describe('DelegationsController', () => {
  describe('Given a user is authenticated', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let apiScopeModel: typeof ApiScope
    let prScopePermission: typeof PersonalRepresentativeScopePermission
    let prModel: typeof PersonalRepresentative
    let prRightsModel: typeof PersonalRepresentativeRight
    let prRightTypeModel: typeof PersonalRepresentativeRightType
    let prTypeModel: typeof PersonalRepresentativeType
    let delegationModel: typeof Delegation
    let nationalRegistryApi: NationalRegistryClientService

    const userKennitala = getFakeNationalId()

    const user = createCurrentUser({
      nationalId: userKennitala,
      scope: [defaultScopes.testUserHasAccess.name],
    })

    beforeAll(async () => {
      app = await setupWithAuth({
        user,
      })
      server = request(app.getHttpServer())

      prTypeModel = app.get<typeof PersonalRepresentativeType>(
        getModelToken(PersonalRepresentativeType),
      )

      await prTypeModel.create(personalRepresentativeType)

      apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))
      prModel = app.get<typeof PersonalRepresentative>(
        getModelToken(PersonalRepresentative),
      )
      prRightsModel = app.get<typeof PersonalRepresentativeRight>(
        getModelToken(PersonalRepresentativeRight),
      )
      prRightTypeModel = app.get<typeof PersonalRepresentativeRightType>(
        getModelToken(PersonalRepresentativeRightType),
      )
      prScopePermission = app.get<typeof PersonalRepresentativeScopePermission>(
        getModelToken(PersonalRepresentativeScopePermission),
      )
      delegationModel = app.get<typeof Delegation>(getModelToken(Delegation))
      nationalRegistryApi = app.get(NationalRegistryClientService)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    describe('and given we have 3 valid, 1 not yet active and 1 outdate right types', () => {
      type rightsTypeStatus = 'valid' | 'unactivated' | 'outdated'
      type rightsType = [code: string, status: rightsTypeStatus]
      const rightsTypes: rightsType[] = [
        ['valid1', 'valid'],
        ['valid2', 'valid'],
        ['unactivated', 'unactivated'],
        ['outdated', 'outdated'],
      ]

      beforeAll(async () => {
        await prRightTypeModel.bulkCreate(
          rightsTypes.map(([code, status]) => {
            switch (status) {
              case 'valid':
                return getPersonalRepresentativeRightType(code)
              case 'unactivated':
                return getPersonalRepresentativeRightType(
                  code,
                  faker.date.soon(7),
                )
              case 'outdated':
                return getPersonalRepresentativeRightType(
                  code,
                  faker.date.recent(5),
                  faker.date.recent(),
                )
            }
          }),
        )
      })

      afterAll(async () => {
        await prRightTypeModel.destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
      })

      describe.each([
        [1, 0, 0, 2],
        [2, 0, 0, 1],
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [1, 1, 1, 0],
      ])(
        'and given user has %d active representees with valid rights, %d active representees with outdate rights and %d active representees with unactivated',
        (
          valid: number,
          outdated: number,
          unactivated: number,
          deceased: number,
        ) => {
          let nationalRegistryApiSpy: jest.SpyInstance
          const validRepresentedPersons: NameIdTuple[] = []
          const outdatedRepresentedPersons: NameIdTuple[] = []
          const unactivatedRepresentedPersons: NameIdTuple[] = []
          const deceasedNationalIds = times(deceased, () => getFakeNationalId())
          const today = new Date('2022-09-20')

          beforeAll(async () => {
            for (let i = 0; i < valid; i++) {
              const representedPerson: NameIdTuple = [
                getFakeName(),
                getFakeNationalId(),
              ]
              const relationship = getPersonalRepresentativeRelationship(
                userKennitala,
                representedPerson[1],
              )
              validRepresentedPersons.push(representedPerson)
              await prModel.create(relationship)
              await prRightsModel.create(
                getPersonalRepresentativeRights('valid1', relationship.id),
              )
            }

            for (let i = 0; i < outdated; i++) {
              const representedPerson: NameIdTuple = [
                getFakeName(),
                getFakeNationalId(),
              ]
              const relationship = getPersonalRepresentativeRelationship(
                userKennitala,
                representedPerson[1],
              )
              outdatedRepresentedPersons.push(representedPerson)
              await prModel.create(relationship)
              await prRightsModel.create(
                getPersonalRepresentativeRights('outdated', relationship.id),
              )
            }

            for (let i = 0; i < unactivated; i++) {
              const representedPerson: NameIdTuple = [
                getFakeName(),
                getFakeNationalId(),
              ]
              const relationship = getPersonalRepresentativeRelationship(
                userKennitala,
                representedPerson[1],
              )
              unactivatedRepresentedPersons.push(representedPerson)
              await prModel.create(relationship)
              await prRightsModel.create(
                getPersonalRepresentativeRights('unactivated', relationship.id),
              )
            }

            for (let i = 0; i < deceased; i++) {
              const representedPerson: NameIdTuple = [
                getFakeName(),
                deceasedNationalIds[i],
              ]
              const relationship = getPersonalRepresentativeRelationship(
                userKennitala,
                representedPerson[1],
              )

              await prModel.create(relationship)
              await prRightsModel.create(
                getPersonalRepresentativeRights('valid1', relationship.id),
              )
              // Create a delegation for the deceased person
              await delegationModel.create(
                createDelegation({
                  fromNationalId: deceasedNationalIds[i],
                  toNationalId: user.nationalId,
                  scopes: [defaultScopes.testUserHasAccess.name],
                  today,
                }),
                {
                  include: [{ model: DelegationScope, as: 'delegationScopes' }],
                },
              )
            }

            const nationalRegistryUsers = [
              ...validRepresentedPersons.map(([name, nationalId]) =>
                createNationalRegistryUser({ name, nationalId }),
              ),
              ...outdatedRepresentedPersons.map(([name, nationalId]) =>
                createNationalRegistryUser({ name, nationalId }),
              ),
              ...unactivatedRepresentedPersons.map(([name, nationalId]) =>
                createNationalRegistryUser({ name, nationalId }),
              ),
            ]

            nationalRegistryApiSpy = jest
              .spyOn(nationalRegistryApi, 'getIndividual')
              .mockImplementation((id) => {
                if (deceasedNationalIds.includes(id)) {
                  return Promise.resolve(null)
                }

                const user = nationalRegistryUsers.find(
                  (u) =>
                    u?.nationalId === id &&
                    // Make sure we don't return a user that has been marked as deceased
                    !deceasedNationalIds.includes(u?.nationalId),
                )

                return user ? Promise.resolve(user) : Promise.reject(null)
              })
          })

          afterEach(async () => {
            await delegationModel.destroy({
              where: {},
              cascade: true,
              truncate: true,
              force: true,
            })
          })

          afterAll(async () => {
            jest.clearAllMocks()
            await prRightsModel.destroy({
              where: {},
              cascade: true,
              truncate: true,
              force: true,
            })
            await prModel.destroy({
              where: {},
              cascade: true,
              truncate: true,
              force: true,
            })
          })

          describe('when user calls GET /delegations', () => {
            const path = '/delegations'
            let response: request.Response
            let body: DelegationDTO[]

            beforeAll(async () => {
              response = await server.get(path)
              body = response.body
            })

            it('should have a an OK return status', () => {
              expect(response.status).toEqual(200)
            })

            it(`should return ${valid} ${
              valid === 1 ? 'item' : 'items'
            } `, () => {
              expect(body).toHaveLength(valid)
            })

            it('should have the nationalId of the user as the representer', () => {
              expect(
                body.every((d) => d.toNationalId === userKennitala),
              ).toBeTruthy()
            })

            it('should only have the nationalId of the valid representees', () => {
              expect(body.map((d) => d.fromNationalId).sort()).toEqual(
                validRepresentedPersons.map(([_, id]) => id).sort(),
              )
            })

            it(`should only have ${
              valid === 1 ? 'name' : 'names'
            } of the valid represented ${
              valid === 1 ? 'person' : 'persons'
            }`, () => {
              expect(body.map((d) => d.fromName).sort()).toEqual(
                validRepresentedPersons.map(([name, _]) => name).sort(),
              )
            })

            it(`should have fetched the ${
              valid === 1 ? 'name' : 'names'
            }  of the valid represented ${
              valid === 1 ? 'person' : 'persons'
            } from nationalRegistryApi`, () => {
              expect(nationalRegistryApiSpy).toHaveBeenCalledTimes(
                valid * 2 + deceased * 2,
              )
            })

            it('should have the delegation type claims of PersonalRepresentative', () => {
              expect(
                body.every(
                  (d) => d.type === DelegationType.PersonalRepresentative,
                ),
              ).toBeTruthy()
            })

            it('should have updated delegation scopes field validTo to yesterday for deceased person link', async () => {
              // Arrange
              const delegationsModels = (
                await delegationModel.findAll({
                  include: [
                    {
                      model: DelegationScope,
                      as: 'delegationScopes',
                    },
                  ],
                })
              ).map((delegation) => delegation.toDTO())

              const allDelegationsScopes = delegationsModels
                ?.map((delegation) => delegation?.scopes)
                .filter(isDefined)
                .flat()

              // Assert
              allDelegationsScopes?.forEach((scope) => {
                expect(scope.validTo).toEqual(subDays(today, 1))
              })
            })
          })
        },
      )

      describe('and given we have a combination of scopes for personal representative', () => {
        type scopesType = [name: string, enabled: boolean, rightTypes: string[]]
        const scopes: scopesType[] = [
          ['scope/valid1', true, ['valid1']],
          ['scope/valid2', true, ['valid2']],
          ['scope/valid1and2', true, ['valid1', 'valid2']],
          ['scope/unactiveType', true, ['unactivated']],
          ['scope/outdated', true, ['outdated']],
          ['disabledScope', false, ['valid1']],
        ]

        beforeAll(async () => {
          await apiScopeModel.bulkCreate(
            scopes.map(([name, enabled, _]) =>
              getPRenabledApiScope(enabled, name),
            ),
          )
          await prScopePermission.bulkCreate(
            scopes.flatMap(([name, _, types]) =>
              types.map((rt) => getScopePermission(rt, name)),
            ),
          )
        })

        afterAll(async () => {
          await prScopePermission.destroy({
            where: {},
            cascade: true,
            truncate: true,
            force: true,
          })
          await apiScopeModel.destroy({
            where: {},
            cascade: true,
            truncate: true,
            force: true,
          })
        })

        describe.each([
          [['valid1'], ['scope/valid1', 'scope/valid1and2']],
          [['valid2'], ['scope/valid2', 'scope/valid1and2']],
          [
            ['valid1', 'valid2'],
            ['scope/valid1', 'scope/valid2', 'scope/valid1and2'],
          ],
          [[], []],
          [['unactivated'], []],
          [['outdated'], []],
        ])(
          'and given user is representing persons with rights %p',
          (rights, expected) => {
            const representeeKennitala = getFakeNationalId()

            beforeAll(async () => {
              const relationship = getPersonalRepresentativeRelationship(
                userKennitala,
                representeeKennitala,
              )

              await prModel.create(relationship)
              await prRightsModel.bulkCreate(
                rights.map((r) =>
                  getPersonalRepresentativeRights(r, relationship.id),
                ),
              )
            })

            afterAll(async () => {
              await prRightsModel.destroy({
                where: {},
                cascade: true,
                truncate: true,
                force: true,
              })
              await prModel.destroy({
                where: {},
                cascade: true,
                truncate: true,
                force: true,
              })
            })

            describe('when user calls GET /delegations/scopes', () => {
              const path = '/delegations/scopes'
              let response: request.Response
              let body: string[]

              beforeAll(async () => {
                response = await server.get(`${path}`).query({
                  fromNationalId: representeeKennitala,
                  delegationType: DelegationType.PersonalRepresentative,
                })
                body = response.body
              })

              it('should have a an OK return status', () => {
                expect(response.status).toEqual(200)
              })

              it(`should return ${
                expected.length === 0 ? 'no scopes' : JSON.stringify(expected)
              }`, () => {
                expect(body.sort()).toEqual(expected.sort())
              })
            })
          },
        )
      })
    })
  })
})
