import { Application } from '@island.is/application/types'
// import { applicationToComplaintPDF } from '../../utils'
import { generatePdf } from '../pdfGenerator'

import {
  addformFieldAndValue,
  addHeader,
  addValue,
  formatSsn,
  setPageHeader,
} from '../pdfUtils'
import { PdfConstants } from '../constants'
import { DocumentInfo } from '@island.is/clients/data-protection-complaint'

const fakeDto = { answers: { name: 'helgi' } }

const statement = ''

export async function generateStatementPdf(
  application: Application,
): Promise<Buffer> {
  const answers = application.answers
  // const dto = applicationToComplaintPDF(application, attachedFiles)
  return await generatePdf<any>(answers, dpcApplicationPdf)
}

function dpcApplicationPdf(answers: any, doc: PDFKit.PDFDocument): void {
  setPageHeader(doc, 'timestamp')

  addHeader('Yfirlýsing vegna persónukjörs', doc)

  renderStatement(answers, doc)

  doc.end()
}

function renderStatement(answers: any, doc: PDFKit.PDFDocument): void {
  addValue(
    `Yfirlýsing frambjóðanda vegna Sveitastjórnarkosningar 2022
  ${answers.about.fullName}, Kennitala: ${answers.about.nationalId}, tók þátt í kjöri til ${answers.election.selectElection}
  Ég lýsi því hér með yfir að viðlögðum drengskap að hvorki heildartekjur né heildarkostnaður vegna framboðs míns í kjörinu voru hærri en kr. ${answers.election.incomeLimit}
  Það staðfestist hér með að heildartekjur eða -kostnaður vegna framboðsins voru ekki umfram þau fjárhæðarmörk sem tilgreind eru í 3. mgr. 10. gr. laga nr. 162/2006, um starfsemi stjórnmálasamtaka, og er framboðið því undanþegið uppgjörsskyldu.
  `,
    doc,
  )
}
