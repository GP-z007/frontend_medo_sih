import type { ReactNode } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { BookingWindow } from '@udaan/services/types';

const GRID = '#DDE2E8';
const ORANGE = '#F28C28';
const NAVY = '#0B2345';
const RED = '#DB4B36';

function ChartShell({
  title,
  subtitle,
  children,
  compact,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`chart-panel${compact ? ' compact' : ''}`}>
      <h3>{title}</h3>
      {subtitle && <div className="chart-sub">{subtitle}</div>}
      <div className="chart-box">{children}</div>
    </div>
  );
}

export function FareTrendChart({
  data,
  title,
  compact,
}: {
  data: { date: string; fare: number }[];
  title: string;
  compact?: boolean;
}) {
  return (
    <ChartShell title={title} subtitle="Average one-way fare" compact={compact}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 6, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={!compact} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#66768C' }} minTickGap={compact ? 40 : 28} />
          <YAxis tick={{ fontSize: 10, fill: '#66768C' }} width={compact ? 36 : 44} />
          <Tooltip />
          <Line type="monotone" dataKey="fare" stroke={ORANGE} strokeWidth={2} dot={false} isAnimationActive={!compact} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function BookingWindowChart({
  data,
  title,
  compact,
}: {
  data: { window: BookingWindow; label: string; fare: number }[];
  title: string;
  compact?: boolean;
}) {
  return (
    <ChartShell
      title={title}
      subtitle={compact ? 'Average fare by how far ahead you book' : 'T+1 · T+7 · T+15 · T+30 · T+45'}
      compact={compact}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 2, right: 6, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={!compact} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#66768C' }} />
          <YAxis tick={{ fontSize: 10, fill: '#66768C' }} width={compact ? 36 : 44} />
          <Tooltip />
          <Bar dataKey="fare" fill={NAVY} radius={[3, 3, 0, 0]} isAnimationActive={!compact} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function IndexTrendChart({ data }: { data: { date: string; index: number }[] }) {
  return (
    <ChartShell title="National Airfare Index Trend" subtitle="Base Jan 2024 = 100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#66768C' }} />
          <YAxis tick={{ fontSize: 10, fill: '#66768C' }} domain={['auto', 'auto']} width={36} />
          <Tooltip />
          <Line type="monotone" dataKey="index" stroke={NAVY} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function RisingRoutesChart({
  data,
}: {
  data: { route: string; changePct: number; fare: number }[];
}) {
  return (
    <ChartShell title="Top routes driving airfare increase">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 16, top: 4, right: 8, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 10, fill: '#66768C' }} />
          <YAxis type="category" dataKey="route" width={78} tick={{ fontSize: 10, fill: '#66768C' }} />
          <Tooltip />
          <Bar dataKey="changePct" fill={RED} radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function AirlineMovementChart({
  data,
}: {
  data: { airline: string; changePct: number }[];
}) {
  return (
    <ChartShell title="Airline fare movement">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="airline" tick={{ fontSize: 10, fill: '#66768C' }} />
          <YAxis tick={{ fontSize: 10, fill: '#66768C' }} width={32} />
          <Tooltip />
          <Bar dataKey="changePct" fill={ORANGE} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function IndexVsCpiChart({
  data,
}: {
  data: { date: string; airfareIndex: number; transportCpi: number }[];
}) {
  return (
    <ChartShell title="Airfare Index vs Transport CPI">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#66768C' }} />
          <YAxis tick={{ fontSize: 10, fill: '#66768C' }} width={36} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line
            type="monotone"
            dataKey="airfareIndex"
            name="Airfare Index"
            stroke={ORANGE}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="transportCpi"
            name="Transport CPI"
            stroke="#64748B"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
