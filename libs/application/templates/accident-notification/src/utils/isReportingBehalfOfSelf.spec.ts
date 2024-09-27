import { FormValue } from "@island.is/application/types"
import { isReportingOnBehalfSelf } from "./isReportingBehalfOfSelf"
import { WhoIsTheNotificationForEnum } from "../types"

describe('isRepresentativeOfCompanyOrInstitue', () => {
    const self: FormValue = {
      whoIsTheNotificationFor: {
        answer: WhoIsTheNotificationForEnum.ME,
      },
    }

    const notSelf: FormValue = {
        whoIsTheNotificationFor: {
          answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
        },
      }
  
    it('should return true for someone that is a representative of the company or institue', () => {
      expect(isReportingOnBehalfSelf(self)).toEqual(true)
    })
    it('should return false for someone that isnt a representative of the company or institue', () => {
      expect(isReportingOnBehalfSelf(notSelf)).toEqual(
        false,
      )
    })
    it('should return false for empty object', () => {
      expect(isReportingOnBehalfSelf({})).toEqual(false)
    })
  })