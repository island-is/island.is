import { isNumber, sanitizeInput } from '../utils'
import * as NationalId from 'kennitala'
import { Period } from '../interfaces'

export const directTaxPaymentRequest = (
  agentNationalId: string,
  agentId: string,
  url: string,
  requesterNationalId: string,
  from: Period,
  to: Period,
) => {
  sanitizeInput(from.year.toString(), (i) => i.length === 4 && isNumber(i))
  sanitizeInput(to.year.toString(), (i) => i.length === 4 && isNumber(i))
  sanitizeInput(requesterNationalId, (i) => NationalId.isPerson(i))
  sanitizeInput(from.month.toString(), (i) => i.length <= 2 && isNumber(i))
  sanitizeInput(to.month.toString(), (i) => i.length <= 2 && isNumber(i))
  return `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:ns="http://skattur.is/UmbodsmadurSkuldaraThjonusta/2010/12/23">
  <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action>http://tempuri.org/IUSStadgreidslaFramtalGogn/SaekjaSundurlidanir</wsa:Action><wsa:To>${url}</wsa:To></soap:Header>
  <soap:Body>
     <tem:SaekjaSundurlidanir>
        <!--Optional:-->
        <tem:inntak>
           <ns:KennitalaUmbodsmanns>${agentNationalId}</ns:KennitalaUmbodsmanns>
           <ns:AudkenniUmbodsmanns>${agentId}</ns:AudkenniUmbodsmanns>
           <ns:KennitalaSkuldara>${NationalId.clean(
             requesterNationalId,
           )}</ns:KennitalaSkuldara>
           <!--Optional:-->
           <ns:KennitalaSkuldaraMaki/>
           <ns:ArFra>${from.year}</ns:ArFra>
           <ns:TimabilFra>${from.month}</ns:TimabilFra>
           <ns:ArTil>${to.year}</ns:ArTil>
           <ns:TimabilTil>${to.month}</ns:TimabilTil>
        </tem:inntak>
     </tem:SaekjaSundurlidanir>
  </soap:Body>
</soap:Envelope>`
}
