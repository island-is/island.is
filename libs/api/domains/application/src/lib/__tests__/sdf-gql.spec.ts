import { Test, TestingModule } from '@nestjs/testing'
import { SdfResolver } from '../sdf.resolver'
import { SdfService } from '../sdf.service'
import {
  SdfActionType,
  SdfGetScreenInput,
  SdfExecuteActionInput,
} from '../sdf.model'
import type { User } from '@island.is/auth-nest-tools'
import type { ScreenDto, ComponentDto } from '../../../gen/fetch'

const MOCK_APP_ID = '00000000-0000-0000-0000-000000000001'

const mockUser: User = {
  nationalId: '0101302989',
  scope: ['@island.is/applications:read', '@island.is/applications:write'],
  authorization: 'Bearer mock-token',
  client: 'test-client',
} as User

const createMockScreenDto = (
  overrides: Partial<ScreenDto> = {},
): ScreenDto => {
  return {
    applicationId: MOCK_APP_ID,
    locale: 'is',
    header: { title: 'Test Application' },
    stepper: {
      sections: [
        {
          id: 'section-1',
          title: 'Section One',
          isComplete: false,
          children: [{ id: 'sub-1', title: 'Sub One' }],
        },
      ],
      activeSectionIndex: 0,
      activeSubSectionIndex: 0,
    },
    page: {
      id: 'page-0',
      index: 0,
      sectionIndex: 0,
      subSectionIndex: 0,
      components: [
        {
          id: 'applicantName',
          type: 'TEXT',
          label: 'Full Name',
          placeholder: 'Enter name',
          required: true,
          disabled: false,
        } as ComponentDto,
        {
          id: 'status',
          type: 'RADIO',
          label: 'Status',
          required: true,
          disabled: false,
          options: [
            { label: 'Single', value: 'single' },
            { label: 'Married', value: 'married' },
          ],
        } as ComponentDto,
      ],
      errors: [],
    },
    footer: {
      buttons: [
        {
          id: 'btn-next',
          text: 'Continue',
          variant: 'PRIMARY',
          actionType: 'NEXT_PAGE',
        },
      ],
      canGoBack: false,
    },
    ...overrides,
  }
}

