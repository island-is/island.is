import { DescriptionFigma } from '../../utils/withFigma'
import FormStepperV2 from './FormStepperV2'
import Section from './Section'
import SubSectionsV2 from './SubSectionsV2/SubSectionsV2'
import { Text } from '../Text/Text'
import { FormStepperThemes } from './types'

export default {
  title: 'Navigation/FormStepper',
  component: FormStepperV2,
}

export const Default = {
  render: () => (
    <FormStepperV2
      sections={[
        <Section
          isComplete
          section="Section #1"
          theme={FormStepperThemes.PURPLE}
        />,
        <Section
          isActive
          section="Section #2"
          theme={FormStepperThemes.PURPLE}
        />,
        <Section section="Section #3" theme={FormStepperThemes.BLUE} />,
        <Section section="Section #4" />,
        <Section section="Section #5" theme={FormStepperThemes.PURPLE} />,
      ]}
    />
  ),

  name: 'Default',
}

export const WithSubSections = {
  render: () => (
    <FormStepperV2
      sections={[
        <Section isComplete section={'Section #1'} />,
        <Section
          section={'Section #2'}
          isActive
          subSections={[
            <Text key="sub1" fontWeight="semiBold">
              Subsection #1
            </Text>,
            <Text key="sub2">Subsection #2</Text>,
            <Text key="sub3">Subsection #3</Text>,
          ]}
        />,
        <Section section={'Section #3'} />,
        <Section section={'Section #4'} />,
        <Section section={'Section #5'} />,
      ]}
    />
  ),

  name: 'With sub sections',
}
