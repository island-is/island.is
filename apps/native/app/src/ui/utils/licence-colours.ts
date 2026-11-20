import { GenericLicenseType } from '../../graphql/types/schema'
import { blue100, blue200, blue400, dark400, white } from './colors'

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

export const licenceBarcodeBackground = white

// Every licence background above is light, in both themes, because the
// artwork does not follow the colour scheme. So the text on it has to stay
// dark: a theme-dependent foreground turns near-white in dark mode and drops
// to 1.4:1 on the artwork.
export const licenceForeground = dark400

// Accent on the artwork, for spinners and icons. Fixed for the same reason.
export const licenceAccent = blue400

// For licences with no artwork colours of their own. Light for the same
// reason: a theme token here would turn the card dark under dark text.
export const licenceFallback = {
  background: blue100,
  barcodeOverlay: blue200,
}
