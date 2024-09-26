import {
  buildSubSection,
  buildMultiField,
  buildRadioField,
  buildDescriptionField,
  buildTextField,
  buildFileUploadField,
} from '@island.is/application/core'

export const RentalHousingConditionInspection = buildSubSection({
  id: 'rentalHousingConditionInspection',
  title: 'Ástandsskoðun',
  children: [
    buildMultiField({
      id: 'rentalHousingConditionInspection',
      title: 'Ástand húsnæðis',
      description:
        'Leigusamningur þarf lögum samkvæmt að innihalda ástandsúttekt á húsnæðinu. Sú úttekt þarf að fara fram við samningsgerðina. Gott er að skoða húsnæðið gaumgæfilega og taka myndir af ástandi. Sjá nánar hér.',
      children: [
        buildRadioField({
          id: 'rentalHousingConditionInspectionRadio',
          title: 'Framkvæmdaraðili ástandsskoðunar',
          width: 'half',
          description:
            'Athugið að aðilar geta sjálfir gert ástandsúttekt eða fengið óháðan aðila til þess og þá skiptist kostnaðurinn við það jafnt á milli aðila.',
          options: [
            { value: 'contractParties', label: 'Samningsaðilar' },
            { value: 'independentParty', label: 'Óháður aðili' },
          ],
        }),
        buildDescriptionField({
          id: 'rentalHousingConditionInspectionTitle',
          title: 'Niðurstöður ástandsúttektar',
          description:
            'Hér á að setja inn helstu niðurstöður ástandsúttektar. Gott er að taka myndir af þeim atriðum sem skipta máli. Ef óháður aðili hefur framkvæmt úttektina má setja niðurstöðurnar með sem fylgiskjal.',
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'rentalHousingConditionInspectionTextInput',
          title: 'Ástandsúttekt',
          variant: 'textarea',
          placeholder: 'Skrifaður hér allt sem á við',
        }),
        buildFileUploadField({
          id: 'rentalHousingConditionInspectionFileUpload',
          title: 'Dragðu skjöl hingað til að hlaða upp',
          uploadDescription:
            'Tekið er við skjölum með endingu: .png, .jpg, .jpeg, .pdf, .docx, .rtf. \nSkjöl geta ekki verið stærri en 0 mb og ekki fleiri en 0.',
          uploadMultiple: true,
        }),
      ],
    }),
  ],
})
