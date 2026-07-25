import { getSelectedVehicle } from './getSelectedVehicle'

const externalData = {
  currentVehicleList: {
    data: {
      totalRecords: 2,
      vehicles: [
        {
          permno: 'BAT90',
          make: 'Toyota',
          color: 'Black',
          mileageReading: '1000',
        },
        {
          permno: 'TM118',
          make: 'Honda',
          color: 'Red',
          mileageReading: '2000',
        },
      ],
    },
  },
} as Parameters<typeof getSelectedVehicle>[0]

describe('getSelectedVehicle', () => {
  it('uses selected plate before selected list index', () => {
    const vehicle = getSelectedVehicle(externalData, {
      pickVehicle: {
        vehicle: '0',
        plate: 'TM118',
      },
    })

    expect(vehicle?.permno).toBe('TM118')
    expect(vehicle?.make).toBe('Honda')
  })

  it('uses selected plate answers when the refreshed list no longer contains the selected vehicle', () => {
    const vehicle = getSelectedVehicle(
      {
        currentVehicleList: {
          data: {
            totalRecords: 1,
            vehicles: [
              {
                permno: 'BAT90',
                make: 'Toyota',
                color: 'Black',
              },
            ],
          },
        },
      },
      {
        pickVehicle: {
          vehicle: '0',
          plate: 'TM118',
          type: 'Honda',
          color: 'Red',
        },
      },
    )

    expect(vehicle).toMatchObject({
      permno: 'TM118',
      make: 'Honda',
      color: 'Red',
    })
  })

  it('falls back to selected list index when selected plate is missing', () => {
    const vehicle = getSelectedVehicle(externalData, {
      pickVehicle: {
        vehicle: '0',
      },
    })

    expect(vehicle?.permno).toBe('BAT90')
  })

  it('normalizes vehicles found by plate to include permno and make', () => {
    const vehicle = getSelectedVehicle(externalData, {
      pickVehicle: {
        findVehicle: true,
        plate: 'SAT10',
        type: 'Mazda',
        color: 'Blue',
      },
      vehicleMileage: {
        mileageReading: '3000',
      },
    })

    expect(vehicle).toMatchObject({
      permno: 'SAT10',
      make: 'Mazda',
      color: 'Blue',
      mileageReading: '3000',
    })
  })
})
