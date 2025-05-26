import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Label,
} from "recharts";

interface AnalyticsCardProps {
  title: string;
  description?: string;
  type: "bar" | "pie";
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  showLegend?: boolean;
}

export function AnalyticsCard({
  title,
  description,
  type,
  data,
  dataKey,
  nameKey,
  colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
  showLegend = false,
}: AnalyticsCardProps) {
  // Generate config from data
  const config = React.useMemo(() => {
    const configObj: Record<string, { label: string; color?: string }> = {};
    
    if (type === "bar") {
      configObj[dataKey] = {
        label: title,
        color: colors[0],
      };
    } else if (type === "pie") {
      data.forEach((item, index) => {
        configObj[item[nameKey]] = {
          label: item[nameKey],
          color: colors[index % colors.length],
        };
      });
    }
    
    return configObj;
  }, [data, dataKey, nameKey, title, type, colors]);

  // Calculate total for pie chart (if applicable)
  const total = React.useMemo(() => {
    if (type === "pie") {
      return data.reduce((acc, item) => acc + item[dataKey], 0);
    }
    return 0;
  }, [data, dataKey, type]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ChartContainer config={config} className="h-[200px] w-full">
            {type === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis 
                  dataKey={nameKey} 
                  tickLine={false} 
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tickMargin={10}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Bar 
                  dataKey={dataKey} 
                  radius={[4, 4, 0, 0]}
                />
                {showLegend && <ChartLegend content={<ChartLegendContent />} />}
              </BarChart>
            ) : (
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Pie
                  data={data}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                  {type === "pie" && (
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-2xl font-bold"
                              >
                                {total}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-xs"
                              >
                                Total
                              </tspan>
                            </text>
                          );
                        }
                        return null;
                      }}
                    />
                  )}
                </Pie>
                {showLegend && <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} />}
              </PieChart>
            )}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}