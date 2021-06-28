import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';


const data = [
  {
      fund_year: 2021,
      sott: 72,
      veitt: 0.0
  },
  {
      fund_year: 2010,
      sott: 109,
      veitt: 23.0
  },
  {
      fund_year: 2012,
      sott: 188,
      veitt: 53.0
  },
  {
      fund_year: 2011,
      sott: 223,
      veitt: 46.0
  },
  {
      fund_year: 2014,
      sott: 234,
      veitt: 56.0
  },
  {
      fund_year: 2015,
      sott: 268,
      veitt: 87.0
  },
  {
      fund_year: 2013,
      sott: 326,
      veitt: 61.0
  },
  {
      fund_year: 2016,
      sott: 492,
      veitt: 106.0
  },
  {
      fund_year: 2017,
      sott: 508,
      veitt: 101.0
  },
  {
      fund_year: 2018,
      sott: 600,
      veitt: 84.0
  },
  {
      fund_year: 2019,
      sott: 630,
      veitt: 76.0
  },
  {
      fund_year: 2020,
      sott: 882,
      veitt: 89.0
  }
]

const renderColorfulLegendText = (value: string, entry: any) => {
  return <span style={{color: "#00003C"}}>{value}</span>
}

const renderLabel = (value: string) => {
  return <span style={{color: "#00003C"}}>{value}</span>
}


export const SimpleBarChart = () => {
  const sorted_data = data.sort((a, b) => {return a.fund_year - b.fund_year})
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={sorted_data}
          margin={{
            top: 30,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="1" vertical={false} color='#CCDFFF'/>
          <XAxis dataKey="fund_year"/>
          <YAxis/>
          <Tooltip />
          <Legend iconType='circle' align="right" formatter={renderColorfulLegendText}/>
          <Bar dataKey="sott" fill="#99C0FF" stackId='a' barSize={16} /> 
          <Bar dataKey="veitt" fill="#0061FF" radius={[20,20,0,0]} stackId='a' barSize={16}/>
        </BarChart>
      </ResponsiveContainer>
    )
}

export default SimpleBarChart
