import formatISO from 'date-fns/formatISO'
import subMonths from 'date-fns/subMonths'

const getDateOfAssessment = () => {
  const nowDate = subMonths(Date.now(), 3)
  return formatISO(nowDate)
}

const DrivingAssessment = {
  dateOfAssessment: getDateOfAssessment(),
  ssn: '0',
  instructorSSN: '2',
}

export default DrivingAssessment
