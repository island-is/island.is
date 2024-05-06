import {
  buildActionCardListField,
  buildForm,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
// import { Logo } from '../../assets/Logo'
import { Routes } from '../../lib/constants'
import { StateSection } from './State'

export const Review: Form = buildForm({
  id: 'Review',
  title: '',
  // logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [
    StateSection,
    buildSection({
      id: 'nextSection',
      title: 'Stuff',
      children: [
        buildActionCardListField({
          id: 'approvalActionCard2',
          doesNotRequireAnswer: true,
          title: '',
          items: (application) => {
            console.log(application)
            const chosenApplicantName = getValueViaPath(
              application.answers,
              `${Routes.CHOSENAPPLICANTS}.name`,
              'Barn 1',
            )
            return [
              {
                heading: 'Samþykki forsjáraðila 2',
                tag: {
                  label: 'Samþykki í bið',
                  outlined: false,
                  variant: 'purple',
                },
                text: `Beðið er eftir að samþykki fyrir umsókn um nafnskírteini fyrir: ${chosenApplicantName}`,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
