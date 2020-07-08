import { Machine, assign } from 'xstate'

// context
// timer
// pollingInfo
// current remaining amount
// last remaining amount
// initial amount

// idle // show button to activate barcode

// active
// fetch giftcardcode
// start counter based on expiryDate
// start polling pollingUrl

// condition: timer runs out > invalid state
// condition: barcode activated based on pollingUrl:
// update remaining amounts
// > success state

// UI
// show timer
// show remaining amount

// success
// UI
// show diff between last remaining amount and current remaining amount
// show current remaining amount
// show initial amount

// invalid
// UI
// explanation that code got expired
// button to get new code > active state

const fetchPollingUrl = (ctx) => {
  return fetch(ctx.pollingUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
}

const tick = () => (cb) => {
  const interval = setInterval(() => {
    cb('TICK')
  }, 1000)

  return () => {
    clearInterval(interval)
  }
}

interface BarcodeStateSchema {
  states: {
    idle: {}
    give: {}
    confirmGive: {}
    loading: {}
    active: {}
    success: {}
    invalid: {}
    error: {}
  }
}

export type GiftCard = { id: string; amount: number }
export type GiveInfo = {
  phoneNumber: string
  message: string
}

type PollingData = {
  status?: string
  title?: string
  body?: string
  amount?: string
}

type ActionEvents =
  | { type: 'GET_BARCODE'; giftCard: GiftCard; pollingData?: PollingData }
  | { type: 'TICK' }
  | { type: 'BACK_TO_LIST' }
  | {
      type: 'SUCCESS'
      expiryDate: Date
      code: string | number
      pollingUrl: string
    }
  | { type: 'ERROR' }
  | { type: 'GIVE_GIFT_CARD'; giftCard: GiftCard }
  | { type: 'CONFIRM_GIVE'; giveInfo: GiveInfo }
  | { type: 'BACK_TO_GIVE' }

interface BarcodeContext {
  elapsed: number
  barcode: string | number
  expiryDate: Date
  secondsToExpiry: number
  error: object
  giftCard: GiftCard
  giveInfo: GiveInfo
  pollingUrl: string
  pollingData: PollingData
}

type PollingDataEvent = {
  type: string
  data: object
}

export const barcodeMachine = Machine<
  BarcodeContext,
  BarcodeStateSchema,
  ActionEvents
>(
  {
    id: 'barcode',
    initial: 'idle',
    context: {
      elapsed: 0,
      barcode: undefined,
      expiryDate: undefined,
      secondsToExpiry: 0,
      error: undefined,
      giftCard: { id: '', amount: 0 },
      pollingUrl: '',
      pollingData: {},
      giveInfo: { phoneNumber: '', message: '' },
    },
    states: {
      idle: {
        entry: ['refetchList', 'resetGiveInfo'],
        on: {
          GET_BARCODE: {
            actions: assign({
              giftCard: (ctx, event) => event.giftCard,
            }),
            target: 'loading',
          },
          GIVE_GIFT_CARD: {
            actions: assign({
              giftCard: (ctx, event) => event.giftCard,
            }),
            target: 'give',
          },
        },
      },
      give: {
        on: {
          CONFIRM_GIVE: {
            actions: assign({
              giveInfo: (ctx, event) => event.giveInfo,
            }),
            target: 'confirmGive',
          },
        },
      },
      confirmGive: {
        on: {
          BACK_TO_GIVE: 'give',
        },
      },
      loading: {
        on: {
          SUCCESS: {
            target: 'active.polling',
            actions: assign({
              secondsToExpiry: (ctx, event) => {
                const now = new Date()
                const expiryDate = new Date(event.expiryDate)
                const secondsToExpiry = Math.abs(
                  (expiryDate.getTime() - now.getTime()) / 1000,
                )
                return secondsToExpiry
              },
              expiryDate: (ctx, event) => event.expiryDate,
              barcode: (ctx, event) => event.code,
              pollingUrl: (ctx, event) => event.pollingUrl,
            }),
          },
          ERROR: 'error',
        },
      },
      active: {
        entry: assign({
          elapsed: 0,
        }),
        invoke: {
          id: 'timerTick',
          src: tick,
        },
        states: {
          polling: {
            invoke: {
              id: 'pollingUrl',
              src: fetchPollingUrl,
              onDone: {
                actions: assign({
                  pollingData: (cxt, event: PollingDataEvent) => {
                    return event.data
                  },
                }),
              },
              onError: (ctx, error) => {
                console.log(error)
              },
            },
            after: {
              2000: 'poll',
            },
          },
          poll: {
            on: {
              '': [
                {
                  cond: 'shouldPoll',
                  target: 'polling',
                },
                {
                  target: '#barcode.success',
                },
              ],
            },
          },
        },
        on: {
          TICK: {
            actions: 'tick',
          },
          '': {
            cond: 'timesUp',
            target: 'invalid',
          },
        },
      },
      success: {
        on: {
          GET_BARCODE: {
            target: 'loading',
            actions: assign({
              giftCard: (ctx) => ({
                ...(ctx.giftCard as GiftCard),
                amount: parseInt(ctx.pollingData.amount),
              }),
              pollingData: {} as PollingData,
            }),
          },
        },
      },
      invalid: {
        on: {
          GET_BARCODE: 'loading',
        },
      },
      error: {},
    },
    on: {
      BACK_TO_LIST: 'idle',
    },
  },
  {
    actions: {
      tick: assign({
        elapsed: ({ elapsed }) => elapsed + 1,
      }),
      resetGiveInfo: assign({
        giveInfo: { phoneNumber: '', message: '' },
      }),
    },
    guards: {
      timesUp: (context) => {
        return context.elapsed >= context.secondsToExpiry
      },
      shouldPoll: (ctx) => {
        return !ctx.pollingData.amount
      },
    },
  },
)
