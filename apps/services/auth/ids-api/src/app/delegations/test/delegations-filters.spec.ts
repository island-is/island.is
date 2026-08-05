import { Type } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/sequelize'
import faker from 'faker'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'

import {
  MergedDelegationDTO,
  NationalRegistryV3FeatureService,
  PersonalRepresentativeDelegationType,
} from '@island.is/auth-api-lib'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import {
  createNationalId,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { TestApp, truncate } from '@island.is/testing/nest'

import {
  nonExistingLegalRepresentativeNationalId,
  setupWithAuth,
} from '../../../../test/setup'
import { testCases } from './delegations-filters-test-cases'
import { user } from './delegations-filters-types'

describe('DelegationsController', () => {
  describe.each([false, true])(
    'national registry v3 featureflag: %s',
    (featureFlag) => {
      let sequelize: Sequelize
      let app: TestApp
      let server: request.SuperTest<request.Test>
      let factory: FixtureFactory
      let nationalRegistryApi: NationalRegistryClientService
      let nationalRegistryV3Api: NationalRegistryV3ClientService
      let rskApi: RskRelationshipsClient
      beforeAll(async () => {
        app = await setupWithAuth({
          user: user,
        })
        sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

        server = request(app.getHttpServer())

        nationalRegistryApi = app.get(NationalRegistryClientService)
        jest
          .spyOn(nationalRegistryApi, 'getIndividual')
          .mockImplementation(async (nationalId: string) =>
            createNationalRegistryUser({
              nationalId,
              name: faker.name.findName(),
            }),
          )
        nationalRegistryV3Api = app.get(NationalRegistryV3ClientService)
        jest
          .spyOn(nationalRegistryV3Api, 'getAllDataIndividual')
          .mockImplementation(async (nationalId: string) => {
            const user = createNationalRegistryUser({
              nationalId: nationalId,
            })

            return { kennitala: user.nationalId, nafn: user.name }
          })
        rskApi = app.get(RskRelationshipsClient)

        const nationalRegistryV3FeatureService = app.get(
          NationalRegistryV3FeatureService,
        )
        jest
          .spyOn(nationalRegistryV3FeatureService, 'getValue')
          .mockImplementation(async () => featureFlag)

        // Ward delegations are gated by their own flag; tie it to the same
        // parametrized value so both the v2 and v3 code paths are covered.
        const featureFlagService = app.get(FeatureFlagService)
        const getValueOriginal =
          featureFlagService.getValue.bind(featureFlagService)
        jest
          .spyOn(featureFlagService, 'getValue')
          .mockImplementation((feature, ...args) =>
            feature === Features.isDelegationIncomingWardV3Enabled
              ? Promise.resolve(featureFlag)
              : getValueOriginal(feature, ...args),
          )

        factory = new FixtureFactory(app)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      describe.each(Object.keys(testCases))(
        'Delegation filtering with test case: %s',
        (caseName) => {
          const testCase = testCases[caseName]
          testCase.user = user
          const path = '/v2/delegations'

          beforeAll(async () => {
            await truncate(sequelize)

            await Promise.all(
              testCase.domains.map((domain) => factory.createDomain(domain)),
            )

            await factory.createClient(testCase.client)

            await Promise.all(
              testCase.clientAllowedScopes.map((scope) =>
                factory.createClientAllowedScope(scope),
              ),
            )

            await Promise.all(
              testCase.apiScopes.map((scope) => factory.createApiScope(scope)),
            )

            await Promise.all(
              testCase.apiScopeUserAccess.map((access) =>
                factory.createApiScopeUserAccess(access),
              ),
            )

            await Promise.all(
              testCase.customDelegations.map((delegation) =>
                factory.createCustomDelegation(delegation),
              ),
            )

            await Promise.all(
              testCase.fromLegalRepresentative.map((nationalId) =>
                factory.createDelegationIndexRecord({
                  fromNationalId: nationalId,
                  toNationalId: testCase.user.nationalId,
                  type: AuthDelegationType.LegalRepresentative,
                  provider:
                    AuthDelegationProvider.DistrictCommissionersRegistry,
                }),
              ),
            )

            jest
              .spyOn(nationalRegistryApi, 'getCustodyChildren')
              .mockImplementation(async () => testCase.fromChildren)

            jest
              .spyOn(nationalRegistryV3Api, 'getAllDataIndividual')
              .mockImplementation(async (nationalId: string) => {
                // Parent lookup returns the custody children via Midlun's forsja.born
                if (nationalId === testCase.user.nationalId) {
                  return {
                    kennitala: nationalId,
                    forsja: {
                      born: testCase.fromChildren.map((childId) => ({
                        barnKennitala: childId,
                        barnNafn: faker.name.findName(),
                      })),
                    },
                  }
                }

                // Per-child lookup returns that child's individual record
                return { kennitala: nationalId, nafn: faker.name.findName() }
              })

            jest
              .spyOn(rskApi, 'getIndividualRelationships')
              .mockImplementation(async () => testCase.procuration)
          })

          let res: request.Response

          it(`GET ${path} returns correct filtered delegations`, async () => {
            res = await server.get(path)

            expect(res.status).toEqual(200)
            expect(res.body).toHaveLength(testCase.expectedFrom.length)
            expect(
              res.body.map((d: MergedDelegationDTO) => d.fromNationalId).sort(),
            ).toEqual(testCase.expectedFrom.sort())
            if (testCase.expectedTypes) {
              expect(res.body[0].types.sort()).toEqual(
                testCase.expectedTypes.sort(),
              )
            }
          })
        },
      )

      describe('verify', () => {
        const testCase = testCases['legalRepresentative1']
        testCase.user = user
        const path = '/v1/delegations/verify'
        const fromPersonalRepresentative = createNationalId('person')

        beforeAll(async () => {
          await truncate(sequelize)

          await Promise.all(
            testCase.domains.map((domain) => factory.createDomain(domain)),
          )

          await factory.createClient(testCase.client)

          await Promise.all(
            testCase.clientAllowedScopes.map((scope) =>
              factory.createClientAllowedScope(scope),
            ),
          )

          await Promise.all(
            testCase.apiScopes.map((scope) => factory.createApiScope(scope)),
          )

          await factory.createDelegationIndexRecord({
            fromNationalId: nonExistingLegalRepresentativeNationalId,
            toNationalId: testCase.user.nationalId,
            type: AuthDelegationType.LegalRepresentative,
            provider: AuthDelegationProvider.DistrictCommissionersRegistry,
          })

          await factory.createDelegationType({
            id: PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
            providerId: AuthDelegationProvider.DistrictCommissionersRegistry,
          })

          await factory.createDelegationIndexRecord({
            fromNationalId: fromPersonalRepresentative,
            toNationalId: testCase.user.nationalId,
            type: PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
            provider: AuthDelegationProvider.DistrictCommissionersRegistry,
          })
        })

        let res: request.Response
        it(`POST ${path} returns verified response`, async () => {
          res = await server.post(path).send({
            fromNationalId: testCase.fromLegalRepresentative[0],
            delegationTypes: [AuthDelegationType.LegalRepresentative],
          })

          expect(res.status).toEqual(200)
          expect(res.body.verified).toEqual(true)
        })

        it(`POST ${path} returns non-verified response`, async () => {
          res = await server.post(path).send({
            fromNationalId: nonExistingLegalRepresentativeNationalId,
            delegationTypes: [AuthDelegationType.LegalRepresentative],
          })

          expect(res.status).toEqual(200)
          expect(res.body.verified).toEqual(false)
        })

        it(`POST ${path} returns verified response for compound personal representative delegation type`, async () => {
          res = await server.post(path).send({
            fromNationalId: fromPersonalRepresentative,
            delegationTypes: [
              PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
            ],
          })

          expect(res.status).toEqual(200)
          expect(res.body.verified).toEqual(true)
        })

        it(`POST ${path} returns non-verified response for compound personal representative delegation type`, async () => {
          res = await server.post(path).send({
            fromNationalId: nonExistingLegalRepresentativeNationalId,
            delegationTypes: [
              PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
            ],
          })

          expect(res.status).toEqual(200)
          expect(res.body.verified).toEqual(false)
        })
      })
    },
  )
})
