import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const accuracyData = [
  { epoch: 1, accuracy: 0.52 },
  { epoch: 2, accuracy: 0.61 },
  { epoch: 3, accuracy: 0.68 },
  { epoch: 4, accuracy: 0.74 },
  { epoch: 5, accuracy: 0.79 },
  { epoch: 6, accuracy: 0.82 },
  { epoch: 7, accuracy: 0.85 },
  { epoch: 8, accuracy: 0.87 },
  { epoch: 9, accuracy: 0.88 },
  { epoch: 10, accuracy: 0.89 },
];

const datasetData = [
  { class: "plastic", images: 482 },
  { class: "paper", images: 594 },
  { class: "metal", images: 410 },
  { class: "glass", images: 501 },
  { class: "cardboard", images: 403 },
  { class: "trash", images: 137 },
];

export function AccuracyChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={accuracyData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="epoch"
            label={{ value: "Epoch", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            domain={[0.4, 1]}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip
            formatter={(v: number) => [`${Math.round(v * 100)}%`, "Accuracy"]}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 6,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "hsl(var(--primary))" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DatasetDistributionChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datasetData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="class" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 6,
              fontSize: 12,
            }}
          />
          <Bar dataKey="images" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
