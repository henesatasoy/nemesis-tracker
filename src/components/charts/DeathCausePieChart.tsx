import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { DeathCause } from '@/types/game';

interface DeathStat {
  cause: DeathCause;
  count: number;
  percentage: number;
}

interface DeathCausePieChartProps {
  data: DeathStat[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--destructive))',
  'hsl(var(--warning))',
  'hsl(var(--muted-foreground))',
];

export function DeathCausePieChart({ data }: DeathCausePieChartProps) {
  const chartData = data.map((d, i) => ({
    name: d.cause.length > 15 ? d.cause.slice(0, 12) + '...' : d.cause,
    fullName: d.cause,
    value: d.count,
    percentage: d.percentage,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                    <p className="font-medium">{data.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.value} deaths ({data.percentage.toFixed(1)}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-xs text-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
