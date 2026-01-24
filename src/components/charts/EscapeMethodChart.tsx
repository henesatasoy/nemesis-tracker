import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EscapeStat {
  method: string;
  count: number;
  percentage: number;
}

interface EscapeMethodChartProps {
  data: EscapeStat[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
];

export function EscapeMethodChart({ data }: EscapeMethodChartProps) {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No escape data recorded yet!
      </p>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.method.length > 14 ? item.method.slice(0, 14) + '…' : item.method,
    fullName: item.method,
    value: item.count,
    percentage: item.percentage,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: number, name: string, props: { payload: typeof chartData[0] }) => [
            `${value} (${props.payload.percentage.toFixed(1)}%)`,
            props.payload.fullName,
          ]}
        />
        <Legend
          verticalAlign="bottom"
          formatter={(value: string) => (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
