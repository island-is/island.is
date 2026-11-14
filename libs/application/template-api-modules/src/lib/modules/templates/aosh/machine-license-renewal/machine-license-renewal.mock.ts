import { MachineLicenseRights } from '@island.is/application/templates/aosh/machine-license-renewal'

export const mockMachineLicenseRights: MachineLicenseRights = {
  licenseNumber: 'V36284',
  renewableRights: [
    {
      flokkur: 'D',
      fulltHeiti: 'Körfukranar og steypudælur',
      stjorna: '2027-03-15',
    },
    {
      flokkur: 'P',
      fulltHeiti: 'Hleðslukranar',
      stjorna: '2027-03-15',
    },
  ],
  otherRights: [
    {
      flokkur: 'E',
      fulltHeiti: 'Gröfur og lyftur yfir 4 tonnum',
      stjorna: '2049-09-20',
    },
    {
      flokkur: 'F',
      fulltHeiti: 'Ámokstursskóflur yfir 4 tonnum',
      stjorna: '2049-09-20',
    },
    {
      flokkur: 'G',
      fulltHeiti: 'Jarðýtur og borvagnar yfir 4 tonn',
      stjorna: '2049-09-20',
    },
    { flokkur: 'I', fulltHeiti: 'Dráttarvélar', stjorna: '2049-09-20' },
    { flokkur: 'J', fulltHeiti: 'Lyftarar', stjorna: '2049-09-20' },
    {
      flokkur: 'K',
      fulltHeiti: 'Lyftarar yfir 10 tonn',
      stjorna: '2049-09-20',
    },
    { flokkur: 'L', fulltHeiti: 'Valtarar', stjorna: '2049-09-20' },
  ],
}
