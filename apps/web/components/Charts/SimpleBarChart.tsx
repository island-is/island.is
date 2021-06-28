import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data =  [
  {
      fund_year: 2016,
      sott: 6131632000.0,
      veitt: 2461778000.0
  },
  {
      fund_year: 2015,
      sott: 5353397000.0,
      veitt: 2114543000.0
  },
  {
      fund_year: 2017,
      sott: 4958341520.0,
      veitt: 2406155000.0
  },
  {
      fund_year: 2018,
      sott: 3635487800.0,
      veitt: 1833837000.0
  },
  {
      fund_year: 2014,
      sott: 3200600000.0,
      veitt: 1057143000.0
  },
  {
      fund_year: 2019,
      sott: 3084307900.0,
      veitt: 1594440000.0
  },
  {
      fund_year: 2020,
      sott: 2068266500.0,
      veitt: 1152500000.0
  },
  {
      fund_year: 2013,
      sott: 1960191000.0,
      veitt: 606991000.0
  },
  {
      fund_year: 2012,
      sott: 476517000.0,
      veitt: 163385000.0
  },
  {
      fund_year: 2011,
      sott: 465416500.0,
      veitt: 157583000.0
  },
  {
      fund_year: 2010,
      sott: 70046566.0,
      veitt: 127632000.0
  }
]

export const SimpleBarChart = () => {
  const sorted_data = data.sort((a, b) => {return b.fund_year - a.fund_year})
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={sorted_data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="1" vertical={false} color='#CCDFFF'/>
          <XAxis dataKey="fund_year"/>
          <YAxis/>
          <Tooltip />
          <Legend iconType='circle'/>
          <Bar dataKey="sott" fill="#99C0FF" radius={[20,20,0,0]} width={16} fontFamily="IBM Plex Sans"/>
          <Bar dataKey="veitt" fill="#0061FF" radius={[20,20,0,0]} width={16}/>
        </BarChart>
      </ResponsiveContainer>
    )
}

export default SimpleBarChart
