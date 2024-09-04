import { HealthPaths } from '../../../lib/paths'

export const MedicinePrescriptionsData = [
  {
    id: '1',
    medicineName: 'Esomeprazol Actavis 40mg',
    usedFor: 'Verkir',
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
    usedFor: 'Verkir',
    process: 'Fullafgreitt',
    validTo: '05.06.2025',
    status: {
      type: 'renew',
      data: HealthPaths.HealthCenter,
    },
  },
]
