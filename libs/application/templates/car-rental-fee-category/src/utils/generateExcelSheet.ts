import XLSX from 'xlsx'
// Replace data type with return type from function that combines samgöngustofu data and skatturinn data
export const generateExcelSheet = (data: any): { 
    filename: string, 
    base64Content: string, 
    fileType: string
} => {
    // const sheetData = [
    // ['Bílnúmer', 'Tegund', 'Síðasta staða', 'Núverandi staða', 'Gjaldflokkur'], 
    // [data.LicencePlate, data.CarType, data.DrivenAmount, '', data.PaymentCategory]
    // ]
    const name = 'bilar.xlsx'
    const carTypes = [
      'Toyota', 'Honda', 'Ford', 'Mazda', 'Kia',
      'Hyundai', 'VW', 'Audi', 'BMW', 'Mercedes',
      'Peugeot', 'Renault', 'Citroen', 'Nissan', 'Subaru',
      'Suzuki', 'Volvo', 'Skoda', 'Fiat', 'Opel',
      'Chevrolet', 'Jeep', 'Lexus', 'Mini', 'Seat'
    ]
    
    const sheetData = [
      ['Bílnúmer', 'Tegund', 'Síðasta staða', 'Núverandi staða', 'Gjaldflokkur'],
      ...Array.from({ length: 10000 }, (_, i) => [
        randomCarNumber(),
        carTypes[i % carTypes.length],
        100000 + i * 1234,
        '',
        Math.random() > 0.5 ? 'Daggjald' : 'Kilometragjald',
      ]),
    ]

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData)
    const workbook: XLSX.WorkBook = {
        Sheets: { [name]: worksheet },
        SheetNames: [name],
    }

    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'base64',
    })
    return {
        filename: name,
        base64Content: excelBuffer,
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
}

const randomCarNumber = (): string => {
  const letters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('')
  const numbers = Math.floor(Math.random() * 90 + 10) // 10 to 99
  return `${letters}${numbers}`
}