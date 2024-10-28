import { HttpMethod, Response } from '@anev/ts-mountebank'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import formatISO from 'date-fns/formatISO'
import { Labor } from '../../../../../../../../infra/src/dsl/xroad'
import { addXroadMock } from '../../../../../support/wire-mocks'

export const loadParentalLeaveXroadMocks = async () => {
  await addXroadMock({
    config: Labor,
    prefix: 'XROAD_VMST_API_PATH',
    apiPath: '/users/0101303019/parental-leaves/periods/length',
    prefixType: 'base-path-with-env',
    serviceMemberCode: 'XROAD_VMST_MEMBER_CODE',
    response: new Response().withJSONBody({
      periodLength: 98,
    }),
  })
  await addXroadMock({
    config: Labor,
    prefix: 'XROAD_VMST_API_PATH',
    apiPath: '/users/0101303019/parental-leaves',
    prefixType: 'base-path-with-env',
    serviceMemberCode: 'XROAD_VMST_MEMBER_CODE',
    response: [
      new Response().withJSONBody({
        status: 'TestOK',
      }),
      new Response().withJSONBody({
        status: 'OK',
        id: '23234',
      }),
    ],
    method: HttpMethod.POST,
  })
  await addXroadMock({
    config: Labor,
    prefix: 'XROAD_VMST_API_PATH',
    apiPath: '/users/0101303019/parental-leaves',
    prefixType: 'base-path-with-env',
    serviceMemberCode: 'XROAD_VMST_MEMBER_CODE',
    response: [
      new Response().withJSONBody({
        parentalLeaves: [],
      }),
    ],
    method: HttpMethod.GET,
  })
  const babyBDayRandomFactor = Math.ceil(Math.random() * 85)
  await addXroadMock({
    config: Labor,
    prefix: 'XROAD_VMST_API_PATH',
    apiPath: '/users/0101303019/pregnancy-status',
    prefixType: 'base-path-with-env',
    serviceMemberCode: 'XROAD_VMST_MEMBER_CODE',
    response: [
      new Response().withJSONBody({
        hasActivePregnancy: true,
        expectedDateOfBirth: formatISO(
          addDays(addMonths(new Date(), 6), babyBDayRandomFactor),
          {
            representation: 'date',
          },
        ),
      }),
    ],
  })
}
