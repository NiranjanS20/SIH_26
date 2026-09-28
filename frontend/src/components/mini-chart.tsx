import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MiniChartProps = {
  title: string;
  subtitle: string;
  data: Array<Record<string, string | number>>;
  dataKey: string;
  color: string;
};

export default function MiniChart({ title, subtitle, data, dataKey, color }: MiniChartProps) {
  const gradientId = `gradient-${dataKey}`;
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <div className="mb-3">
        <div className="text-xs font-semibold text-foreground">{title}</div>
        <div className="mt-0.5 text-[10px] text-muted-foreground">{subtitle}</div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={color} stopOpacity={0.35} />
                <stop offset="1" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="i" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }} />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
