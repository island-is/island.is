import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'

export function getPersonalElectionFileName(
  nationalId: string,
  electionType: number | undefined,
  dateString: string | undefined,
  noValueStatement: boolean,
): string {
  // TegundViðskiptavinar-Kennitala-TegundKosninga-ÁrtalMánuðurKosninga-Y
  // Dæmi: 1-2808705799-3-2020-08-Y.pdf
  // TegundViðskiptavinar-Kennitala-TegundKosninga-ÁrtalMánuðurKosninga
  // Dæmi: 1-2808705799-3-2020-08.pdf

  const electionTypePlaceholder = (() => {
    switch (electionType) {
      case 150000000: {
        return '1'
      }
      case 150000001: {
        return '2'
      }
      case 150000002: {
        return '3'
      }
      default: {
        return '0'
      }
    }
  })()

  let formattedDate = ''
  if (dateString) {
    const electionDate = parseISO(dateString)
    formattedDate = format(electionDate, 'yyyy-MM')
  }

  return `1-${nationalId}-${electionTypePlaceholder}-${formattedDate}${
    noValueStatement ? '-Y' : ''
  }.pdf`
}

export function getPoliticalPartyFileName(
  nationalId: string,
  year: string,
): string {
  // TegundViðskiptavinar-Kennitala-RekstrarAr
  // Dæmi: 2-5702691439-2020.pdf

  return `2-${nationalId}-${year}.pdf`
}

export function getCemeteryFileName(nationalId: string, year: string): string {
  // TegundViðskiptavinar-Kennitala-RekstrarAr
  // Dæmi: 3-6702895169-2020.pdf

  return `3-${nationalId}-${year}.pdf`
}
