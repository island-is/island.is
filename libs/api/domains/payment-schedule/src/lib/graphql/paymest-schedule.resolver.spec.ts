import { User } from '@island.is/auth-nest-tools'
import { DefaultApi, ScheduleType } from '@island.is/clients/payment-schedule'
import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PaymentScheduleService } from '../payment-schedule.service'
import { PaymentScheduleResolver } from './payment-schedule.resolver'

describe('PaymentScheduleResolver', () => {
  let resolver: PaymentScheduleResolver
  const mockDate = new Date()
  const mockedUser: User = {
    nationalId: '1234567890',
    client: '',
    authorization: '',
    scope: [],
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentScheduleResolver,
        {
          provide: PaymentScheduleService,
          useFactory: () => ({
            getConditions: jest.fn((nationalId: string) => ({
              maxDebtAmount: 100000,
              totalDebtAmount: 10000,
              minPayment: 0,
              maxPayment: 50000,
              collectionActions: true,
              doNotOwe: false,
              maxDebt: false,
              oweTaxes: false,
              disposableIncome: 30000,
              taxReturns: false,
              vatReturns: false,
              citReturns: false,
              accommodationTaxReturns: false,
              withholdingTaxReturns: false,
              wageReturns: false,
              alimony: 12000,
            })),
            getDebts: jest.fn((nationalId: string) => [
              {
                nationalId: nationalId,
                type: 'SR',
                paymentSchedule: 'string',
                organization: 'string',
                explanation: 'string',
                totalAmount: 1234,
                chargeType: [
                  {
                    id: 'AB',
                    name: 'string',
                    principal: 1000,
                    intrest: 5000,
                    expenses: 2000,
                    total: 1000,
                  },
                ],
              },
            ]),
            getCurrentEmployer: jest.fn((nationalId: string) => ({
              employerNationalId: '0987654321',
              employerName: 'island.is',
            })),
            getInitalSchedule: jest.fn(
              (
                nationalId: string,
                totalAmount: number,
                disposableIncome: number,
                type: ScheduleType,
              ) => ({
                nationalId: '1234567890',
                scheduleType: ScheduleType.FinesAndLegalCost,
                minPayment: 0,
                maxPayment: 10000,
                minCountMonth: 1,
                maxCountMonth: 12,
              }),
            ),
            getPaymentDistribution: jest.fn((nationalId: string) => ({
              nationalId: '1234567890',
              scheduleType: ScheduleType.FinesAndLegalCost,
              payments: [
                {
                  dueDate: mockDate,
                  payment: 0,
                  accumulated: 1,
                },
              ],
            })),
          }),
        },
        DefaultApi,
        Logger,
      ],
    }).compile()

    resolver = module.get<PaymentScheduleResolver>(PaymentScheduleResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('conditions', () => {
    it('should get conditions', async () => {
      const conditions = await resolver.conditions(mockedUser)
      expect(conditions).toEqual({
        maxDebtAmount: 100000,
        totalDebtAmount: 10000,
        minPayment: 0,
        maxPayment: 50000,
        collectionActions: true,
        doNotOwe: false,
        maxDebt: false,
        oweTaxes: false,
        disposableIncome: 30000,
        taxReturns: false,
        vatReturns: false,
        citReturns: false,
        accommodationTaxReturns: false,
        withholdingTaxReturns: false,
        wageReturns: false,
        alimony: 12000,
      })
    })
  })

  describe('debts', () => {
    it('should get debs', async () => {
      const debts = await resolver.debts(mockedUser)
      expect(debts).toEqual([
        {
          nationalId: mockedUser.nationalId,
          type: ScheduleType.FinesAndLegalCost,
          paymentSchedule: 'string',
          organization: 'string',
          explanation: 'string',
          totalAmount: 1234,
          chargeType: [
            {
              id: 'AB',
              name: 'string',
              principal: 1000,
              intrest: 5000,
              expenses: 2000,
              total: 1000,
            },
          ],
        },
      ])
    })
  })

  describe('employer', () => {
    it('should get employer', async () => {
      const employer = await resolver.employer(mockedUser)
      expect(employer).toEqual({
        employerName: 'island.is',
        employerNationalId: '0987654321',
      })
    })
  })

  describe('intitialSchedule', () => {
    it('should get intitialSchedule', async () => {
      const intitialSchedule = await resolver.intitialSchedule(mockedUser, {
        totalAmount: 10000,
        disposableIncome: 1000,
        type: ScheduleType.FinesAndLegalCost,
      })
      expect(intitialSchedule).toEqual({
        nationalId: '1234567890',
        scheduleType: ScheduleType.FinesAndLegalCost,
        minPayment: 0,
        maxPayment: 10000,
        minCountMonth: 1,
        maxCountMonth: 12,
      })
    })
  })

  describe('distribution', () => {
    it('should get distribution', async () => {
      const distribution = await resolver.distribution(mockedUser, {
        totalAmount: 10000,
        monthAmount: 1000,
        monthCount: 1,
        scheduleType: ScheduleType.FinesAndLegalCost,
      })
      expect(distribution).toEqual({
        nationalId: '1234567890',
        scheduleType: ScheduleType.FinesAndLegalCost,
        payments: [
          {
            dueDate: mockDate,
            payment: 0,
            accumulated: 1,
          },
        ],
      })
    })
  })
})
