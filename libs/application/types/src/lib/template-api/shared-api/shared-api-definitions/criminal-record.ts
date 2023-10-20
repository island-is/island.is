import { defineTemplateApi } from '../../TemplateApi'

export const ValidateCriminalRecordApi = defineTemplateApi({
  action: 'validateCriminalRecord',
  namespace: 'CriminalRecordShared',
})

export const GetCriminalRecordPDF = defineTemplateApi({
  action: 'getCriminalRecordPDF',
  namespace: 'CriminalRecordShared',
})
