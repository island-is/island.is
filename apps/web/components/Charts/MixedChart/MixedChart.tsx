import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';


const data = [
  {
      fund_year: 2010,
      sott: 109,
      veitt: 23.0,
      amount: 127632000
  },
  {
      fund_year: 2012,
      sott: 188,
      veitt: 53.0,
      amount: 163385000
  },
  {
      fund_year: 2011,
      sott: 223,
      veitt: 46.0,
      amount: 157583000
  },
  {
      fund_year: 2014,
      sott: 234,
      veitt: 56.0,
      amount: 1057143000
  },
  {
      fund_year: 2015,
      sott: 268,
      veitt: 87.0,
      amount: 2114543000
  },
  {
      fund_year: 2013,
      sott: 326,
      veitt: 61.0,
      amount: 606991000
  },
  {
      fund_year: 2016,
      sott: 492,
      veitt: 106.0,
      amount: 2461778000
  },
  {
      fund_year: 2017,
      sott: 508,
      veitt: 101.0,
      amount: 2406155000
  },
  {
      fund_year: 2018,
      sott: 600,
      veitt: 84.0,
      amount: 1833837000
  },
  {
      fund_year: 2019,
      sott: 630,
      veitt: 76.0,
      amount: 1594440000
  },
  {
      fund_year: 2020,
      sott: 882,
      veitt: 89.0,
      amount: 1152500000
  }
]

const renderColorfulLegendText = (value: string, entry: any) => {
  return <p style={{color: "#00003C"}}>{value}</p>
}

const renderLabel = (value: string) => {
  return <p style={{color: "#00003C"}}>{value}</p>
}


export const MixedChart = () => {
  const sorted_data = data.sort((a, b) => {return a.fund_year - b.fund_year})
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={300}
          data={sorted_data}
          margin={{
            top: 30,
            right: 0,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="1" vertical={false} color='#CCDFFF'/>
          <XAxis dataKey="fund_year" stroke="#00003C"/>
          <YAxis yAxisId="left" orientation="left" stroke="#00003C" />
          <YAxis yAxisId="right" hide />
          <Tooltip />
          <Legend iconType='circle' align="right" formatter={renderColorfulLegendText}/>
          <Bar dataKey="sott" fill="#99C0FF" stackId='a' barSize={16} yAxisId="left"/> 
          <Bar dataKey="veitt" fill="#0061FF" radius={[20,20,0,0]} stackId='a' barSize={16} yAxisId="left"/>
          <Line dataKey="amount" stroke="#99F4EA" yAxisId="right" strokeWidth={3} dot={{ strokeWidth: 2 }}/>
        </ComposedChart>
      </ResponsiveContainer>
    )
}

export default MixedChart
