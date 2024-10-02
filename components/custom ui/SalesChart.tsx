"use client"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Komponenta za prikaz grafikona prodaje
const SalesChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart className='w-full h-full' data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="sales" stroke="#ab9367" />
        <CartesianGrid stroke="#2c2c2c" strokeDasharray="5 5" />
        <XAxis dataKey="name" stroke="#ffffff" />
        <YAxis stroke="#ffffff" />
        <Tooltip contentStyle={{ backgroundColor: '#333333', color: '#ffffff' }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;

