import formatISO from 'date-fns/formatISO'
import subMonths from 'date-fns/subMonths'

const getDateOfAssessment = () => {
  const nowDate = subMonths(Date.now(), 3)
  return formatISO(nowDate)
}

const DrivingAssessment = {
  dagsetningMats: getDateOfAssessment(),
  kennitalaOkukennara: '2',
  kennitala: '0',
}

export default DrivingAssessment
