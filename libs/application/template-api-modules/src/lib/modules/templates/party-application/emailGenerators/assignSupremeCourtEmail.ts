import { dedent } from 'ts-dedent'
import { AssignmentEmailTemplateGenerator } from '../../../../types'
import { EndorsementListTagsEnum } from '../gen/fetch'

type Constituency = Extract<
  EndorsementListTagsEnum,
  | EndorsementListTagsEnum.partyApplicationNordausturkjordaemi2021
  | EndorsementListTagsEnum.partyApplicationNordvesturkjordaemi2021
  | EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiNordur2021
  | EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiSudur2021
  | EndorsementListTagsEnum.partyApplicationSudurkjordaemi2021
  | EndorsementListTagsEnum.partyApplicationSudvesturkjordaemi2021
>
export type GenerateAssignSupremeCourtApplicationEmailOptions = Record<
  | 'partyApplicationRvkSouth'
  | 'partyApplicationRvkNorth'
  | 'partyApplicationSouthWest'
  | 'partyApplicationNorthWest'
  | 'partyApplicationNorth'
  | 'partyApplicationSouth',
  string
>
export const generateAssignSupremeCourtApplicationEmail = (
  adminEmails: GenerateAssignSupremeCourtApplicationEmailOptions,
): AssignmentEmailTemplateGenerator => (props, assignLink) => {
  const {
    application,
    options: { email },
  } = props

  const constituencyEmailMap = {
    [EndorsementListTagsEnum.partyApplicationNordausturkjordaemi2021]:
      adminEmails.partyApplicationNorth,
    [EndorsementListTagsEnum.partyApplicationNordvesturkjordaemi2021]:
      adminEmails.partyApplicationNorthWest,
    [EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiNordur2021]:
      adminEmails.partyApplicationRvkNorth,
    [EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiSudur2021]:
      adminEmails.partyApplicationRvkSouth,
    [EndorsementListTagsEnum.partyApplicationSudurkjordaemi2021]:
      adminEmails.partyApplicationSouth,
    [EndorsementListTagsEnum.partyApplicationSudvesturkjordaemi2021]:
      adminEmails.partyApplicationSouthWest,
  }

  const supremeCourtEmail =
    constituencyEmailMap[application.answers.constituency as Constituency]

  const { partyLetter, partyName } = application.externalData
    .partyLetterRegistry?.data as any

  const subject = 'Meðmæli með framboðslista'
  const body = dedent(`
        Meðmæli með framboðslista hefur verið skilað inn fyrir:

        <b>Stjórnmálasamtök:</b> ${partyName}
        <b>Listabókstafur:</b> ${partyLetter}
        <b>Kjördæmi:</b> ${application.answers.constituency}

        Ef þú áttir von á þessum tölvupósti þá getur þú <a href="${assignLink}" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.
        `)

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: supremeCourtEmail,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
