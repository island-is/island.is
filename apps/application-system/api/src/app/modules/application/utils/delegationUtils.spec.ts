import { createApplication } from '@island.is/application/testing'
import { isNewActor } from './delegationUtils'

describe('Testing utility functions for delegations', () => {
  describe('isNewActor', () => {
    it('Should return true when user is not an actor and is the applicant', () => {
      const application = createApplication({
        applicant: '1234567890',
        applicantActors: [],
      })
      const user = {
        nationalId: '1234567890',
        actor: {
          nationalId: '1234567890',
        },
      }

      expect(isNewActor(application, user)).toEqual(true)
    })

    it('Should return false when user actor is already in applicantActors', () => {
      const application = createApplication({
        applicant: '1234567890',
        applicantActors: ['1234567890'],
      })
      const user = {
        nationalId: '1234567890',
        actor: {
          nationalId: '1234567890',
        },
      }

      expect(isNewActor(application, user)).toEqual(false)
    })

    it('Should return false when user is not the actor', () => {
      const application = createApplication({
        applicant: '1234567890',
        applicantActors: [],
      })

      const user = {
        nationalId: '1234567890',
      }

      expect(isNewActor(application, user)).toEqual(false)
    })
  })
})
