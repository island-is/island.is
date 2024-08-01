import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { machine } from '../../../lib/messages'

export const MachineTechnicalInformation = buildSubSection({
  id: 'machineTechnicalInformation',
  title: machine.labels.technicalMachineInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'machineTechnicalInformationMultiField',
      title: machine.labels.technicalMachineInformation.title,
      description: machine.labels.technicalMachineInformation.description,
      children: [
        // TODO: Get description from machine basic answers
        buildDescriptionField({
          id: 'machine.technicalInformation.aboutTitle',
          title: 'Lyftari: JF Lyftarar með skotbómu',
          titleVariant: 'h5',
        }),
        // Text fields will be generated depending on what categories have been chosen.
        // Also have to hear from them if everything is required?
        buildTextField({
          id: 'machine.technicalInformation.energySource',
          title: machine.labels.technicalMachineInformation.energySource,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'machine.technicalInformation.enginePower',
          title: machine.labels.technicalMachineInformation.enginePower,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'machine.technicalInformation.ownWeight',
          title: machine.labels.technicalMachineInformation.ownWeight,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'machine.technicalInformation.liftingCapactiy',
          title: machine.labels.technicalMachineInformation.liftingCapactiy,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'machine.technicalInformation.voiceWorkshop',
          title: machine.labels.technicalMachineInformation.voiceWorkshop,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'machine.technicalInformation.liftHeight',
          title: machine.labels.technicalMachineInformation.liftHeight,
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
