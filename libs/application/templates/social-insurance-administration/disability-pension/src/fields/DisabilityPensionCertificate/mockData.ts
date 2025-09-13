import {
  SiaDisabilityPensionCertificateQuery,
  SocialInsuranceMedicalDocumentsEnvironmentalCategory,
  SocialInsuranceMedicalDocumentsImpairmentType,
} from '../../types/schema'

export const MOCK_CERTIFICATE: SiaDisabilityPensionCertificateQuery = {
  socialInsuranceDisabilityPensionCertificate: {
    referenceId: '1',
    lastInspectionDate: '2025-01-01T00:00:00.000Z',
    certificateDate: '2025-01-01T00:00:00.000Z',
    dateOfWorkIncapacity: '2025-01-01T00:00:00.000Z',
    healthHistorySummary: 'Hefur farið í áfengismeðferð',
    participationLimitationCause: 10,
    abilityChangePotential: 80,
    medicationAndSupports: 'Lorem ipsum',
    assessmentToolsUsed: 'Hitt og þetta',
    doctor: {
      doctorNumber: '8888',
      name: 'Teitur Stefán Jónsson',
      residence: 'Heilsugæslan Kirkjusandi',
    },
    diagnoses: {
      mainDiagnoses: [
        {
          code: 'M05.9',
          description: 'Seropositive rehumatoid arthritis, unspecified',
        },
      ],
      otherDiagnoses: [
        {
          code: 'M05.9',
          description: 'Seropositive rehumatoid arthritis, unspecified',
        },
        {
          code: 'AB1.',
          description: 'Corem ipsum dolor sit amet',
        },
        {
          code: 'CD2',
          description:
            'Nunc vuluputate libero et velit interdum, ac aliquet odio mattis',
        },
      ],
    },
    healthImpact: {
      description: 'Lorem ipsum dolor sit amet',
      impactLevel: 5,
    },
    physicalAbilityRatings: [
      {
        type: 1,
        score: 8,
      },
      {
        type: 2,
        score: 7,
      },
      {
        type: 3,
        score: 6,
      },
    ],
    cognitiveAndMentalAbilityRatings: [
      {
        type: 1,
        score: 8,
      },
      {
        type: 2,
        score: 7,
      },
      {
        type: 3,
        score: 6,
      },
    ],
    functionalAssessment: [
      {
        type: 1,
        score: 8,
      },
      {
        type: 2,
        score: 7,
      },
      {
        type: 3,
        score: 6,
      },
    ],
    impairments: [
      {
        type: SocialInsuranceMedicalDocumentsImpairmentType.Type_0,
        functions: [
          {
            title: 'lorem',
            keyNumber: '1',
            description: 'descrition',
          },
        ],
      },
      {
        type: SocialInsuranceMedicalDocumentsImpairmentType.Type_1,
        functions: [
          {
            title: 'ipsum',
            keyNumber: '2',
            description: 'descrition',
          },
        ],
      },
    ],
    environmentalFactors: [
      {
        category:
          SocialInsuranceMedicalDocumentsEnvironmentalCategory.Category_4,
        keyNumber: '1',
        description: 'description',
      },
      {
        category:
          SocialInsuranceMedicalDocumentsEnvironmentalCategory.Category_0,
        keyNumber: '2',
        description: 'description',
      },
    ],
  },
}
