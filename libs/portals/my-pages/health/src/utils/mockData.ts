import { IconProps } from '@island.is/island-ui/core'
import { HealthPaths } from '../lib/paths'
export interface Prescription {
  id: string
  medicineName: string
  instructions: string
  usedFor: string
  process: string
  validTo: string
  status: {
    type: 'renew' | 'tooltip'
    data: string
  }
}
export const MedicinePrescriptionsData: Prescription[] = [
  {
    id: '1',
    medicineName: 'Esomeprazol Actavis 40mg',
    usedFor: 'Verkir',
    instructions: '1 sinni á dag',
    process: 'Fullafgreitt',
    validTo: '01.02.2025',
    status: {
      type: 'tooltip',
      data: 'Sjálfvirk endurnýjun er ekki í boði fyrir þessa lyfjaávísun.',
    },
  },
  {
    id: '2',
    medicineName: 'Naltrexone hydrochloride-forskriftarlyf 1 mg/ml',
    instructions: '2 ml 1 sinni á dag',
    usedFor: 'Verkir',
    process: 'Fullafgreitt',
    validTo: '05.06.2025',
    status: {
      type: 'renew',
      data: HealthPaths.HealthCenter,
    },
  },
]

export const MedicinePrescriptionsHistoryData = [
  {
    id: '1',
    medicineName: 'Esomeprazol Actavis 40mg',
    usedFor: 'Verkir',
    lastDispensed: '01.02.2025',
    status: {
      type: 'tooltip',
      data: 'Sjálfvirk endurnýjun er ekki í boði fyrir þessa lyfjaávísun.',
    },
  },
  {
    id: '2',
    medicineName: 'Naltrexone hydrochloride-forskriftarlyf 1 mg/ml',
    usedFor: 'Verkir',
    lastDispensed: '05.06.2025',
    status: {
      type: 'renew',
      data: HealthPaths.HealthCenter,
    },
  },
]

interface MedicineDispense {
  title: string
  value: string
  icon: {
    type: IconProps['icon']
    color: IconProps['color']
  }
}

export const MedicineDispenseData: MedicineDispense[] = [
  {
    title: '1. afgreiðsla',
    value: 'Sótt í Árbæjarapótek 01.08.2023',
    icon: {
      type: 'checkmark',
      color: 'mint600',
    },
  },
  {
    title: '2. afgreiðsla',
    value: 'Laust til afgreiðslu frá: 03.04.2024',
    icon: {
      type: 'remove',
      color: 'dark300',
    },
  },
]

export interface MedicinePrescriptionDetail {
  title: string
  value?: string | number | React.ReactElement
  type?: 'text' | 'link'
  href?: string
}

export const MedicinePrescriptionDetailData: MedicinePrescriptionDetail[] = [
  {
    title: 'Lyf',
    type: 'link',
    href: HealthPaths.HealthMedicine,
    value: 'Esomeprazol Actavis 40mg',
  },
  {
    title: 'Tegund',
    value: 'Önnur lyf með verkun á taugakerfið',
  },
  {
    title: 'Notað við',
    value: 'Verkir',
  },
  {
    title: 'Ávísað magn',
    value: '100 ml',
  },
  {
    title: 'Notkun',
    value: '2 ml 1 sinni á dag',
  },
]

export const MedicinePrescriptionDetailData2: MedicinePrescriptionDetail[] = [
  {
    title: 'Útgáfudagur',
    value: '06.06.2024',
  },
  {
    title: 'Læknir',
    value: 'Gunnar Gunnarsson',
  },
  {
    title: 'Gildir til',
    value: '05.06.2025',
  },
]

export interface HealthCenter {
  id: string
  name: string
}

export const HealthCenterData = [
  {
    id: '1',
    name: 'Heilsugæsla Kópavogs',
  },
  {
    id: '2',
    name: 'Heilsugæsla Hafnarfjarðar',
  },
  {
    id: '3',
    name: 'Heilsugæsla Reykjavíkur',
  },
]
