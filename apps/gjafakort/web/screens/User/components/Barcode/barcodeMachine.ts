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

// const fetchBarcode = (ctx) => fetch(`/api/v1/GiftCardCode/${ctx.id}/${ctx.countryCode}-${ctx.mobileNumber}`).then(response => response.json());

const fetchBarcodeTemp = (ctx) => {
  console.log(ctx.giftCard.id)
  const date = new Date()
  if (ctx.giftCard.id === '2') {
    return fetch('https://app.fakesfasdfjson.com/q').then((response) =>
      response.json(),
    )
  }
  return fetch('https://app.fakejson.com/q', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: '8cold84i0LC3bHfNfnIfYA',
      data: {
        code: '46834268',
        expiryDate: new Date(date.getTime() + 5000),
        pollingUrl: 'test',
      },
    }),
  }).then((response) => response.json())
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
    loading: {}
    active: {}
    success: {}
    invalid: {}
    error: {}
  }
}

export type GiftCard = { id: string; amount: number }

type ActionEvents =
  | { type: 'GET_BARCODE'; giftCard: GiftCard }
  | { type: 'TICK' }
  | { type: 'USE_BARCODE' }
  | { type: 'BACK_TO_LIST' }
  | { type: 'RETRY_BARCODE' }

interface BarcodeContext {
  elapsed: number
  barcode: string | number
  expiryDate: Date
  secondsToExpiry: number
  error: object
  giftCard: GiftCard
  pollingUrl: string
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
    },
    states: {
      idle: {
        on: {
          GET_BARCODE: {
            actions: assign({
              giftCard: (ctx, event) => event.giftCard,
            }),
            target: 'loading',
          },
        },
      },
      loading: {
        invoke: {
          id: 'getBarcode',
          src: fetchBarcodeTemp,
          onDone: {
            target: 'active',
            actions: assign({
              secondsToExpiry: (ctx, event) => {
                const now = new Date()
                const expiryDate = new Date(event.data.expiryDate)
                const secondsToExpiry = Math.abs(
                  (expiryDate.getTime() - now.getTime()) / 1000,
                )
                return secondsToExpiry
              },
              expiryDate: (ctx, event) => event.data.expiryDate,
              barcode: (ctx, event) => event.data.code,
              pollingUrl: (ctx, event) => event.data.pollingUrl,
            }),
          },
          onError: {
            target: 'error',
            actions: assign({ error: (ctx, event) => event.data }),
          },
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
        on: {
          TICK: {
            actions: 'tick',
          },
          '': {
            cond: 'timesUp',
            target: 'invalid',
          },
          USE_BARCODE: 'success',
        },
      },
      success: {},
      invalid: {
        on: {
          RETRY_BARCODE: 'loading',
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
    },
    guards: {
      timesUp: (context) => {
        return context.elapsed >= context.secondsToExpiry
      },
    },
  },
)
