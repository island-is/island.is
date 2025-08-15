import {
  DirectGrantPaymentConfirmationInput,
  MemorialCardPaymentConfirmationInput,
} from './dto/paymentConfirmation.input'

export const generateMemorialCardPaymentConfirmationEmailMessage = (
  input: MemorialCardPaymentConfirmationInput,
) => {
  const lines: string[] = []

  lines.push(`Minningarsjóður: ${input.fundChargeItemCode}`) // TODO: Perhaps send the name of the fund and not the "id"?
  lines.push(`Til minningar um: ${input.inMemoryOf}`)
  lines.push(`Fjárhæð: ${input.amountISK} krónur`)
  lines.push(`Undirskrift sendanda: ${input.senderSignature}`)

  lines.push(`Nafn viðtakanda korts: ${input.recipientName}`)
  lines.push(`Heimilisfang viðtakanda korts: ${input.recipientAddress}`)
  lines.push(`Póstnúmer viðtakanda korts: ${input.recipientPostalCode}`)
  lines.push(`Staður viðtakanda korts: ${input.recipientPlace}`)

  lines.push(`Nafn greiðanda: ${input.payerName}`)
  lines.push(`Netfang greiðanda: ${input.payerEmail}`)
  lines.push(`Kennitala greiðanda: ${input.payerNationalId}`)
  lines.push(`Heimilisfang greiðanda: ${input.payerAddress}`)
  lines.push(`Póstnúmer greiðanda: ${input.payerPostalCode}`)
  lines.push(`Staður greiðanda: ${input.payerPlace}`)

  return lines.join('\n')
}

export const generateDirectGrantPaymentConfirmationEmailMessage = (
  input: DirectGrantPaymentConfirmationInput,
) => {
  const lines: string[] = []

  lines.push(`Styrktarsjóður: ${input.grantChargeItemCode}`) // TODO: Perhaps send the name of the grant and not the "id"?
  lines.push(`Verkefni: ${input.project}`)
  lines.push(`Fjárhæð: ${input.amountISK}`)

  lines.push(`Nafn greiðanda: ${input.payerName}`)
  lines.push(`Netfang greiðanda: ${input.payerEmail}`)
  lines.push(`Kennitala greiðanda: ${input.payerNationalId}`)
  lines.push(`Heimilisfang greiðanda: ${input.payerAddress}`)
  lines.push(`Póstnúmer greiðanda: ${input.payerPostalCode}`)
  lines.push(`Staður greiðanda: ${input.payerPlace}`)

  lines.push(`Skýring á styrk: ${input.payerGrantExplanation}`)

  return lines.join('\n')
}
