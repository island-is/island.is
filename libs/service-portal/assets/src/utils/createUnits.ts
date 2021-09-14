import chunk from 'lodash/chunk'
import { format as formatKennitala } from 'kennitala'
import { useLocale } from '@island.is/localization'
import amountFormat from './amountFormat'
import { messages } from '../messages'

import { Fasteign, Notkunareining } from '../types/RealEstateAssets.types'

const ownersArray = (data: Fasteign) => {
  const ownerArray = data?.thinglystirEigendur?.map((owner) => {
    return [
      owner.nafn || '',
      formatKennitala(owner.kennitala) || '',
      owner.heimild || '',
      owner.display || '',
      '-',
    ]
  })
  return ownerArray && ownerArray.length > 0 ? ownerArray : [[]]
}

const unitsArray = (data: Fasteign) =>
  data?.notkunareiningar?.data?.map((unit: Notkunareining) => {
    const { formatMessage } = useLocale()
    return {
      header: {
        title: formatMessage(messages.legalOwners),
        value: unit.stadfang.display || '',
      },
      rows: chunk(
        [
          {
            title: formatMessage(messages.unitsOfUse),
            value: unit.notkunareininganr || '',
          },
          {
            title: formatMessage(messages.currentAppraisal),
            value: amountFormat(unit.fasteignamat.gildandi) || '',
          },
          {
            title: formatMessage(messages.location),
            value: unit.stadfang.displayShort || '',
          },
          {
            title: `${formatMessage(messages.futureAppraisal)} ${
              unit.fasteignamat.fyrirhugadAr
            }`,
            value: unit.fasteignamat.fyrirhugad
              ? amountFormat(unit.fasteignamat.fyrirhugad)
              : '',
          },
          {
            title: formatMessage(messages.marking),
            value: unit.merking || '',
          },
          // {
          //   title: 'Húsmat',
          //   value: unit.husmat?! || '',
          // },
          {
            title: formatMessage(messages.municipality),
            value: unit.stadfang.sveitarfelag || '',
          },
          {
            title: formatMessage(messages.siteAssessment),
            value: unit.lodarmat ? amountFormat(unit.lodarmat) : '',
          },
          {
            title: formatMessage(messages.usage),
            value: unit.notkun || '',
          },
          {
            title: formatMessage(messages.fireCompAssessment),
            value: unit.brunabotamat ? amountFormat(unit.brunabotamat) : '',
          },
          {
            title: formatMessage(messages.operation),
            value: unit.starfsemi || '',
          },
        ],
        2,
      ),
    }
  })

export { unitsArray, ownersArray }
