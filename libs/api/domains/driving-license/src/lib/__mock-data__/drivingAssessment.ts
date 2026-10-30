import formatISO from 'date-fns/formatISO'
import subMonths from 'date-fns/subMonths'

const getDateOfAssessment = () => {
  // Deliberately older than 6 months: an assessment does not expire, so
  // eligibility must accept it at any age — this date pins that rule (the
  // original template wrongly rejected assessments older than 182 days).
  const nowDate = subMonths(Date.now(), 8)
  return formatISO(nowDate)
}

const DrivingAssessment = {
  dateOfAssessment: getDateOfAssessment(),
  ssn: '0',
  instructorSSN: '2',
}

export default DrivingAssessment
