import endOfMonth from 'date-fns/endOfMonth'
import endOfDay from 'date-fns/endOfDay'
import addMonths from 'date-fns/addMonths'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import format from 'date-fns/format'
import {
  processDataFromSource,
  _tryToGetDate,
  splitCsvLine,
} from './statistics.utils'

describe('processDataFromSource', () => {
  it('should process number value csv with month+year labels', () => {
    // Arrange
    const expected = {
      data: {
        testkey1: Array.from({ length: 4 }, (_, i) => ({
          header: endOfMonth(new Date(2023, 9 + i))
            .getTime()
            .toString(),
          value: 10 + i * 10,
        })),
        testkey2: Array.from({ length: 4 }, (_, i) => ({
          header: endOfMonth(new Date(2023, 9 + i))
            .getTime()
            .toString(),
          value: 10 + i * 10 + 2,
        })),
      },
    }

    const csv = `
    ,,,Okt 23, Nóv 23, Des 23, Jan 24
    testkey1,,,10,20,30,40
    testkey2,,,12,22,32,42
    `

    // Act
    const processed = processDataFromSource(csv)

    // Assert
    expect(processed).toEqual(expected)
  })

  it('should process percentage value csv with month + year labels', () => {
    // Arrange
    const expected = {
      data: {
        testkey1: Array.from({ length: 4 }, (_, i) => ({
          header: endOfMonth(new Date(2023, 9 + i))
            .getTime()
            .toString(),
          value: (10 + i * 10) / 100,
        })),
        testkey2: Array.from({ length: 4 }, (_, i) => ({
          header: endOfMonth(new Date(2023, 9 + i))
            .getTime()
            .toString(),
          value: (10 + i * 10 + 2) / 100,
        })),
      },
    }

    const csv = `
        ,,,Okt 23, Nóv 23, Des 23, Jan 24
        testkey1,,,10%,20%,30%,40%
        testkey2,,,12%,22%,32%,42%
        `

    // Act
    const processed = processDataFromSource(csv)

    // Assert
    expect(processed).toEqual(expected)
  })

  it('should process mixed number and percentage value csv with month + year labels', () => {
    // Arrange
    const expected = {
      data: {
        testkey1: Array.from({ length: 4 }, (_, i) => ({
          header: endOfMonth(new Date(2023, 9 + i))
            .getTime()
            .toString(),
          value: (10 + i * 10) * (i % 2 === 0 ? 0.01 : 1),
        })),
        testkey2: Array.from({ length: 4 }, (_, i) => ({
          header: endOfMonth(new Date(2023, 9 + i))
            .getTime()
            .toString(),
          value: (10 + i * 10 + 2) / 100,
        })),
      },
    }

    const csv = `
        ,,,Okt 23, Nóv 23, Des 23, Jan 24
        testkey1,,,10%,20,30%,40
        testkey2,,,12%,22%,32%,42%
        `

    // Act
    const processed = processDataFromSource(csv)

    // Assert
    expect(processed).toEqual(expected)
  })

  it('should process number value csv with mixed labels', () => {
    // Arrange
    const expected = {
      data: {
        testkey1: Array.from({ length: 4 }, (_, i) => ({
          header: (i === 2
            ? endOfDay(new Date(2023, 11, 15))
            : endOfMonth(new Date(2023, 9 + i))
          )
            .getTime()
            .toString(),
          value: 10 + i * 10,
        })),
        testkey2: Array.from({ length: 4 }, (_, i) => ({
          header: (i === 2
            ? endOfDay(new Date(2023, 11, 15))
            : endOfMonth(new Date(2023, 9 + i))
          )
            .getTime()
            .toString(),
          value: 10 + i * 10 + 2,
        })),
      },
    }

    const csv = `
        ,,,Okt 23, Nóv 23, 2023-12-15, Jan 24
        testkey1,,,10,20,30,40
        testkey2,,,12,22,32,42
        `

    // Act
    const processed = processDataFromSource(csv)

    // Assert
    expect(processed).toEqual(expected)
  })

  it('should return null for empty columns', () => {
    // Arrange
    const expected = {
      data: {
        testkey1: Array.from({ length: 6 }, (_, i) => ({
          header: endOfMonth(new Date(2023, 9 + i))
            .getTime()
            .toString(),
          value: i < 4 ? 10 + i * 10 : null,
        })),
        testkey2: Array.from({ length: 6 }, (_, i) => ({
          header: endOfMonth(new Date(2023, 9 + i))
            .getTime()
            .toString(),
          value: i < 4 ? 10 + i * 10 : null,
        })),
      },
    }

    const csv = `
        ,,,Okt 23, Nóv 23, Des 23, Jan 24, Feb 24, Mar 24
        testkey1,,,10,20,30,40,,
        testkey2,,,10,20,30,40,   ,
        `

    // Act
    const processed = processDataFromSource(csv)

    // Assert
    expect(processed).toEqual(expected)
  })

  it('should handle non-date columns', () => {
    // Arrange
    const expected = {
      data: {
        testkey1: Array.from({ length: 4 }, (_, i) => ({
          header: String.fromCharCode(65 + i),
          value: 10 + i * 10,
        })),
        testkey2: Array.from({ length: 4 }, (_, i) => ({
          header: String.fromCharCode(65 + i),
          value: 10 + i * 10 + 2,
        })),
      },
    }

    const csv = `
        ,,,A, B, C, D
        testkey1,,,10,20,30,40
        testkey2,,,12,22,32,42
        `

    // Act
    const processed = processDataFromSource(csv)

    // Assert
    expect(processed).toEqual(expected)
  })

  it('should process numbers that are within strings and contain commas', () => {
    const startDate = new Date(2021, 11)

    const expectedNumberValues = [
      897, 1333, 1044, 1257, 1151, 1383, 4095, 3004, 3117, 3239, 3169, 2634,
      2345, 3696, 3515, 3342, 3067, 3537, 3733, 2813, 3200, 374, 662, 926, 770,
      996, 1001, 1025,
    ]

    const expected = {
      data: {
        test: expectedNumberValues.map((v, i) => ({
          header: addMonths(endOfMonth(startDate), i).getTime().toString(),
          value: v,
        })),
      },
    }

    const csv = `
        ,,,Des 21,Janúar 22,Febrúar 22,Mars 22,Apríl 22,Maí 22,Júní 22,Júlí 22,Ágúst 22,Sept 22,Október 22,Nóvember 22,Desember 22,Janúar 23,Febrúar 23,Mars 23,Apríl 23,Maí 23,Júní 23,Júlí 23,Ágúst 23,Sept 23,Okt 23,Nóv 23,Des 23,Jan 24,Feb 24,Mar 24
        test,,,897,"1,333","1,044","1,257","1,151","1,383","4,095","3,004","3,117","3,239","3,169","2,634","2,345","3,696","3,515","3,342","3,067","3,537","3,733","2,813","3,200",374,662,926,770,996,"1,001","1,025"
        `

    const processed = processDataFromSource(csv)

    expect(processed).toEqual(expected)
  })
})

