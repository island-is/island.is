import {
  buildCheckboxField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Comparators,
  Form,
  FormModes,
  FormValue,
  buildRepeater,
  buildDataProviderItem,
  buildExternalDataProvider,
} from '@island.is/application/core'
import { m } from './messages'

export const ChildrenDomicileTransferForm: Form = buildForm({
  id: 'ChildrenDomicileTransferFormDraft',
  title: 'Flutningur lögheimilis',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'dataGathering',
      title: "Gagnaöflun",
      children: [
        buildTextField({
          id: 'person.name',
          title: m.name,
        }),
        // buildSubSection({
        //   id: 'externalData',
        //   title: m.introSection,
        //   children: [
        //     buildExternalDataProvider({
        //       title: m.introSection,
        //       id: 'approveExternalData',
        //       dataProviders: [
        //         buildDataProviderItem({
        //           id: 'userProfile',
        //           type: 'UserProfileProvider',
        //           title: m.introSection,
        //           subTitle: m.introSection,
        //         }),
        //         buildDataProviderItem({
        //           id: 'pregnancyStatus',
        //           type: 'PregnancyStatus',
        //           title: m.introSection,
        //           subTitle: m.introSection,
        //         }),
        //         buildDataProviderItem({
        //           id: 'parentalLeaves',
        //           type: 'ParentalLeaves',
        //           title: m.introSection,
        //           subTitle: m.introSection,
        //         }),
        //       ],
        //     }),
        //   ],
        // }),
      ],
    }),
    buildSection({
      id: 'chooseChildren',
      title: "Velja barn",
      children: [
        buildTextField({
          id: 'children',
          title: "children",
        }),
      ],
    }),
    buildSection({
      id: 'changeDomicile',
      title: "Breyta lögheimili",
      children: [
        buildTextField({
          id: 'children',
          title: "children",
        }),
      ],
    }),
    buildSection({
      id: 'transferDate',
      title: "Flutningur",
      children: [
        buildTextField({
          id: 'children',
          title: "children",
        }),
      ],
    }),
    buildSection({
      id: 'transferPeriod',
      title: "Gildistími",
      children: [
        buildTextField({
          id: 'children',
          title: "children",
        }),
      ],
    }),
    buildSection({
      id: 'applicationEffect',
      title: "Áhrif umsóknar",
      children: [
        buildTextField({
          id: 'children',
          title: "children",
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: "Yfirlit og undirritun",
      children: [
        buildTextField({
          id: 'children',
          title: "children",
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: "Umsókn móttekin",
      children: [
        buildTextField({
          id: 'children',
          title: "children",
        }),
      ],
    }),
  ],
})
