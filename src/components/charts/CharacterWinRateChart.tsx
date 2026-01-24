import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import type { CharacterClass } from '@/types/game';
import { CHARACTER_COLORS } from '@/types/game';

interface CharacterStat {
  character: CharacterClass;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

interface CharacterWinRateChartProps {
  data: CharacterStat[];
}

export function CharacterWinRateChart({ data }: CharacterWinRateChartProps) {
  const chartData = data
    .filter((d) => d.gamesPlayed > 0)
    .map((d) => ({
      name: d.character.split(' ')[0], // Shorten names for mobile
      fullName: d.character,
      winRate: Math.round(d.winRate),
      games: d.gamesPlayed,
      fill: CHARACTER_COLORS[d.character],
    }));

  if (chartData.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No character data yet
      </p>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 40, left: 5, bottom: 5 }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={70}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Bar
            dataKey="winRate"
            radius={[0, 4, 4, 0]}
            barSize={20}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="winRate"
              position="right"
              formatter={(v: number) => `${v}%`}
              fill="hsl(var(--foreground))"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
