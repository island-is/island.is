import { IndexableObject } from '../utils/interfaces'

export const FILE_SIZE_LIMIT = 10000000

export const predefinedHeaders: IndexableObject = {
  0: ['nafn', 'name'],
  1: ['kennitala', 'ssn'],
  2: ['netfang', 'email'],
  3: ['simi', 'phone'],
  4: ['okuskirteini', 'licenseNumber'],
  5: ['utgafuland', 'countryOfIssuer'],
}

export const CSV_FILE = `data:text/csv;charset=utf-8,nafn;kennitala;netfang;simi;okuskirteini;utgafuland\nNafn hér;0101302989;netfang@netfang.com;0102399;024029949;Ísland`
