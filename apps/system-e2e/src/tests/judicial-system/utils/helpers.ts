export function randomPoliceCaseNumber() {
  return `007-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`
}

export function randomCourtCaseNumber() {
  return `R-${Math.floor(Math.random() * 1000)}/${new Date().getFullYear()}`
}

export function randomAppealCaseNumber() {
  return `${Math.floor(Math.random() * 1000)}/${new Date().getFullYear()}`
}

export function getDaysFromNow(days = 0) {
  const day = 24 * 60 * 60 * 1000
  const daysAdded = day * days

  return new Date(new Date().getTime() + daysAdded).toLocaleDateString('is-IS')
}

export async function createFakePdf(title: string) {
  return {
    name: title,
    mimeType: 'application/pdf',
    buffer: Buffer.from(new ArrayBuffer(0)),
  }
}
