import ReactDatePicker from 'react-datepicker'

export default function UtilizationSummary() {
  return (
    <ReactDatePicker
      selected={new Date()}
      onChange={(date) => console.log(date)}
      dateFormat="dd.MM.yyyy"
    />
  )
}
