import { Test, TestingModule } from '@nestjs/testing'
import { SdfResolver } from '../sdf.resolver'
import { SdfService } from '../sdf.service'
import {
  SdfActionType,
  SdfExecuteActionInput,
} from '../sdf.model'
import type { User } from '@island.is/auth-nest-tools'
import type { ScreenDto, ComponentDto } from '../../../gen/fetch'

/**
 * Phase 3 Gate — Latency Baseline
 *
 * These tests measure the GQL layer overhead (resolver → service → mock REST
 * response → mapping). The REST-to-AstAdapter portion is mocked with realistic
 * response shapes matching the parental-leave template.
 *
 * Targets (§8, Constraint 17):
 *   - getScreen:      <300ms p95
 *   - executeAction:  <500ms p95
 *
 * Since these tests mock the REST layer, they measure GQL-layer overhead only.
 * The AstAdapter pipeline timing was baselined in Phase 2.
 */

const MOCK_APP_ID = '00000000-0000-0000-0000-000000000001'
const ITERATIONS = 50

const mockUser: User = {
  nationalId: '0101302989',
  scope: ['@island.is/applications:read', '@island.is/applications:write'],
  authorization: 'Bearer mock-token',
  client: 'test-client',
} as User

const createRealisticScreenDto = (): ScreenDto => {
  const components: ComponentDto[] = [
    {
      id: 'applicantName',
      type: 'TEXT',
      label: 'Full nafn',
      placeholder: 'Sláðu inn nafn',
      required: true,
      disabled: false,
      width: 'FULL',
    },
    {
      id: 'applicantEmail',
      type: 'TEXT',
      label: 'Netfang',
      placeholder: 'netfang@island.is',
      required: true,
      disabled: false,
      width: 'FULL',
    },
    {
      id: 'applicantPhone',
      type: 'PHONE',
      label: 'Símanúmer',
      required: true,
      disabled: false,
    },
    {
      id: 'expectedDateOfBirth',
      type: 'DATE',
      label: 'Áætlaður fæðingardagur',
      required: true,
      disabled: false,
    },
    {
      id: 'periods',
      type: 'REPEATER',
      label: 'Tímabil',
      arrayPath: 'periods',
      addItemLabel: 'Bæta við tímabili',
      removeItemLabel: 'Fjarlægja',
      children: [
        JSON.stringify([
          { id: 'periods[0].startDate', type: 'DATE', label: 'Upphafsdagur', required: true, disabled: false },
          { id: 'periods[0].endDate', type: 'DATE', label: 'Lokadagur', required: true, disabled: false },
          { id: 'periods[0].ratio', type: 'SLIDER', label: 'Hlutfall', required: true, disabled: false },
        ]),
      ],
    },
    {
      id: 'usePersonalAllowance',
      type: 'RADIO',
      label: 'Nýta persónuafslátt?',
      required: true,
      disabled: false,
      options: [
        { label: 'Já', value: 'yes' },
        { label: 'Nei', value: 'no' },
      ],
      clientShowWhen: undefined,
    },
    {
      id: 'bankAccount',
      type: 'BANK_ACCOUNT',
      label: 'Bankareikningur',
      required: true,
      disabled: false,
    },
    {
      id: 'pensionFund',
      type: 'SELECT',
      label: 'Lífeyrissjóður',
      required: true,
      disabled: false,
      options: [
        { label: 'LSR', value: 'lsr' },
        { label: 'Gildi', value: 'gildi' },
        { label: 'Birta', value: 'birta' },
      ],
    },
  ]

  return {
    applicationId: MOCK_APP_ID,
    locale: 'is',
    header: {
      title: 'Fæðingarorlof',
      description: 'Umsókn um fæðingarorlof',
    },
    stepper: {
      sections: [
        {
          id: 'personalInfo',
          title: 'Persónuupplýsingar',
          isComplete: true,
          children: [
            { id: 'sub-personal', title: 'Umsækjandi' },
            { id: 'sub-contact', title: 'Tengiliður' },
          ],
        },
        {
          id: 'periods',
          title: 'Tímabil',
          isComplete: false,
          children: [
            { id: 'sub-periods', title: 'Tímabil orlofs' },
          ],
        },
        {
          id: 'payments',
          title: 'Greiðslur',
          isComplete: false,
          children: [
            { id: 'sub-bank', title: 'Bankaupplýsingar' },
            { id: 'sub-pension', title: 'Lífeyrissjóður' },
          ],
        },
        {
          id: 'review',
          title: 'Yfirlit',
          isComplete: false,
          children: [],
        },
      ],
      activeSectionIndex: 1,
      activeSubSectionIndex: 0,
    },
    page: {
      id: 'periodsPage',
      index: 2,
      sectionIndex: 1,
      subSectionIndex: 0,
      components,
      errors: [],
    },
    footer: {
      buttons: [
        {
          id: 'back',
          text: 'Til baka',
          variant: 'GHOST',
          actionType: 'PREV_PAGE',
        },
        {
          id: 'next',
          text: 'Áfram',
          variant: 'PRIMARY',
          actionType: 'NEXT_PAGE',
        },
      ],
      canGoBack: true,
    },
  }
}

