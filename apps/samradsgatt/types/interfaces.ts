export interface Case {
    id: number
    caseNumber: string
    name: string
    adviceCount: number
    shortDescription: string
    statusName: string
    institutionName: string
    typeName: string
    policyAreaName: string
    processBegins: string
    processEnds: string
    created: string
  }
  
  export interface ArrOfIdAndName {
    id: string
    name: string
  }
  
  export interface ArrOfValueAndLabel {
    value: string
    label: string
  }
