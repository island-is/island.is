import type { Logger } from '@island.is/logging'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { SamgongustofaService } from '../samgongustofa.service'
import { HttpModule, HttpService } from '@nestjs/axios'
import { RecyclingRequestService } from '../../../recycling.request/recycling.request.service'
import { AxiosResponse } from 'axios'
import { of } from 'rxjs'
import { MockData } from './mock-data'

/*global document, window, alert, console, require*/

const recyclingRequestModel = {
  id: '1234',
  vehicleId: 'ZUG18',
  recyclingPartnerId: '1',
  recyclingParter: {},
  requestType: '',
  nameOfRequestor: '',
  createdAt: new Date('2021-10-05T14:48:00.000Z'),
  updatedAt: new Date('2021-10-05T14:48:00.000Z'),
}

const getAllVehilceResp: AxiosResponse = {
  data: MockData.allVehiclesForPersidnoResponse,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
}
const getBasicVehicleResp: AxiosResponse = {
  data: MockData.basicVehicleInformationResponse,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
}

describe('skilavottordApiTest', () => {
  it('should work', () => {
    expect(SamgongustofaService.test()).toEqual('test')
  })
  describe('getVehicleInformationTest', () => {
    let recyclingRequestService: RecyclingRequestService
    let samgongustofaService: SamgongustofaService
    let httpService: HttpService

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [HttpModule],
        providers: [
          SamgongustofaService,
          // {
          //   provide: LOGGER_PROVIDER,
          //   useClass: jest.fn(() => ({
          //     error: () => ({}),
          //     info: () => ({}),
          //     debug: () => ({}),
          //   })),
          // },
          {
            provide: LOGGER_PROVIDER,
            useValue: logger,
          },
          {
            provide: RecyclingRequestService,
            useClass: jest.fn(() => ({
              findAllWithPermno: () => ({}),
            })),
          },
        ],
      }).compile()
      samgongustofaService = moduleRef.get<SamgongustofaService>(
        SamgongustofaService,
      )
      recyclingRequestService = moduleRef.get<RecyclingRequestService>(
        RecyclingRequestService,
      )
      httpService = moduleRef.get<HttpService>(HttpService)
    })

    describe('samgongustofaGetVehicleInformation', () => {
      it('get vehicle info', async () => {
        const kennitala = '1111111111'
        const httpServiceSpy = jest
          .spyOn(httpService, 'post')
          .mockImplementationOnce(() => of(getAllVehilceResp))
          .mockImplementationOnce(() => of(getBasicVehicleResp))
        jest
          .spyOn(recyclingRequestService as any, 'findAllWithPermno')
          .mockImplementation(() => Promise.resolve(recyclingRequestModel))
        const checkVehileResp = await samgongustofaService.getVehicleInformation(
          kennitala,
        )
        expect(checkVehileResp[0].permno).toBe('BAT01')
      })
    })
  })
})
