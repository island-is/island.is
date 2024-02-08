export const mockDiscount = {
  nationalId: '1326487905',
  active: true,
  discountedFlights: [
    {
      isConnectionFlight: true,
      flightLegs: [
        {
          origin: 'GRY',
          destination: 'AEY',
        },
        {
          origin: 'AEY',
          destination: 'GRY',
        },
      ],
      discount: {
        code: 'ASDJAD123',
        active: true,
        isConnectionCode: true,
      },
    },
    {
      isConnectionFlight: false,
      flightLegs: [
        {
          origin: 'AEY',
          destination: 'RKV',
        },
        {
          origin: 'RKV',
          destination: 'AEY',
        },
      ],
      discount: {
        code: 'ASDJAD1456',
        active: true,
        isConnectionCode: false,
      },
    },
  ],
}

export const mockExplicitDiscount = {
  nationalId: '1326487905',
  active: true,
  discountedFlights: [
    {
      isConnectionFlight: true,
      flightLegs: [
        {
          origin: 'GRY',
          destination: 'AEY',
        },
        {
          origin: 'AEY',
          destination: 'GRY',
        },
      ],
      discount: {
        code: 'ASDJAD123',
        active: true,
        isConnectionCode: true,
        explicit: true,
      },
    },
    {
      isConnectionFlight: false,
      flightLegs: [
        {
          origin: 'AEY',
          destination: 'RKV',
        },
        {
          origin: 'RKV',
          destination: 'AEY',
        },
      ],
      discount: {
        code: 'ASDJAD1456',
        active: true,
        isConnectionCode: false,
        explicit: true,
      },
    },
  ],
}