const percentile = (sorted: number[], p: number): number => {
  const idx = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, idx)]
}

describe('Phase 3 Gate — Latency Baseline (GQL layer)', () => {
  let resolver: SdfResolver
  let sdfService: jest.Mocked<SdfService>

  beforeAll(async () => {
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

  it(`getScreen GQL overhead: p50 < 5ms, p95 < 20ms (${ITERATIONS} iterations)`, async () => {
    const realisticDto = createRealisticScreenDto()
    sdfService.getScreen.mockResolvedValue(realisticDto)

    const latencies: number[] = []

    for (let i = 0; i < ITERATIONS; i++) {
      const start = performance.now()
      await resolver.getScreen(
        { applicationId: MOCK_APP_ID, step: 2 },
        'is',
        mockUser,
      )
      latencies.push(performance.now() - start)
    }

    latencies.sort((a, b) => a - b)
    const p50 = percentile(latencies, 50)
    const p95 = percentile(latencies, 95)

    console.log(
      `getScreen GQL overhead: p50=${p50.toFixed(2)}ms, p95=${p95.toFixed(2)}ms (n=${ITERATIONS})`,
    )

    expect(p50).toBeLessThan(5)
    expect(p95).toBeLessThan(20)
  })

  it(`executeAction (NEXT_PAGE) GQL overhead: p50 < 5ms, p95 < 20ms (${ITERATIONS} iterations)`, async () => {
    const realisticDto = createRealisticScreenDto()
    sdfService.executeAction.mockResolvedValue(realisticDto)

    const latencies: number[] = []

    for (let i = 0; i < ITERATIONS; i++) {
      const input: SdfExecuteActionInput = {
        applicationId: MOCK_APP_ID,
        actionType: SdfActionType.NEXT_PAGE,
        answers: JSON.stringify({
          applicantName: 'Test User',
          applicantEmail: 'test@test.is',
        }),
        lastKnownPageIndex: 2,
      }

      const start = performance.now()
      await resolver.executeAction(input, 'is', mockUser)
      latencies.push(performance.now() - start)
    }

    latencies.sort((a, b) => a - b)
    const p50 = percentile(latencies, 50)
    const p95 = percentile(latencies, 95)

    console.log(
      `executeAction (NEXT_PAGE) GQL overhead: p50=${p50.toFixed(2)}ms, p95=${p95.toFixed(2)}ms (n=${ITERATIONS})`,
    )

    expect(p50).toBeLessThan(5)
    expect(p95).toBeLessThan(20)
  })

  it(`executeAction (REFETCH) GQL overhead: p50 < 5ms, p95 < 20ms (${ITERATIONS} iterations)`, async () => {
    const realisticDto = createRealisticScreenDto()
    sdfService.executeAction.mockResolvedValue(realisticDto)

    const latencies: number[] = []

    for (let i = 0; i < ITERATIONS; i++) {
      const input: SdfExecuteActionInput = {
        applicationId: MOCK_APP_ID,
        actionType: SdfActionType.REFETCH,
        lastKnownPageIndex: 2,
      }

      const start = performance.now()
      await resolver.executeAction(input, 'is', mockUser)
      latencies.push(performance.now() - start)
    }

    latencies.sort((a, b) => a - b)
    const p50 = percentile(latencies, 50)
    const p95 = percentile(latencies, 95)

    console.log(
      `executeAction (REFETCH) GQL overhead: p50=${p50.toFixed(2)}ms, p95=${p95.toFixed(2)}ms (n=${ITERATIONS})`,
    )

    expect(p50).toBeLessThan(5)
    expect(p95).toBeLessThan(20)
  })
})
