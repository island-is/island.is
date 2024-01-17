export function randomPoliceCaseNumber() {
  return `007-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`
}

export function randomCourtCaseNumber() {
  return `R-${Math.floor(Math.random() * 1000)}/${new Date().getFullYear()}`
}

export function randomAppealCaseNumber() {
  return `${Math.floor(Math.random() * 1000)}/${new Date().getFullYear()}`
}

export async function createFakePdf(title: string) {
  return {
    name: title,
    mimeType: 'application/pdf',
    buffer: Buffer.from(new ArrayBuffer(0)),
  }
}
