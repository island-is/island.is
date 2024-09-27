import { FormValue } from "@island.is/application/types"
import { hasReceivedConfirmation } from "./hasReceivedConfirmation"
import { WhoIsTheNotificationForEnum } from "../types"
describe('hasReceivedConfirmation', () => {
    const confirmedJudicial: FormValue = {
        whoIsTheNotificationFor: {
            answer: WhoIsTheNotificationForEnum.JURIDICALPERSON
        },
        accidentStatus: {
            receivedConfirmations: {
                InjuredOrRepresentativeParty: true
            }
        },
    }

    const confirmedMe: FormValue = {
        whoIsTheNotificationFor: {
            answer: WhoIsTheNotificationForEnum.ME
        },
        accidentStatus: {
            receivedConfirmations: {
                CompanyParty: true
            }
        },
    }

    const notConfirmed: FormValue = {
        accidentStatus: {
            receivedConfirmations: false
        },
    }

    it('should return true when confirmation is received for a juridical person', () => {
        expect(hasReceivedConfirmation(confirmedJudicial)).toEqual(true)
    })

    it('should return true when confirmation is received for company', () => {
        expect(hasReceivedConfirmation(confirmedMe)).toEqual(true)
    })

    it('should return false when confirmation is not received', () => {
        expect(hasReceivedConfirmation(notConfirmed)).toEqual(false)
    })
})