describe('SDF GraphQL Layer', () => {
  let resolver: SdfResolver
  let sdfService: jest.Mocked<SdfService>

  beforeEach(async () => {
    const mockSdfService = {
      getScreen: jest.fn(),
      executeAction: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SdfResolver,
        { provide: SdfService, useValue: mockSdfService },
      ],
    }).compile()

    resolver = module.get<SdfResolver>(SdfResolver)
    sdfService = module.get(SdfService) as jest.Mocked<SdfService>
  })

  describe('getScreen query', () => {
    it('should return a correctly mapped SdfScreen', async () => {
      const restDto = createMockScreenDto()
      sdfService.getScreen.mockResolvedValue(restDto)

      const input: SdfGetScreenInput = {
        applicationId: MOCK_APP_ID,
        step: 0,
      }

      const result = await resolver.getScreen(input, 'is', mockUser)

      expect(sdfService.getScreen).toHaveBeenCalledWith(
        MOCK_APP_ID,
        0,
        'is',
        mockUser,
      )

      expect(result.applicationId).toBe(MOCK_APP_ID)
      expect(result.locale).toBe('is')
      expect(result.header.title).toBe('Test Application')
      expect(result.stepper.sections).toHaveLength(1)
      expect(result.stepper.sections[0].id).toBe('section-1')
      expect(result.stepper.sections[0].children).toHaveLength(1)
      expect(result.page.id).toBe('page-0')
      expect(result.page.index).toBe(0)
      expect(result.page.components).toHaveLength(2)
      expect(result.page.errors).toHaveLength(0)
      expect(result.footer.buttons).toHaveLength(1)
      expect(result.footer.buttons[0].text).toBe('Continue')
      expect(result.footer.canGoBack).toBe(false)
    })

    it('should pass undefined step when not provided', async () => {
      sdfService.getScreen.mockResolvedValue(createMockScreenDto())

      const input: SdfGetScreenInput = {
        applicationId: MOCK_APP_ID,
      }

      await resolver.getScreen(input, 'en', mockUser)

      expect(sdfService.getScreen).toHaveBeenCalledWith(
        MOCK_APP_ID,
        undefined,
        'en',
        mockUser,
      )
    })

    it('should preserve component data through mapping', async () => {
      const dto = createMockScreenDto({
        page: {
          id: 'page-0',
          index: 0,
          sectionIndex: 0,
          subSectionIndex: 0,
          components: [
            {
              id: 'conditionalField',
              type: 'TEXT',
              label: 'Conditional',
              required: false,
              disabled: false,
              clientCondition: {
                questionId: 'hasSpouse',
                comparator: 'eq',
                value: 'yes',
              },
            } as ComponentDto,
          ],
          errors: [
            { componentId: 'applicantName', message: 'Required field' },
          ],
        },
      })
      sdfService.getScreen.mockResolvedValue(dto)

      const result = await resolver.getScreen(
        { applicationId: MOCK_APP_ID, step: 0 },
        'is',
        mockUser,
      )

      expect(result.page.errors).toHaveLength(1)
      expect(result.page.errors[0].componentId).toBe('applicantName')
      expect(result.page.errors[0].message).toBe('Required field')

      const comp = result.page.components[0] as unknown as Record<string, unknown>
      expect(comp.clientCondition).toBeDefined()
    })
  })

  describe('executeAction mutation', () => {
    it('should handle NEXT_PAGE action', async () => {
      const nextPageDto = createMockScreenDto({
        page: {
          id: 'page-1',
          index: 1,
          sectionIndex: 0,
          subSectionIndex: 1,
          components: [],
          errors: [],
        },
        footer: {
          buttons: [
            {
              id: 'btn-next',
              text: 'Continue',
              variant: 'PRIMARY',
              actionType: 'NEXT_PAGE',
            },
          ],
          canGoBack: true,
        },
      })
      sdfService.executeAction.mockResolvedValue(nextPageDto)

      const input: SdfExecuteActionInput = {
        applicationId: MOCK_APP_ID,
        actionType: SdfActionType.NEXT_PAGE,
        answers: JSON.stringify({ applicantName: 'John Doe' }),
        lastKnownPageIndex: 0,
      }

      const result = await resolver.executeAction(input, 'is', mockUser)

      expect(sdfService.executeAction).toHaveBeenCalledWith(
        MOCK_APP_ID,
        SdfActionType.NEXT_PAGE,
        { applicantName: 'John Doe' },
        0,
        'is',
        mockUser,
        undefined,
        undefined,
      )

      expect(result.page.index).toBe(1)
      expect(result.footer.canGoBack).toBe(true)
    })

    it('should handle PREV_PAGE action', async () => {
      sdfService.executeAction.mockResolvedValue(createMockScreenDto())

      const input: SdfExecuteActionInput = {
        applicationId: MOCK_APP_ID,
        actionType: SdfActionType.PREV_PAGE,
        lastKnownPageIndex: 1,
      }

      await resolver.executeAction(input, 'is', mockUser)

      expect(sdfService.executeAction).toHaveBeenCalledWith(
        MOCK_APP_ID,
        SdfActionType.PREV_PAGE,
        undefined,
        1,
        'is',
        mockUser,
        undefined,
        undefined,
      )
    })

    it('should handle REFETCH action (ephemeral, side-effect-free)', async () => {
      sdfService.executeAction.mockResolvedValue(createMockScreenDto())

      const input: SdfExecuteActionInput = {
        applicationId: MOCK_APP_ID,
        actionType: SdfActionType.REFETCH,
        lastKnownPageIndex: 0,
      }

      await resolver.executeAction(input, 'is', mockUser)

      expect(sdfService.executeAction).toHaveBeenCalledWith(
        MOCK_APP_ID,
        SdfActionType.REFETCH,
        undefined,
        0,
        'is',
        mockUser,
        undefined,
        undefined,
      )
    })

    it('should handle VALIDATE action with fieldIds', async () => {
      const validateDto = createMockScreenDto({
        page: {
          id: 'page-0',
          index: 0,
          sectionIndex: 0,
          subSectionIndex: 0,
          components: [],
          errors: [
            {
              componentId: 'applicantName',
              message: 'Name must be at least 2 characters',
            },
          ],
        },
      })
      sdfService.executeAction.mockResolvedValue(validateDto)

      const input: SdfExecuteActionInput = {
        applicationId: MOCK_APP_ID,
        actionType: SdfActionType.VALIDATE,
        answers: JSON.stringify({ applicantName: 'A' }),
        lastKnownPageIndex: 0,
        fieldIds: ['applicantName'],
      }

      const result = await resolver.executeAction(input, 'is', mockUser)

      expect(sdfService.executeAction).toHaveBeenCalledWith(
        MOCK_APP_ID,
        SdfActionType.VALIDATE,
        { applicantName: 'A' },
        0,
        'is',
        mockUser,
        ['applicantName'],
        undefined,
      )

      expect(result.page.errors).toHaveLength(1)
      expect(result.page.errors[0].componentId).toBe('applicantName')
    })

    it('should handle SUBMIT action with event', async () => {
      sdfService.executeAction.mockResolvedValue(
        createMockScreenDto({
          page: {
            id: 'page-done',
            index: 0,
            sectionIndex: 1,
            subSectionIndex: 0,
            components: [],
            errors: [],
          },
        }),
      )

      const input: SdfExecuteActionInput = {
        applicationId: MOCK_APP_ID,
        actionType: SdfActionType.SUBMIT,
        lastKnownPageIndex: 2,
        event: 'APPROVE',
      }

      await resolver.executeAction(input, 'is', mockUser)

      expect(sdfService.executeAction).toHaveBeenCalledWith(
        MOCK_APP_ID,
        SdfActionType.SUBMIT,
        undefined,
        2,
        'is',
        mockUser,
        undefined,
        'APPROVE',
      )
    })

    it('should handle undefined answers correctly', async () => {
      sdfService.executeAction.mockResolvedValue(createMockScreenDto())

      const input: SdfExecuteActionInput = {
        applicationId: MOCK_APP_ID,
        actionType: SdfActionType.NEXT_PAGE,
        lastKnownPageIndex: 0,
      }

      await resolver.executeAction(input, 'is', mockUser)

      expect(sdfService.executeAction).toHaveBeenCalledWith(
        MOCK_APP_ID,
        SdfActionType.NEXT_PAGE,
        undefined,
        0,
        'is',
        mockUser,
        undefined,
        undefined,
      )
    })
  })

  describe('REST-to-GQL mapping integrity', () => {
    it('should map stepper with multiple sections and subsections', async () => {
      const dto = createMockScreenDto({
        stepper: {
          sections: [
            {
              id: 's1',
              title: 'Info',
              isComplete: true,
              children: [
                { id: 'ss1a', title: 'Personal' },
                { id: 'ss1b', title: 'Contact' },
              ],
            },
            {
              id: 's2',
              title: 'Review',
              isComplete: false,
              children: [],
            },
          ],
          activeSectionIndex: 1,
          activeSubSectionIndex: 0,
        },
      })
      sdfService.getScreen.mockResolvedValue(dto)

      const result = await resolver.getScreen(
        { applicationId: MOCK_APP_ID, step: 3 },
        'is',
        mockUser,
      )

      expect(result.stepper.sections).toHaveLength(2)
      expect(result.stepper.sections[0].isComplete).toBe(true)
      expect(result.stepper.sections[0].children).toHaveLength(2)
      expect(result.stepper.sections[1].isComplete).toBe(false)
      expect(result.stepper.activeSectionIndex).toBe(1)
    })

    it('should map footer with multiple buttons', async () => {
      const dto = createMockScreenDto({
        footer: {
          buttons: [
            {
              id: 'back',
              text: 'Back',
              variant: 'GHOST',
              actionType: 'PREV_PAGE',
            },
            {
              id: 'next',
              text: 'Next',
              variant: 'PRIMARY',
              actionType: 'NEXT_PAGE',
            },
            {
              id: 'submit',
              text: 'Submit',
              variant: 'PRIMARY',
              actionType: 'SUBMIT',
            },
          ],
          canGoBack: true,
        },
      })
      sdfService.getScreen.mockResolvedValue(dto)

      const result = await resolver.getScreen(
        { applicationId: MOCK_APP_ID },
        'is',
        mockUser,
      )

      expect(result.footer.buttons).toHaveLength(3)
      expect(result.footer.buttons[0].actionType).toBe('PREV_PAGE')
      expect(result.footer.buttons[1].variant).toBe('PRIMARY')
      expect(result.footer.buttons[2].actionType).toBe('SUBMIT')
    })

    it('should map header description when present', async () => {
      const dto = createMockScreenDto({
        header: {
          title: 'With Description',
          description: 'Please fill out this form',
        },
      })
      sdfService.getScreen.mockResolvedValue(dto)

      const result = await resolver.getScreen(
        { applicationId: MOCK_APP_ID },
        'is',
        mockUser,
      )

      expect(result.header.description).toBe('Please fill out this form')
    })
  })
})

