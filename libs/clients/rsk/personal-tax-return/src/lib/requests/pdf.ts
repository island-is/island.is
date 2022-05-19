import { isNumber, sanitizeInput } from '../utils'
import * as NationalId from 'kennitala'

export const pdfRequest = (
  agentNationalId: string,
  agentId: string,
  url: string,
  requesterNationalId: string,
  year: number,
) => {
  sanitizeInput(year.toString(), (i) => i.length === 4 && isNumber(i))
  sanitizeInput(requesterNationalId, (i) => NationalId.isPerson(i))
  return `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:ns="http://skattur.is/UmbodsmadurSkuldaraThjonusta/2011/01/03">
  <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action>http://tempuri.org/IUSStadgreidslaFramtalGogn/SaekjaPDFAfritFramtalsEinstaklings</wsa:Action><wsa:To>${url}</wsa:To></soap:Header>
  <soap:Body>
     <tem:SaekjaPDFAfritFramtalsEinstaklings>
        <!--Optional:-->
        <tem:inntak>
           <ns:KennitalaUmbodsmanns>${agentNationalId}</ns:KennitalaUmbodsmanns>
           <ns:AudkenniUmbodsmanns>${agentId}</ns:AudkenniUmbodsmanns>
           <ns:KennitalaSkuldara>${NationalId.sanitize(
             requesterNationalId,
           )}</ns:KennitalaSkuldara>
           <ns:Tekjuar>${year}</ns:Tekjuar>
        </tem:inntak>
     </tem:SaekjaPDFAfritFramtalsEinstaklings>
  </soap:Body>
</soap:Envelope>`
}
