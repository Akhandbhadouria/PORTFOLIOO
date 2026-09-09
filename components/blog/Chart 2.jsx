'use client'

// Recharts wrapper for MDX posts. Renders line / area / bar / pie charts with a
// caption. Client component so ResponsiveContainer can measure the DOM.
//
// Usage in MDX:
//   <Chart
//     type="line"
//     xKey="week"
//     series={[{ key: 'p95', name: 'p95 latency (ms)', color: '#f7790f' }]}
//     data={[{ week: 'W1', p95: 240 }, { week: 'W2', p95: 180 }]}
//     caption="Sync latency after the CRDT rewrite"
//   />

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const PALETTE = ['#f7790f', '#6C8EFF', '#4ECDC4', '#c084fc', '#f43f5e', '#22c55e']

const AXIS = { stroke: 'rgba(var(--ink), 0.28)', fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }
const GRID = 'rgba(var(--ink), 0.08)'

const TOOLTIP_STYLE = {
  background: 'rgba(var(--paper), 0.92)',
  border: '1px solid rgba(var(--ink), 0.1)',
  borderRadius: 12,
  boxShadow: '0 10px 26px rgba(var(--shadow-ink), 0.1)',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 12,
}

export default function Chart({
  type = 'line',
  data = [],
  xKey = 'x',
  series = [],
  caption,
  height = 300,
  stacked = false,
  showLegend = true,
  nameKey = 'name',
  valueKey = 'value',
}) {
  const s = series.map((item, i) => ({
    color: PALETTE[i % PALETTE.length],
    ...item,
    name: item.name || item.key,
  }))

  let inner = null

  if (type === 'line') {
    inner = (
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: GRID }} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }} />}
        {s.map((ser) => (
          <Line
            key={ser.key}
            type="monotone"
            dataKey={ser.key}
            name={ser.name}
            stroke={ser.color}
            strokeWidth={2.4}
            dot={{ r: 2.5, strokeWidth: 0, fill: ser.color }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    )
  } else if (type === 'area') {
    inner = (
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
        <defs>
          {s.map((ser) => (
            <linearGradient key={ser.key} id={`grad-${ser.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ser.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={ser.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: GRID }} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }} />}
        {s.map((ser) => (
          <Area
            key={ser.key}
            type="monotone"
            dataKey={ser.key}
            name={ser.name}
            stroke={ser.color}
            strokeWidth={2.2}
            fill={`url(#grad-${ser.key})`}
            stackId={stacked ? '1' : undefined}
          />
        ))}
      </AreaChart>
    )
  } else if (type === 'bar') {
    inner = (
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(var(--ink), 0.04)' }} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }} />}
        {s.map((ser) => (
          <Bar
            key={ser.key}
            dataKey={ser.key}
            name={ser.name}
            fill={ser.color}
            radius={[6, 6, 0, 0]}
            stackId={stacked ? '1' : undefined}
            maxBarSize={48}
          />
        ))}
      </BarChart>
    )
  } else if (type === 'pie') {
    inner = (
      <PieChart>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius={54}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color || PALETTE[i % PALETTE.length]} stroke="none" />
          ))}
        </Pie>
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }} />}
      </PieChart>
    )
  }

  // Unknown type (typo in MDX) — fail soft instead of crashing the post:
  // ResponsiveContainer throws on a null child.
  if (!inner) return null

  return (
    <figure className="blog-chart">
      <div className="blog-chart__frame" style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {inner}
        </ResponsiveContainer>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