describe('SdfService', () => {
  it('should call sdfApi.sdfControllerGetScreen with auth middleware', async () => {
    const mockGetScreen = jest.fn().mockResolvedValue(
      createMockScreenDto(),
    )
    const mockWithMiddleware = jest.fn().mockReturnValue({
      sdfControllerGetScreen: mockGetScreen,
      sdfControllerExecuteAction: jest.fn(),
    })

    const mockSdfApi = {
      withMiddleware: mockWithMiddleware,
    }

    const service = new SdfService(mockSdfApi as any)

    await service.getScreen(MOCK_APP_ID, 0, 'is', mockUser)

    expect(mockWithMiddleware).toHaveBeenCalled()
    expect(mockGetScreen).toHaveBeenCalledWith({
      applicationId: MOCK_APP_ID,
      step: 0,
      locale: 'is',
    })
  })

  it('should call sdfApi.sdfControllerExecuteAction with auth middleware', async () => {
    const mockExecuteAction = jest.fn().mockResolvedValue(
      createMockScreenDto(),
    )
    const mockWithMiddleware = jest.fn().mockReturnValue({
      sdfControllerGetScreen: jest.fn(),
      sdfControllerExecuteAction: mockExecuteAction,
    })

    const mockSdfApi = {
      withMiddleware: mockWithMiddleware,
    }

    const service = new SdfService(mockSdfApi as any)

    await service.executeAction(
      MOCK_APP_ID,
      SdfActionType.NEXT_PAGE,
      { name: 'test' },
      0,
      'is',
      mockUser,
    )

    expect(mockWithMiddleware).toHaveBeenCalled()
    expect(mockExecuteAction).toHaveBeenCalledWith({
      applicationId: MOCK_APP_ID,
      executeActionDto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { name: 'test' },
        locale: 'is',
        lastKnownPageIndex: 0,
        fieldIds: undefined,
        event: undefined,
      },
    })
  })
})
