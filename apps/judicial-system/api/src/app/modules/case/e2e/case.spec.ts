import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { setup } from '../../../../../test/setup'
import { CaseState, Case } from '../case.model'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Case', () => {
  it('POST /case should create a case', async () => {
    const data = {
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
      suspectName: 'Suspect Name',
      suspectAddress: 'Suspect Address',
      court: 'Court',
      arrestDate: '2020-09-08T08:00:00.000Z',
      requestedCourtDate: '2020-09-08T11:30:00.000Z',
    }

    await request(app.getHttpServer())
      .post('/api/case')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.id).toBeTruthy()
        expect(response.body.created).toBeTruthy()
        expect(response.body.modified).toBeTruthy()
        expect(response.body.state).toBe(CaseState.DRAFT)
        expect(response.body.policeCaseNumber).toBe(data.policeCaseNumber)
        expect(response.body.suspectNationalId).toBe(data.suspectNationalId)
        expect(response.body.suspectName).toBe(data.suspectName)
        expect(response.body.suspectAddress).toBe(data.suspectAddress)
        expect(response.body.court).toBe(data.court)
        expect(response.body.arrestDate).toBe(data.arrestDate)
        expect(response.body.requestedCourtDate).toBe(data.requestedCourtDate)

        // Check the data in the database
        await Case.findOne({ where: { id: response.body.id } }).then(
          (value) => {
            expect(value.id).toBe(response.body.id)
            expect(value.created.toISOString()).toBe(response.body.created)
            expect(value.modified.toISOString()).toBe(response.body.modified)
            expect(value.state).toBe(response.body.state)
            expect(value.policeCaseNumber).toBe(data.policeCaseNumber)
            expect(value.suspectNationalId).toBe(data.suspectNationalId)
            expect(value.suspectName).toBe(data.suspectName)
            expect(value.suspectAddress).toBe(data.suspectAddress)
            expect(value.court).toBe(data.court)
            expect(value.arrestDate.toISOString()).toBe(data.arrestDate)
            expect(value.requestedCourtDate.toISOString()).toBe(
              data.requestedCourtDate,
            )
          },
        )
      })
  })

  it('POST /case with required fields should create a case', async () => {
    const data = {
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
    }

    await request(app.getHttpServer())
      .post('/api/case')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.id).toBeTruthy()
        expect(response.body.created).toBeTruthy()
        expect(response.body.modified).toBeTruthy()
        expect(response.body.state).toBe(CaseState.DRAFT)
        expect(response.body.policeCaseNumber).toBe(data.policeCaseNumber)
        expect(response.body.suspectNationalId).toBe(data.suspectNationalId)
        expect(response.body.suspectName).toBeNull()
        expect(response.body.suspectAddress).toBeNull()
        expect(response.body.court).toBeNull()
        expect(response.body.arrestDate).toBeNull()
        expect(response.body.requestedCourtDate).toBeNull()

        // Check the data in the database
        await Case.findOne({ where: { id: response.body.id } }).then(
          (value) => {
            expect(value.id).toBe(response.body.id)
            expect(value.created.toISOString()).toBe(response.body.created)
            expect(value.modified.toISOString()).toBe(response.body.modified)
            expect(value.state).toBe(response.body.state)
            expect(value.policeCaseNumber).toBe(data.policeCaseNumber)
            expect(value.suspectNationalId).toBe(data.suspectNationalId)
            expect(value.suspectName).toBeNull()
            expect(value.suspectAddress).toBeNull()
            expect(value.court).toBeNull()
            expect(value.arrestDate).toBeNull()
            expect(value.requestedCourtDate).toBeNull()
          },
        )
      })
  })

  it('GET /case/:id should get a case by id', async () => {
    await Case.create({
      state: CaseState.SUBMITTED,
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
      suspectName: 'Suspect Name',
      suspectAddress: 'Suspect Address',
      court: 'Court',
      arrestDate: '2020-09-08T08:00:00.000Z',
      requestedCourtDate: '2020-09-08T11:30:00.000Z',
    }).then(async (value) => {
      await request(app.getHttpServer())
        .get(`/api/case/${value.id}`)
        .send()
        .expect(200)
        .then((response) => {
          // Check the response
          expect(response.body.id).toBe(value.id)
          expect(response.body.created).toBe(value.created.toISOString())
          expect(response.body.modified).toBe(value.modified.toISOString())
          expect(response.body.state).toBe(value.state)
          expect(response.body.policeCaseNumber).toBe(value.policeCaseNumber)
          expect(response.body.suspectNationalId).toBe(value.suspectNationalId)
          expect(response.body.suspectName).toBe(value.suspectName)
          expect(response.body.suspectAddress).toBe(value.suspectAddress)
          expect(response.body.court).toBe(value.court)
          expect(response.body.arrestDate).toBe(value.arrestDate.toISOString())
          expect(response.body.requestedCourtDate).toBe(
            value.requestedCourtDate.toISOString(),
          )
        })
    })
  })

  it('PUT /case/:id should update a case by id', async () => {
    await Case.create({
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
    }).then(async (value) => {
      const data = {
        state: CaseState.ACTIVE,
        policeCaseNumber: 'New Case Number',
        suspectNationalId: '0101010009',
        suspectName: 'Suspect Name',
        suspectAddress: 'Suspect Address',
        court: 'Court',
        arrestDate: '2020-09-08T08:00:00.000Z',
        requestedCourtDate: '2020-09-08T11:30:00.000Z',
      }

      await request(app.getHttpServer())
        .put(`/api/case/${value.id}`)
        .send(data)
        .expect(200)
        .then(async (response) => {
          // Check the response
          expect(response.body.id).toBe(value.id)
          expect(response.body.created).toBe(value.created.toISOString())
          expect(response.body.modified).not.toBe(value.modified.toISOString())
          expect(response.body.state).toBe(data.state)
          expect(response.body.policeCaseNumber).toBe(data.policeCaseNumber)
          expect(response.body.suspectNationalId).toBe(data.suspectNationalId)
          expect(response.body.suspectName).toBe(data.suspectName)
          expect(response.body.suspectAddress).toBe(data.suspectAddress)
          expect(response.body.court).toBe(data.court)
          expect(response.body.arrestDate).toBe(data.arrestDate)
          expect(response.body.requestedCourtDate).toBe(data.requestedCourtDate)

          // Check the data in the database
          await Case.findOne({ where: { id: response.body.id } }).then(
            (newValue) => {
              expect(newValue.id).toBe(value.id)
              expect(newValue.created).toStrictEqual(value.created)
              expect(newValue.modified.toISOString()).toBe(
                response.body.modified,
              )
              expect(newValue.state).toBe(data.state)
              expect(newValue.policeCaseNumber).toBe(data.policeCaseNumber)
              expect(newValue.suspectNationalId).toBe(data.suspectNationalId)
              expect(newValue.suspectName).toBe(data.suspectName)
              expect(newValue.suspectAddress).toBe(data.suspectAddress)
              expect(newValue.court).toBe(data.court)
              expect(newValue.arrestDate.toISOString()).toBe(data.arrestDate)
              expect(newValue.requestedCourtDate.toISOString()).toBe(
                data.requestedCourtDate,
              )
            },
          )
        })
    })
  })
})
