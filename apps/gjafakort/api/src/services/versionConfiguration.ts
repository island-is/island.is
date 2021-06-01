interface Version {
  yearBornLimit: number
  type: 'gjafakort-user' | 'gjafakort-user-2'
}

export const getVersionConfiguration = async (): Promise<Version> => Promise.resolve({
  yearBornLimit: 2003,
  type: 'gjafakort-user-2',
})
