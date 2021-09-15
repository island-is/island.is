import chunk from 'lodash/chunk'
import { format as formatKennitala } from 'kennitala'
import amountFormat from './amountFormat'
import { messages } from '../lib/messages'
import { FormatMessage } from '@island.is/application/core'

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

const unitsArray = (data: Fasteign, formatMessage: FormatMessage) =>
  data?.notkunareiningar?.data?.map((unit: Notkunareining) => {
    return {
      header: {
        title: formatMessage(messages.housing),
        value: unit.stadfang?.display || '',
      },
      rows: chunk(
        [
          {
            title: formatMessage(messages.unitsOfUse),
            value: unit.notkunareininganr || '',
          },
          {
            title: formatMessage(messages.currentAppraisal),
            value: unit.fasteignamat?.gildandi
              ? amountFormat(unit.fasteignamat.gildandi)
              : '',
          },
          {
            title: formatMessage(messages.location),
            value: unit.stadfang?.displayShort || '',
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
            value: unit.stadfang?.sveitarfelag || '',
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
