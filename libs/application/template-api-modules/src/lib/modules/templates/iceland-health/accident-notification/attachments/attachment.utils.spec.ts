import {
  additionalFilesFromReviewerRequest,
  additionalFilesRequest,
  allAttachmentRequestConfig,
  injuryCertificateRequest,
  policeReportRequest,
  powerOfAttorneyRequest,
} from '../config'

import { attachmentStatusToAttachmentRequests } from './attachment.utils'

describe('Attachment helpers', () => {
  describe('Accident requests', () => {
    it('should return all request on empty  status', () => {
      const allRequests = allAttachmentRequestConfig.requests
      expect(attachmentStatusToAttachmentRequests()).toBe(allRequests)
    })

    it('should return only police report and additional files', () => {
      const expected = [
        policeReportRequest,
        additionalFilesRequest,
        additionalFilesFromReviewerRequest,
      ]
      const receivedAttachments = {
        InjuryCertificate: true,
        PoliceReport: false,
        ProxyDocument: true,
        Unknown: false,
      }
      expect(attachmentStatusToAttachmentRequests(receivedAttachments)).toEqual(
        expected,
      )
    })

    it('should return only police report and additional files', () => {
      const receivedAttachments = {
        InjuryCertificate: false,
        PoliceReport: false,
        ProxyDocument: false,
        Unknown: false,
      }
      expect(
        attachmentStatusToAttachmentRequests(receivedAttachments),
      ).toContain(policeReportRequest)
      expect(
        attachmentStatusToAttachmentRequests(receivedAttachments),
      ).toContain(additionalFilesRequest)
      expect(
        attachmentStatusToAttachmentRequests(receivedAttachments),
      ).toContain(powerOfAttorneyRequest)
      expect(
        attachmentStatusToAttachmentRequests(receivedAttachments),
      ).toContain(injuryCertificateRequest)
    })

    it('should return only police report and additional files', () => {
      const receivedAttachments = {
        InjuryCertificate: false,
        PoliceReport: null,
        ProxyDocument: false,
        Unknown: false,
      }
      expect(
        attachmentStatusToAttachmentRequests(receivedAttachments),
      ).not.toContain(policeReportRequest)
      expect(
        attachmentStatusToAttachmentRequests(receivedAttachments),
      ).toContain(additionalFilesRequest)
      expect(
        attachmentStatusToAttachmentRequests(receivedAttachments),
      ).toContain(powerOfAttorneyRequest)
      expect(
        attachmentStatusToAttachmentRequests(receivedAttachments),
      ).toContain(injuryCertificateRequest)
    })
  })
})
