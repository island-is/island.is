import { Permit } from '../models/approvals/approvals.model'
import { Country } from '../models/approvals/country.model'
import { PermitCodesEnum, PermitStatusEnum } from '../models/enums'

export const permitData: Permit[] = [
  {
    id: '1',
    status: PermitStatusEnum.active,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    validFrom: new Date('2024-01-02T12:00:00Z'),
    validTo: new Date('2026-01-02T12:00:00Z'),
    codes: [PermitCodesEnum.PatientSummary],
    countries: [
      {
        code: 'FR',
        name: 'Frakkland',
        id: '9b9b79ec-ef25-409d-839b-33eaf5b556e3',
      },
      {
        code: 'DE',
        name: 'Þýskaland',
        id: 'a1b2c3d4-ef25-409d-839b-33eaf5b556e4',
      },
      {
        code: 'IT',
        name: 'Ítalía',
        id: 'b2c3d4e5-ef25-409d-839b-33eaf5b556e5',
      },
      {
        code: 'ES',
        name: 'Spánn',
        id: 'c3d4e5f6-ef25-409d-839b-33eaf5b556e6',
      },
      {
        code: 'SE',
        name: 'Svíþjóð',
        id: 'd4e5f6g7-ef25-409d-839b-33eaf5b556e7',
      },
      {
        code: 'NO',
        name: 'Noregur',
        id: 'e5f6g7h8-ef25-409d-839b-33eaf5b556e8',
      },
      {
        code: 'DK',
        name: 'Danmörk',
        id: 'f6g7h8i9-ef25-409d-839b-33eaf5b556e9',
      },
      {
        code: 'FI',
        name: 'Finnland',
        id: 'g7h8i9j0-ef25-409d-839b-33eaf5b556e0',
      },
      {
        code: 'NL',
        name: 'Holland',
        id: 'h8i9j0k1-ef25-409d-839b-33eaf5b556e1',
      },
      {
        code: 'BE',
        name: 'Belgía',
        id: 'i9j0k1l2-ef25-409d-839b-33eaf5b556e2',
      },
      {
        code: 'AT',
        name: 'Austurríki',
        id: 'j0k1l2m3-ef25-409d-839b-33eaf5b556e3',
      },
      {
        code: 'CH',
        name: 'Sviss',
        id: 'k1l2m3n4-ef25-409d-839b-33eaf5b556e4',
      },
      {
        code: 'PL',
        name: 'Pólland',
        id: 'l2m3n4o5-ef25-409d-839b-33eaf5b556e5',
      },
      {
        code: 'PT',
        name: 'Portúgal',
        id: 'm3n4o5p6-ef25-409d-839b-33eaf5b556e6',
      },
      {
        code: 'IE',
        name: 'Írland',
        id: 'n4o5p6q7-ef25-409d-839b-33eaf5b556e7',
      },
    ],
  },
  {
    id: '2',
    status: PermitStatusEnum.inactive,
    createdAt: new Date('2025-02-06T10:00:00Z'),
    validFrom: new Date('2025-02-06T12:00:00Z'),
    validTo: new Date('2025-06-06T12:00:00Z'),
    codes: [PermitCodesEnum.PatientSummary],
    countries: [
      {
        code: 'FR',
        name: 'Frakkland',
        id: '9b9b79ec-ef25-409d-839b-33eaf5b556e3',
      },
      {
        code: 'DE',
        name: 'Þýskaland',
        id: 'a1b2c3d4-ef25-409d-839b-33eaf5b556e4',
      },
      {
        code: 'IT',
        name: 'Ítalía',
        id: 'b2c3d4e5-ef25-409d-839b-33eaf5b556e5',
      },
      {
        code: 'ES',
        name: 'Spánn',
        id: 'c3d4e5f6-ef25-409d-839b-33eaf5b556e6',
      },
    ],
  },
  {
    id: '3',
    status: PermitStatusEnum.expired,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    validFrom: new Date('2024-01-02T12:00:00Z'),
    validTo: new Date('2025-01-02T12:00:00Z'),
    codes: [PermitCodesEnum.PatientSummary],
    countries: [
      {
        code: 'FR',
        name: 'Frakkland',
        id: '9b9b79ec-ef25-409d-839b-33eaf5b556e3',
      },
    ],
  },
]

export const europeanCountriesIs: Country[] = [
  { id: '1', code: 'AT', name: 'Austurríki' },
  { id: '2', code: 'BE', name: 'Belgía' },
  { id: '3', code: 'BG', name: 'Búlgaría' },
  { id: '4', code: 'DK', name: 'Danmörk' },
  { id: '5', code: 'EE', name: 'Eistland' },
  { id: '6', code: 'FI', name: 'Finnland' },
  { id: '7', code: 'FR', name: 'Frakkland' },
  { id: '8', code: 'GR', name: 'Grikkland' },
  { id: '9', code: 'IE', name: 'Írland' },
  { id: '10', code: 'IT', name: 'Ítalía' },
  { id: '11', code: 'LV', name: 'Lettland' },
  { id: '12', code: 'LI', name: 'Liechtenstein' },
  { id: '13', code: 'LT', name: 'Litháen' },
  { id: '14', code: 'LU', name: 'Lúxemborg' },
  { id: '15', code: 'MT', name: 'Malta' },
  { id: '16', code: 'NL', name: 'Holland' },
  { id: '17', code: 'DE', name: 'Þýskaland' },
  { id: '18', code: 'PL', name: 'Pólland' },
  { id: '19', code: 'PT', name: 'Portúgal' },
  { id: '20', code: 'RO', name: 'Rúmenía' },
  { id: '21', code: 'SK', name: 'Slóvakía' },
  { id: '22', code: 'SI', name: 'Slóvenía' },
  { id: '23', code: 'ES', name: 'Spánn' },
  { id: '24', code: 'HR', name: 'Króatía' },
  { id: '25', code: 'CY', name: 'Kýpur' },
  { id: '26', code: 'CZ', name: 'Tékkland' },
  { id: '27', code: 'HU', name: 'Ungverjaland' },
]
