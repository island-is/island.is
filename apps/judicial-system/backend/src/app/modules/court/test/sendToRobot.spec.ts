import { mock } from 'jest-mock-extended'

import { Test } from '@nestjs/testing'

import { EmailService } from '@island.is/email-service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import { User, UserRole } from '@island.is/judicial-system/types'

import { RobotLogRepositoryService } from '../../repository'
import { courtModuleConfig } from '../court.config'
import { CourtService } from '../court.service'

// The Microsoft Graph branch of sendToRobot is only reachable when the court robot
// is configured to use it, so this spec builds its own testing module rather than
// using createTestingCourtModule.
describe('CourtService - sendToRobot', () => {
  const user = { name: 'Test User' } as User
  const assignedRole = {
    name: 'Test Judge',
    role: UserRole.DISTRICT_COURT_JUDGE,
  }

  let originalFetch: typeof global.fetch
  let originalUseGraphApi: string | undefined

  let mockFetch: jest.Mock
  let mockAcquireToken: jest.Mock
  let emailService: EmailService
  let robotLogRepositoryService: RobotLogRepositoryService
  let courtService: CourtService

  const givenGraphApiIsUsed = (used: boolean) => {
    process.env.USE_MICROSOFT_GRAPH_API_FOR_COURT_ROBOT = used
      ? 'true'
      : 'false'
  }

  const createCourtService = async () => {
    const courtModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [courtModuleConfig] })],
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: {
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: RobotLogRepositoryService,
          useValue: {
            existsForCaseTypeAndElements: jest.fn(),
            create: jest
              .fn()
              .mockResolvedValue({ id: 'robot_log_id', seqNumber: 7 }),
            markDelivered: jest.fn(),
          },
        },
        CourtService,
      ],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          return mock()
        }
      })
      .compile()

    emailService = courtModule.get<EmailService>(EmailService)
    robotLogRepositoryService = courtModule.get<RobotLogRepositoryService>(
      RobotLogRepositoryService,
    )
    courtService = courtModule.get<CourtService>(CourtService)

    courtModule.get<CourtClientService>(CourtClientService)

    courtModule.close()

    // The credentials are deliberately left unconfigured so that no real
    // ConfidentialClientApplication is built; the stub stands in for it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(courtService as any).confidentintialClientApplication = {
      acquireTokenByClientCredential: mockAcquireToken,
    }
  }

  beforeAll(() => {
    originalFetch = global.fetch
    originalUseGraphApi = process.env.USE_MICROSOFT_GRAPH_API_FOR_COURT_ROBOT
  })

  afterAll(() => {
    global.fetch = originalFetch

    if (originalUseGraphApi === undefined) {
      delete process.env.USE_MICROSOFT_GRAPH_API_FOR_COURT_ROBOT
    } else {
      process.env.USE_MICROSOFT_GRAPH_API_FOR_COURT_ROBOT = originalUseGraphApi
    }
  })

  beforeEach(() => {
    mockFetch = jest.fn()
    mockAcquireToken = jest
      .fn()
      .mockResolvedValue({ accessToken: 'access_token' })

    global.fetch = mockFetch as unknown as typeof global.fetch
  })

  describe('sending through the Microsoft Graph API', () => {
    beforeEach(async () => {
      givenGraphApiIsUsed(true)

      await createCourtService()
    })

    it('marks the robot log as delivered when the mail is accepted', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, status: 202 })

      await courtService.updateIndictmentCaseWithAssignedRoles(
        user,
        'case_id',
        'Court',
        'S-1/2026',
        assignedRole,
      )

      expect(mockFetch).toHaveBeenCalled()
      expect(robotLogRepositoryService.markDelivered).toHaveBeenCalledWith(
        'robot_log_id',
      )
    })

    it('does not mark the robot log as delivered when the Graph API rejects the mail', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      })

      await expect(
        courtService.updateIndictmentCaseWithAssignedRoles(
          user,
          'case_id',
          'Court',
          'S-1/2026',
          assignedRole,
        ),
      ).rejects.toThrow(
        'Failed to send robot email through the Microsoft Graph API: 400 Bad Request',
      )

      expect(robotLogRepositoryService.markDelivered).not.toHaveBeenCalled()
    })

    it('does not mark the robot log as delivered when the Graph API fails server side', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(
        courtService.updateIndictmentCaseWithAssignedRoles(
          user,
          'case_id',
          'Court',
          'S-1/2026',
          assignedRole,
        ),
      ).rejects.toThrow()

      expect(robotLogRepositoryService.markDelivered).not.toHaveBeenCalled()
    })

    it('does not send or mark delivered when no access token is returned', async () => {
      mockAcquireToken.mockResolvedValueOnce(null)

      await expect(
        courtService.updateIndictmentCaseWithAssignedRoles(
          user,
          'case_id',
          'Court',
          'S-1/2026',
          assignedRole,
        ),
      ).rejects.toThrow('Failed to acquire token')

      expect(mockFetch).not.toHaveBeenCalled()
      expect(robotLogRepositoryService.markDelivered).not.toHaveBeenCalled()
    })
  })

  describe('sending through the email service', () => {
    beforeEach(async () => {
      givenGraphApiIsUsed(false)

      await createCourtService()
    })

    it('marks the robot log as delivered when the email is sent', async () => {
      await courtService.updateIndictmentCaseWithAssignedRoles(
        user,
        'case_id',
        'Court',
        'S-1/2026',
        assignedRole,
      )

      expect(emailService.sendEmail).toHaveBeenCalled()
      expect(mockFetch).not.toHaveBeenCalled()
      expect(robotLogRepositoryService.markDelivered).toHaveBeenCalledWith(
        'robot_log_id',
      )
    })

    it('does not mark the robot log as delivered when sending the email fails', async () => {
      const mockSendEmail = emailService.sendEmail as jest.Mock
      mockSendEmail.mockRejectedValueOnce(new Error('Some error'))

      await expect(
        courtService.updateIndictmentCaseWithAssignedRoles(
          user,
          'case_id',
          'Court',
          'S-1/2026',
          assignedRole,
        ),
      ).rejects.toThrow('Some error')

      expect(robotLogRepositoryService.markDelivered).not.toHaveBeenCalled()
    })
  })
})
