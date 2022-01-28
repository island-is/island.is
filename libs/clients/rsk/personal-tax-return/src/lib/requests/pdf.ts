export const pdfRequest = (
  agentNationalId: string,
  agentId: string,
  requesterNationalId: string,
  year: string,
) => {
  return `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:ns="http://skattur.is/UmbodsmadurSkuldaraThjonusta/2011/01/03">
  <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action>http://tempuri.org/IUSStadgreidslaFramtalGogn/SaekjaPDFAfritFramtalsEinstaklings</wsa:Action><wsa:To>https://vefurp.rsk.is/ws/securep/UMS/WS/USStadgreidslaFramtalGogn.svc</wsa:To></soap:Header>
  <soap:Body>
     <tem:SaekjaPDFAfritFramtalsEinstaklings>
        <!--Optional:-->
        <tem:inntak>
           <ns:KennitalaUmbodsmanns>${agentNationalId}</ns:KennitalaUmbodsmanns>
           <ns:AudkenniUmbodsmanns>${agentId}</ns:AudkenniUmbodsmanns>
           <ns:KennitalaSkuldara>${requesterNationalId}</ns:KennitalaSkuldara>
           <ns:Tekjuar>${year}</ns:Tekjuar>
        </tem:inntak>
     </tem:SaekjaPDFAfritFramtalsEinstaklings>
  </soap:Body>
</soap:Envelope>`
}
