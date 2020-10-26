import { dedent } from 'ts-dedent'
import { SendMailOptions } from 'nodemailer'
import { TellUsAStoryInput } from '../dto/tellUsAStory.input'

export const getTemplate = (input: TellUsAStoryInput): SendMailOptions => ({
  from: {
    name: 'Island.is communications',
    address: 'island@island.is',
  },
  replyTo: {
    name: input.name,
    address: input.email,
  },
  to: [
    {
      name: 'Island.is þjónustuborð',
      address: 'sogur@island.is',
    },
  ],
  subject: `Tell us a story: ${input.name}`,
  text: dedent(`
    Tell us a story:
    Organization: ${input.organization}
    Date: ${input.dateOfStory}
    Title: ${input.subject}
    Story: ${input.message}

    Name: ${input.name}
    Email: ${input.email}
    Is publication allowed? ${input.publicationAllowed ? 'Yes' : 'No'}
  `),
})
