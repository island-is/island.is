import {
  ExpandableDescriptionField,
  Field,
  FieldTypes,
  MessageWithLinkButtonField,
  MultiField,
  Section,
} from '@island.is/application/types'
import { completedForm as messages } from '../../lib/messages'
import { completedForm } from './index'

const conclusion = completedForm.children.find(
  (child) => child.id === 'uiForms.conclusionSection',
) as Section

const fields = (conclusion.children[0] as MultiField).children as Field[]

const findByType = (type: FieldTypes) =>
  fields.find((field) => field.type === type)

describe('completedForm conclusion', () => {
  it('explains what happens to the payment next', () => {
    const nextSteps = findByType(
      FieldTypes.EXPANDABLE_DESCRIPTION,
    ) as ExpandableDescriptionField

    expect(nextSteps.introText).toBe(messages.nextStepsIntro)
    expect(nextSteps.description).toBe(messages.nextStepsDescription)
  })

  it('sends the applicant to their updated status in Fjármál', () => {
    const financeLink = findByType(
      FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
    ) as MessageWithLinkButtonField

    expect(financeLink.url).toBe('/minarsidur/fjarmal/stada')
    expect(financeLink.buttonTitle).toBe(messages.financeButtonLabel)
    expect(financeLink.message).toBe(messages.financeButtonMessage)
  })
})
