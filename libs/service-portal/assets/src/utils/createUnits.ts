import chunk from 'lodash/chunk'
import { format as formatKennitala } from 'kennitala'
import amountFormat from './amountFormat'

import { Fasteign, Notkunareining } from '../types/RealEstateAssets.types'

const ownersArray = (data: Fasteign) =>
  data?.thinglystirEigendur?.map((owner) => {
    return [
      owner.nafn || '',
      formatKennitala(owner.kennitala) || '',
      owner.heimild || '',
      owner.display || '',
      'NOT AVAILABLE',
    ]
  })

const unitsArray = (data: Fasteign) =>
  data?.notkunareiningar?.data?.map((unit: Notkunareining) => {
    return {
      header: {
        title: 'Notkunareiningar',
        value: unit.stadfang.display || '',
      },
      rows: chunk(
        [
          {
            title: 'Notkunareiningarnúmer',
            value: unit.notkunareininganr || '',
          },
          {
            title: 'Gildandi fasteignamat',
            value: amountFormat(unit.fasteignamat.gildandi) || '',
          },
          {
            title: 'Staðfang',
            value: unit.stadfang.displayShort || '',
          },
          {
            title: 'Fyrirhugað fasteignamat 2022',
            value: unit.fasteignamat.fyrirhugad
              ? amountFormat(unit.fasteignamat.fyrirhugad)
              : '',
          },
          {
            title: 'Merking',
            value: unit.merking || '',
          },
          // {
          //   title: 'Húsmat',
          //   value: unit.husmat?! || '',
          // },
          {
            title: 'Sveitarfélag',
            value: unit.stadfang.sveitarfelag || '',
          },
          {
            title: 'Lóðarmat',
            value: unit.lodarmat ? amountFormat(unit.lodarmat) : '',
          },
          {
            title: 'Notkun',
            value: unit.notkun || '',
          },
          {
            title: 'Brunabótamat',
            value: unit.brunabotamat ? amountFormat(unit.brunabotamat) : '',
          },
          {
            title: 'Starfsemi',
            value: unit.starfsemi || '',
          },
        ],
        2,
      ),
    }
  })

export { unitsArray, ownersArray }
