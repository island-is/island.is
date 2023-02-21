export const getAirDiscountsData = [
  {
    connectionDiscountCodes: [
      {
        code: 'code',
        flightId: '123123123',
        flightDesc: 'AEY',
        validUntil: '12-12-12',
      },
    ],
    discountCode: '1234',
    expiresIn: 1232323,
    nationalId: '0101013019',
    user: {
      name: 'Foreldri Reykjavík',
      fund: {
        credit: 10,
        total: 20,
        used: 10,
      },
      meetsADSRequirements: true,
      mobile: '123',
      nationalId: '123',
      role: '123',
    },
  },
]

export const getFlights = [
  {
    airline: 'Íslandloft',
    cooperation: 'coop',
    discountPrice: 9990,
    financialState: 'State',
    flight: {
      id: '123',
      bookingDate: '01-01-01',
      flightLegs: [],
      user: {
        meetsADSRequirements: true,
        name: 'name',
        nationalId: '123',
        role: 'role',
      },
      userInfo: {
        age: 3,
        gender: 'KVK',
        postalCode: 600,
      },
    },
    id: '123',
    originalPrice: 19990,
    travel: 'AEY',
  },
  {
    airline: 'Íslandloft',
    cooperation: 'coop',
    discountPrice: 9990,
    financialState: 'State',
    flight: {
      id: '123',
      bookingDate: '01-01-01',
      flightLegs: [],
      user: {
        meetsADSRequirements: true,
        name: 'Foreldri',
        nationalId: '123',
        role: 'role',
      },
      userInfo: {
        age: 3,
        gender: 'KVK',
        postalCode: 600,
      },
    },
    id: '1234',
    originalPrice: 19990,
    travel: 'AEY',
  },
]
