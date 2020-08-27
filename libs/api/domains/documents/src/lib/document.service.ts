import { Injectable } from '@nestjs/common';
import { Document } from './document.model';

@Injectable()
export class DocumentService {
  constructor() { }

  findByDocumentId(documentId: string): Document {

    const document = new Document()

    document.date = new Date()
    document.id = documentId
    document.opened = false
    document.senderName = "Skjalastofnun"
    document.senderNatReg = "1234567891111"
    document.subject = "Mikilvægt Skjal frá skjalastofnun"

    return document
  }
}
