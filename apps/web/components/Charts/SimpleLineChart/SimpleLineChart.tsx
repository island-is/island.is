import React from 'react';
import { LineChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';

const dataKeys = ["dk", "eu", "fi", "ir", "is", "no", "sv"]
const dataKeysName = {
  dk: "Danmörk",
  eu: "Evrópusamb.",
  fi: "Finnnland",
  ir: "Írland",
  is: "Ísland",
  no: "Noregur",
  sv: "Svíþjóð"
}

const renderColorfulLegendText = (value: string, entry: any) => {
  return <p style={{color: "#00003C"}}>{value}</p>
}

const renderLegend = (props) => {
  const { payload } = props
  console.log(payload)

  return (
    <ul style={{justifyContent: 'space-between', display: 'flex'}}>
      {
        payload.map((entry, index) => (
          <li style={{color: "#00003C", display: 'inline-flex', alignItems: "center"}} key={`item-${index}`}>
            <div style={{
              width: "12px",
              height: "12px",
              border: "3px solid " + entry.color,
              borderRadius: "12px",
              marginRight: "8px"}} />
              {dataKeysName[entry.value]}
          </li>
        ))
      }
    </ul>
  )
}


export const SimpleLineChart = () => {
    let data = []
    var year = 2000;
    for (var i = 13; i <= 19; i++) {
        data.push({
            year: year+i,
            dk: Math.round(Math.random() * (4 - 1) + 1),
            eu: Math.round(Math.random() * (4 - 1) + 1),
            fi: Math.round(Math.random() * (4 - 1) + 1),
            ir: Math.round(Math.random() * (4 - 1) + 1),
            is: Math.round(Math.random() * (4 - 1) + 1),
            no: Math.round(Math.random() * (4 - 1) + 1),
            sv: Math.round(Math.random() * (4 - 1) + 1)

        })
    }
    
    const COLORS = ['#99C0FF', '#D799C7', '#99F4EA', '#FF99B9', '#C3ABD9', '#E6CF00', '#B5B6EC']
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="1" vertical={false} stroke='#CCDFFF'/>
          <XAxis dataKey="year" axisLine={false} padding={{ left: 30 }}/>
          <YAxis axisLine={false}/>
          <Tooltip />
          <Legend iconType='circle' content={renderLegend}/>
          {dataKeys.map((datakey, index) => <Line dataKey={datakey} stroke={COLORS[index % COLORS.length]} strokeWidth={3} dot={{ r: 6, strokeWidth: 3 }}/>)}
        </LineChart>
      </ResponsiveContainer>
    )
}

export default SimpleLineChart
