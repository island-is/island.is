import chunk from 'lodash/chunk'
import { format as formatKennitala } from 'kennitala'
import amountFormat from './amountFormat'
import { messages } from '../lib/messages'
import { FormatMessage } from '@island.is/application/core'

import { Notkunareining, ThinglysturEigandi } from '@island.is/clients/assets'
import is from 'date-fns/locale/is'
import format from 'date-fns/format'
import { isNumber } from 'lodash'

const ownersArray = (data: ThinglysturEigandi[] | undefined) => {
  const ownerArray = data?.map((owner) => {
    return [
      owner.nafn || '',
      owner.kennitala ? formatKennitala(owner.kennitala) : '',
      owner.heimildBirting || '',
      isNumber(owner.eignarhlutfall)
        ? `${parseFloat((owner.eignarhlutfall * 100).toFixed(2))}%`
        : '',
      owner.kaupdagur
        ? format(new Date(owner.kaupdagur), 'dd.MM.yyyy', {
            locale: is,
          })
        : '',
    ]
  })
  return ownerArray && ownerArray.length > 0 ? ownerArray : [[]]
}

const unitsArray = (
  data: Notkunareining[] | undefined,
  formatMessage: FormatMessage,
) =>
  data?.map((unit: Notkunareining) => {
    return {
      header: {
        title: formatMessage(messages.housing),
        value: unit.stadfang?.birting || '',
      },
      rows: chunk(
        [
          {
            title: formatMessage(messages.unitsOfUse),
            value: unit.notkunareininganumer || '',
          },
          {
            title: formatMessage(messages.currentAppraisal),
            value: unit.fasteignamat?.gildandiFasteignamat
              ? amountFormat(unit.fasteignamat.gildandiFasteignamat)
              : '',
          },
          {
            title: formatMessage(messages.location),
            value: unit.stadfang?.birtingStutt || '',
          },
          {
            title: `${formatMessage(messages.futureAppraisal)} ${
              unit?.fasteignamat?.fyrirhugadAr
            }`,
            value: unit?.fasteignamat?.fyrirhugadFasteignamat
              ? amountFormat(unit.fasteignamat.fyrirhugadFasteignamat)
              : '',
          },
          {
            title: formatMessage(messages.marking),
            value: unit.merking || '',
          },
          {
            title: formatMessage(messages.municipality),
            value: unit.stadfang?.sveitarfelagBirting || '',
          },
          // {
          //   title: formatMessage(messages.siteAssessment),
          //   value: unit.lodarmat ? amountFormat(unit.lodarmat) : '',
          // },
          {
            title: formatMessage(messages.usage),
            value: unit.notkunBirting || '',
          },
          {
            title: formatMessage(messages.fireCompAssessment),
            value: unit.brunabotamat ? amountFormat(unit.brunabotamat) : '',
          },
          // {
          //   title: formatMessage(messages.operation),
          //   value: unit.starfsemi || '',
          // },
          {
            title: 'Stærð',
            value: `${unit.birtStaerd} m²` || '',
          },
          {
            title: 'Byggingarár',
            value: unit.byggingararBirting || '',
          },
        ],
        2,
      ),
    }
  })

export { unitsArray, ownersArray }
