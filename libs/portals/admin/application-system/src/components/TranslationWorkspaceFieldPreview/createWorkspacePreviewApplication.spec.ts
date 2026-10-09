import { createWorkspacePreviewApplication } from './createWorkspacePreviewApplication'

describe('createWorkspacePreviewApplication', () => {
  it('uses empty answers and externalData when no patch is provided', () => {
    const application = createWorkspacePreviewApplication(
      'ChildrenResidenceChangeV2',
    )

    expect(application.typeId).toBe('ChildrenResidenceChangeV2')
    expect(application.answers).toEqual({})
    expect(application.externalData).toEqual({})
  })

  it('merges template preview answers and externalData into the stub application', () => {
    const application = createWorkspacePreviewApplication(
      'ChildrenResidenceChangeV2',
      {
        answers: { selectedChildren: ['1508135599'] },
        externalData: {
          nationalRegistry: {
            data: { fullName: 'Gervimaður Færeyjar' },
            date: new Date('2026-01-15'),
            status: 'success',
          },
        },
      },
    )

    expect(application.answers).toEqual({ selectedChildren: ['1508135599'] })
    expect(application.externalData['nationalRegistry']?.data).toEqual({
      fullName: 'Gervimaður Færeyjar',
    })
  })
})
