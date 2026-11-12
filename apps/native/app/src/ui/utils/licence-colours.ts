import { GenericLicenseType } from '../../graphql/types/schema'

// Licence artwork colours: the fill under each licence's background image and
// the barcode skeleton that matches it while loading. They follow the artwork,
// not the Brand Guide, so this file is exempt from the colour lint.
type LicenceColours = {
  background: string
  barcode?: {
    background: string
    overlay: string
  }
}

export const licenceColours: Record<GenericLicenseType, LicenceColours> = {
  DriversLicense: {
    background: '#F5E4EC',
    barcode: {
      background: '#F5EAEF',
      overlay: '#F0DDE5',
    },
  },
  AdrLicense: {
    background: '#F2FAEC',
    barcode: {
      background: '#FAFDF7',
      overlay: '#F4FCEE',
    },
  },
  MachineLicense: {
    background: '#C5E6AF',
    barcode: {
      background: '#DEF1D1',
      overlay: '#C8E6B3',
    },
  },
  FirearmLicense: {
    background: '#EBEBF2',
    barcode: {
      background: '#FDFDF7',
      overlay: '#FAFAEB',
    },
  },
  HuntingLicense: {
    background: '#E2EDFF',
    barcode: {
      background: '#DBECF4',
      overlay: '#B3D3E3',
    },
  },
  Ehic: {
    background: '#B9C1E6',
  },
  DisabilityLicense: {
    background: '#C5D5C8',
    barcode: {
      background: '#D7E3D7',
      overlay: '#A0BAA2',
    },
  },
  PCard: {
    background: '#F2F7FF',
  },
  Passport: {
    background: '#CACFE4',
  },
  IdentityDocument: {
    background: '#C5E3F2',
  },
}

// Drawn on the scan result card's artwork, the same for every licence
export const scanResultColours = {
  imageBackground: '#e2c4d1',
  label: '#8D6679',
  divider: 'rgba(98, 80, 88, 1)',
  photo: 'rgba(255, 255, 255, 0.2)',
}

// Veil over the barcode while it is offline or failed to load
export const licenceBarcodeVeil = 'rgba(255, 255, 255, 0.4)'
