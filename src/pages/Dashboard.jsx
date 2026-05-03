import { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  Table2,
  Bell,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";

// ── Mock data ──────────────────────────────────────────────────────────────────

const miniBarData = [
  { v: 30 }, { v: 50 }, { v: 40 }, { v: 70 }, { v: 55 },
  { v: 80 }, { v: 60 }, { v: 75 }, { v: 90 }, { v: 65 },
];

const statCards = [
  {
    label: "Daily Sales",
    value: "$2k",
    sub: "9 February 2024",
    icon: DollarSign,
  },
  {
    label: "Monthly Revenue",
    value: "$55k",
    sub: "1 Jan – 1 Feb",
    icon: TrendingUp,
  },
  {
    label: "Table Occupancy",
    value: "25 Tables",
    sub: "Currently occupied",
    icon: Table2,
  },
];

const popularDishesMenu = [
  { id: 1, name: "Chicken Parmesan", serving: "01 person", price: "$55.00", status: "In Stock" },
  { id: 2, name: "Grilled Salmon",   serving: "01 person", price: "$72.00", status: "In Stock" },
  { id: 3, name: "Beef Burger",      serving: "01 person", price: "$35.00", status: "Out of Stock" },
  { id: 4, name: "Caesar Salad",     serving: "01 person", price: "$28.00", status: "In Stock" },
];

const popularDishesOrders = [
  { id: 1, name: "Chicken Parmesan", qty: "x1", unitPrice: "$55.00", total: "$55.00",  status: "In Stock" },
  { id: 2, name: "Grilled Salmon",   qty: "x2", unitPrice: "$72.00", total: "$144.00", status: "In Stock" },
  { id: 3, name: "Beef Burger",      qty: "x1", unitPrice: "$35.00", total: "$35.00",  status: "Out of Stock" },
  { id: 4, name: "Caesar Salad",     qty: "x3", unitPrice: "$28.00", total: "$84.00",  status: "In Stock" },
];

const monthlyData = [
  { month: "JAN", sales: 3200, revenue: 2100 },
  { month: "FEB", sales: 2800, revenue: 2300 },
  { month: "MAR", sales: 3500, revenue: 2200 },
  { month: "APR", sales: 2200, revenue: 2000 },
  { month: "MAY", sales: 2900, revenue: 2100 },
  { month: "JUN", sales: 3100, revenue: 2400 },
  { month: "JUL", sales: 2700, revenue: 2200 },
  { month: "AUG", sales: 4200, revenue: 2600 },
  { month: "SEP", sales: 3800, revenue: 2500 },
  { month: "OCT", sales: 3000, revenue: 2300 },
  { month: "NOV", sales: 3400, revenue: 2400 },
  { month: "DEC", sales: 4800, revenue: 2800 },
];

const weeklyData = [
  { month: "MON", sales: 800,  revenue: 500 },
  { month: "TUE", sales: 1200, revenue: 700 },
  { month: "WED", sales: 950,  revenue: 600 },
  { month: "THU", sales: 1400, revenue: 900 },
  { month: "FRI", sales: 1800, revenue: 1100 },
  { month: "SAT", sales: 2100, revenue: 1300 },
  { month: "SUN", sales: 1600, revenue: 1000 },
];

const dailyData = [
  { month: "6AM",  sales: 200,  revenue: 100 },
  { month: "9AM",  sales: 500,  revenue: 300 },
  { month: "12PM", sales: 900,  revenue: 600 },
  { month: "3PM",  sales: 700,  revenue: 500 },
  { month: "6PM",  sales: 1100, revenue: 800 },
  { month: "9PM",  sales: 800,  revenue: 600 },
];

const chartDataMap = { Monthly: monthlyData, Weekly: weeklyData, Daily: dailyData };

// ── Sub-components ─────────────────────────────────────────────────────────────

function MiniBar() {
  return (
    <ResponsiveContainer width={100} height={40}>
      <BarChart data={miniBarData} barSize={6}>
        <Bar dataKey="v" fill="var(--color-primary)" radius={2} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <Card className="flex-1 min-w-0 overflow-visible">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className="bg-primary/10 text-primary rounded-full p-2">
            <Icon size={18} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{sub}</p>
          <MiniBar />
        </div>
      </CardContent>
    </Card>
  );
}

function DishRow({ name, meta, price, status, extra }) {
  const inStock = status === "In Stock";
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
        <img
          src="https://placehold.co/48x48/2a2a2a/888?text=🍽"
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p
          className={`text-xs font-medium ${
            inStock ? "text-primary" : "text-destructive"
          }`}
        >
          {status}
        </p>
        {extra && <p className="text-xs text-muted-foreground">{extra}</p>}
        <p className="text-sm font-semibold">{price}</p>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeRange, setActiveRange] = useState("Monthly");
  const chartData = chartDataMap[activeRange];

  const { data: orders } = useOrders();
  const { data: products } = useProducts();


  

  const popularMenuItems = useMemo(() => {
    if (!products) return popularDishesMenu;
    return products.slice(0, 4).map((p) => ({
      id: p.id,
      name: p.name,
      serving: "01 person",
      price: `$${Number(p.price).toFixed(2)}`,
      status: "In Stock",
    }));
  }, [products]);

  const popularOrderItems = useMemo(() => {
    if (!orders) return popularDishesOrders;
    const itemMap = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.productId;
        if (!itemMap[key]) itemMap[key] = { ...item, count: 0, totalAmount: 0 };
        itemMap[key].count += item.quantity;
        itemMap[key].totalAmount += item.quantity * (item.price || 0);
      });
    });
    return Object.values(itemMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
      .map((item, i) => ({
        id: i,
        name: item.productName || item.name || "Item",
        qty: `x${item.count}`,
        unitPrice: `$${Number(item.price || 0).toFixed(2)}`,
        total: `$${Number(item.totalAmount).toFixed(2)}`,
        status: "In Stock",
      }));
  }, [orders]);

  const dailySales = useMemo(() => {
    if (!orders) return "$0";
    const today = new Date().toDateString();
    const total = orders
      .filter((o) => new Date(o.createdAt).toDateString() === today)
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return total >= 1000 ? `$${(total / 1000).toFixed(1)}k` : `$${total}`;
  }, [orders]);

  const occupiedTables = useMemo(() => {
    if (!orders) return "0 Tables";
    const active = orders.filter((o) => o.status === "PENDING" || o.status === "COOKING");
    const tables = new Set(active.map((o) => o.tableId).filter(Boolean));
    return `${tables.size} Tables`;
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <button className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
            <img
              src="https://placehold.co/32x32/2a2a2a/888?text=U"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex gap-4 flex-wrap">
        <StatCard label="Daily Sales" value={dailySales} sub={new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })} icon={DollarSign} />
        <StatCard label="Monthly Revenue" value="$55k" sub="1 Jan – 1 Feb" icon={TrendingUp} />
        <StatCard label="Table Occupancy" value={occupiedTables} sub="Currently occupied" icon={Table2} />
      </div>

      {/* Popular Dishes — two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Menu view */}
        <Card className="overflow-visible">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Popular Dishes</CardTitle>
            <button className="text-xs text-primary hover:underline">See All</button>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-6">
            {popularMenuItems.map((dish) => (
              <DishRow
                key={dish.id}
                name={dish.name}
                meta={`Serving: ${dish.serving}`}
                price={dish.price}
                status={dish.status}
              />
            ))}
          </CardContent>
        </Card>

        {/* Orders view */}
        <Card className="overflow-visible">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Popular Dishes</CardTitle>
            <button className="text-xs text-primary hover:underline">See All</button>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-6">
            {popularOrderItems.map((dish) => (
              <DishRow
                key={dish.id}
                name={dish.name}
                meta={`Order: ${dish.qty} ${dish.unitPrice}`}
                price={dish.total}
                status={dish.status}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Overview chart */}
      <Card className="overflow-visible">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-semibold">Overview</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Range toggles */}
            <div className="flex rounded-lg overflow-hidden border border-border">
              {["Monthly", "Daily", "Weekly"].map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    activeRange === range
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download size={14} />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-primary rounded-full inline-block" />
              <span className="text-xs text-muted-foreground">Sales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-muted-foreground rounded-full inline-block" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "var(--color-primary)" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-muted-foreground)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}