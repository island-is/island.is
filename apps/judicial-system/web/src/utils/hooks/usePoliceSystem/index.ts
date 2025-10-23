const usePoliceSystem = () => {
  const {
    data: speedingViolationInfoData,
    loading: speedingViolationInfoLoading,
  } = useSpeedingViolationInfoQuery({
    variables: {
      input: {
        caseId: workingCase.id,
      },
    },
    skip: workingCase.origin !== CaseOrigin.LOKE,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (!data.speedingViolationInfo) {
        return undefined
      } else return data as SpeedingViolationInfo[]
    },
  })
}

export default usePoliceSystem
