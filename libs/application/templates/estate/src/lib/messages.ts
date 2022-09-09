import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Application begin
  name: {
    id: 'es.application:application.name',
    defaultMessage: 'Dánarbú',
    description: 'Application name',
  },
  institutionName: {
    id: 'es.application:institution.name',
    defaultMessage: 'Sýslumenn',
    description: 'Institution name',
  },
  draftTitle: {
    id: 'es.application:draft.title',
    defaultMessage: 'Drög',
    description: 'Draft title',
  },
  draftDescription: {
    id: 'es.application:draft.description',
    defaultMessage: 'Drög að ólokinni umsókn',
    description: 'Draft description',
  },
  // Application end

  // Applicant begin
  errorPhoneNumber: {
    id: 'es.application:error.errorPhoneNumber',
    defaultMessage: 'Símanúmer virðist ekki vera rétt',
    description: 'Phone number is invalid',
  },
  errorEmail: {
    id: 'es.application:error.errorEmail',
    defaultMessage: 'Netfang virðist ekki vera rétt',
    description: 'Email is invalid',
  },
  errorRelation: {
    id: 'es.application:error.errorRelation',
    defaultMessage: 'Tengsl virðast ekki vera rétt',
    description: 'Relation is invalid',
  },
  // Applicant end

  // Assets begin
  errorNumberEmpty: {
    id: 'es.application:error.errorNumberEmpty',
    defaultMessage: 'Númer má ekki vera tómt',
    description: 'Invalid general asset number error message',
  },
  // Assets end
})
