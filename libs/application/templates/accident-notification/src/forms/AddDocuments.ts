import {
  buildFileUploadField,
  buildForm,
  buildSection,
  Form,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { UPLOAD_ACCEPT } from '../constants'
import { inReview } from '../lib/messages'

export const AddDocuments: Form = buildForm({
  id: 'ParentalLeaveAddDocuments',
  title: inReview.general.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: 'Fylgiskjöl',
      children: [
        buildFileUploadField({
          id: 'attachments.powerOfAttorneyFile',
          title: '',
          introduction:
            'Vinsamlegast passaðu upp á að texti sé lesanlegur til að koma í veg fyrir að það þurfi ekki að óska eftir gögnum aftur. bla bla bla',
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: 'Dragðu áverkavottorð hingað til að hlaða upp',
          uploadDescription:
            'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
          uploadButtonLabel: 'Velja skjöl til að hlaða upp',
        }),
        buildFileUploadField({
          id: 'attachments.powerOfAttorneyFile',
          title: '',
          introduction:
            'Ef þú hefur auka skjöl sem þú villt koma til skila eins og ljósmyndir af slysstað, skýrsla til vinnueftirlitsins eða önnnur gögn teng slysinu, þá vinsamlegast bættu þeim við hér að neðan.',
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: 'Dragðu áverkavottorð hingað til að hlaða upp',
          uploadDescription:
            'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
          uploadButtonLabel: 'Velja skjöl til að hlaða upp',
        }),
      ],
    }),
  ],
})
