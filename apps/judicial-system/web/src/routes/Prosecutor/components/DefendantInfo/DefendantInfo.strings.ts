import { defineMessage } from 'react-intl'

export const defendantInfo = {
  doesNotHaveIcelandicNationalId: defineMessage({
    id:
      'judicial.system.core:defendant_info.does_not_have_icelandic_national_id_v2',
    defaultMessage:
      '{isIndictment, select, true {Ákærði} other {Varnaraðili}} er ekki með íslenska kennitölu',
    description:
      'Notaður sem texti sem notaður er til að segja að einstaklingur er ekki með íslenska kennitölu',
  }),
}