describe('_tryToGetDate', () => {
  it.each([19, 20, 21, 22, 23, 24])('should work for month + year', (year) => {
    expect(_tryToGetDate(`Jan ${year}`)).toEqual(
      endOfMonth(new Date(2000 + year, 0)),
    )
    expect(_tryToGetDate(`${year} Jan`)).toEqual(
      endOfMonth(new Date(2000 + year, 0)),
    )
    expect(_tryToGetDate(`Feb ${year}`)).toEqual(
      endOfMonth(new Date(2000 + year, 1)),
    )
    expect(_tryToGetDate(`${year} Feb`)).toEqual(
      endOfMonth(new Date(2000 + year, 1)),
    )
    expect(_tryToGetDate(`Okt ${year}`)).toEqual(
      endOfMonth(new Date(2000 + year, 9)),
    )
    expect(_tryToGetDate(`${year} Okt`)).toEqual(
      endOfMonth(new Date(2000 + year, 9)),
    )
  })

  it('should work for yyyy-MM-dd', () => {
    for (let year = 2010; year <= 2024; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        // Arrange
        const daysInMonth = getDaysInMonth(new Date(year, month))
        for (let day = 1; day <= daysInMonth; day += 1) {
          const currentDate = endOfDay(new Date(year, month, day))
          const expected = format(currentDate, 'yyyy-MM-dd')
          const [y, m, d] = expected.split('-')

          // Act
          const result = _tryToGetDate(`${y}-${m}-${d}`)

          // Assert
          expect(result).toEqual(currentDate)
        }
      }
    }
  })

  it('should work for yyyy-MM-dd HH:mm', () => {
    const year = 2024
    const month = 1
    const day = 1

    for (let hour = 0; hour < 24; hour += 1) {
      for (let minute = 0; minute < 60; minute += 1) {
        // Arrange
        const currentDate = new Date(year, month, day, hour, minute)
        const expected = format(currentDate, 'yyyy-MM-dd HH:mm')
        const [y, m, rawDay] = expected.split('-')
        const [d, rawTime] = rawDay.split(' ')
        const [h, min] = rawTime.split(':')

        // Act
        const result = _tryToGetDate(`${y}-${m}-${d} ${h}:${min}`)

        // Assert
        expect(result).toEqual(currentDate)
      }
    }
  })
})

describe('splitCsvLine', () => {
  it('should split normal comma separted line', () => {
    // Arrange
    const line = '1,2,3,4'

    // Act
    const result = splitCsvLine(line)

    // Assert
    expect(result).toEqual(['1', '2', '3', '4'])
  })

  it('should split line with commas but skip commas in values surrounded by quotes', () => {
    // Arrange
    const line = '1,"2, 3",4'

    // Act
    const result = splitCsvLine(line)

    // Assert
    expect(result).toEqual(['1', '2, 3', '4'])
  })
})
