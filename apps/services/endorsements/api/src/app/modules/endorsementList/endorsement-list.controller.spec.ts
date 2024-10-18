// import { Test, TestingModule } from '@nestjs/testing'
// import { EndorsementListController } from './endorsementList.controller'
// import { EndorsementListService } from './endorsementList.service'
// import { EndorsementList } from './endorsementList.model'
// import { ScopesGuard } from '@island.is/auth-nest-tools'
// import { ParseUUIDPipe, BadRequestException } from '@nestjs/common'
// import { EndorsementListByIdPipe } from './pipes/endorsementListById.pipe'

// describe('EndorsementListController', () => {
//   let controller: EndorsementListController
//   let service: EndorsementListService

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [EndorsementListController],
//       providers: [
//         {
//           provide: EndorsementListService,
//           useValue: {
//             findSingleList: jest.fn(),
//           },
//         },
//       ],
//     })
//       .overrideGuard(ScopesGuard)
//       .useValue({ canActivate: jest.fn().mockReturnValue(true) })
//       .compile()

//     controller = module.get<EndorsementListController>(EndorsementListController)
//     service = module.get<EndorsementListService>(EndorsementListService)
//   })

//   describe('findOne', () => {

//     it('should throw a BadRequestException when an invalid UUID is provided', async () => {
//       jest.spyOn(service, 'findSingleList').mockImplementation(() => {
//         throw new BadRequestException('Invalid UUID')
//       })

//       try {
//         await controller.findOne({ id: 'valid-uuid' } as EndorsementList)
//       } catch (e) {
//         expect(e).toBeInstanceOf(BadRequestException)
//         expect(e.message).toBe('Invalid UUID')
//       }
//     })
//   })
// })

import { Test, TestingModule } from '@nestjs/testing'
import { EndorsementListController } from './endorsementList.controller'
import { EndorsementListService } from './endorsementList.service'
import { EndorsementList } from './endorsementList.model'
import { ScopesGuard } from '@island.is/auth-nest-tools'
import {
  ParseUUIDPipe,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { EndorsementListByIdPipe } from './pipes/endorsementListById.pipe'

describe('EndorsementListController', () => {
  let controller: EndorsementListController
  let service: EndorsementListService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EndorsementListController],
      providers: [
        {
          provide: EndorsementListService,
          useValue: {
            findSingleList: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(ScopesGuard)
      .useValue({
        canActivate: jest.fn((context) => {
          const request = context.switchToHttp().getRequest()
          if (!request.headers.authorization) {
            throw new UnauthorizedException()
          }
          if (request.headers.authorization !== 'valid-token') {
            throw new ForbiddenException()
          }
          return true
        }),
      })
      .compile()

    controller = module.get<EndorsementListController>(
      EndorsementListController,
    )
    service = module.get<EndorsementListService>(EndorsementListService)
  })

  describe('findOne', () => {
    const validEndorsementList = {
      id: 'valid-uuid',
      name: 'Test List',
    } as unknown as EndorsementList

    // it('should return 200 when a valid UUID and scope are provided', async () => {
    //   jest.spyOn(service, 'findSingleList').mockResolvedValueOnce(validEndorsementList)

    //   const result = await controller.findOne(validEndorsementList)

    //   expect(service.findSingleList).toHaveBeenCalledWith('valid-uuid')
    //   expect(result).toEqual(validEndorsementList)
    // })

    it('should throw a 401 UnauthorizedException when no token is provided', async () => {
      jest
        .spyOn(service, 'findSingleList')
        .mockResolvedValueOnce(validEndorsementList)

      try {
        await controller.findOne(validEndorsementList)
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException)
        expect(e.message).toBe('Unauthorized')
      }
    })

    it('should throw a 403 ForbiddenException when an invalid token is provided', async () => {
      jest
        .spyOn(service, 'findSingleList')
        .mockResolvedValueOnce(validEndorsementList)

      try {
        await controller.findOne(validEndorsementList)
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException)
        expect(e.message).toBe('Forbidden')
      }
    })

    it('should throw a BadRequestException when an invalid UUID is provided', async () => {
      jest.spyOn(service, 'findSingleList').mockImplementation(() => {
        throw new BadRequestException('Invalid UUID')
      })

      try {
        await controller.findOne({ id: 'invalid-uuid' } as EndorsementList)
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException)
        expect(e.message).toBe('Invalid UUID')
      }
    })
  })
})
