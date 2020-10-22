import { Injectable } from '@nestjs/common'
import { SendMailOptions } from 'nodemailer'
import { ContactUsInput } from '../dto/contactUs.input'
import { TellUsAStoryInput } from '../dto/tellUsAStory.input'
import { getTemplate as getContactUsTemplate } from './contactUs'
import { getTemplate as getTellUsAStoryTemplate } from './tellUsAStory'

export type GetEmailTemplateInput = ContactUsInput | TellUsAStoryInput

export const getEmailTemplate = (
  input: GetEmailTemplateInput,
): SendMailOptions => {
  switch (input.type) {
    case 'contactUs': {
      return getContactUsTemplate(input)
    }

    case 'tellUsAStory': {
      return getTellUsAStoryTemplate(input)
    }
  }
}
