import { LanguageType } from '../languageType.model'

const valueTypeAttributeToLanguageType: Record<string, LanguageType> = {
  text: { is: 'Texti', en: 'Text' },
  number: { is: 'Tala', en: 'Number' },
  date: { is: 'Dagsetning', en: 'Date' },
  listValue: { is: 'Listagildi', en: 'List value' },
  nationalId: { is: 'Kennitala', en: 'National ID' },
  name: { is: 'Nafn', en: 'Name' },
  address: { is: 'Heimilisfang', en: 'Address' },
  postalCode: { is: 'Póstnúmer', en: 'Postal code' },
  municipality: { is: 'Sveitarfélag', en: 'Municipality' },
  jobTitle: { is: 'Starfsheiti', en: 'Job title' },
  altName: { is: 'Annað nafn', en: 'Alternative name' },
  homestayNumber: { is: 'Gististaðanúmer', en: 'Homestay number' },
  propertyNumber: { is: 'Fasteignanúmer', en: 'Property number' },
  totalDays: { is: 'Heildarfjöldi daga', en: 'Total days' },
  totalAmount: { is: 'Heildarupphæð', en: 'Total amount' },
  year: { is: 'Ár', en: 'Year' },
  isNullReport: { is: 'Engin skýrsla', en: 'Null report' },
  months: { is: 'Mánuðir', en: 'Months' },
  email: { is: 'Netfang', en: 'Email' },
  iskNumber: { is: 'ISK númer', en: 'ISK number' },
  checkboxValue: { is: 'Gátreitur', en: 'Checkbox value' },
  phoneNumber: { is: 'Símanúmer', en: 'Phone number' },
  bankAccount: { is: 'Bankareikningur', en: 'Bank account' },
  time: { is: 'Tími', en: 'Time' },
  s3Key: { is: 'S3 lykill', en: 'S3 key' },
  s3Url: { is: 'S3 slóð', en: 'S3 url' },
  paymentCode: { is: 'Greiðslukóði', en: 'Payment code' },
  delegationType: { is: 'Umboðstegund', en: 'Delegation type' },
  isLoggedInUser: { is: 'Er innskráður notandi', en: 'Is logged in user' },
}

// Helper function to get the LanguageType for a given ValueType attribute
export const getLanguageTypeForValueTypeAttribute = (
  attribute: string,
): LanguageType => {
  const result = valueTypeAttributeToLanguageType[attribute]
  return result ? result : { is: 'gildi', en: 'value' }
}
