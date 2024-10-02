import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { Euro, ShoppingBag, UserRound } from "lucide-react";

//Prikaz pocetne strane Dashboard sa informacijama o prodaji
export default async function Home() {
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();
  const graphData = await getSalesPerMonth();

  return (
    <div className="bg-grey text-gold-1 px-8 py-10 min-h-screen">
      <p className="text-heading2-bold font-playfair">Dashboard</p>
      <Separator className="bg-gold my-5" />

      <div className="grid grid-cols-2 mt-5 md:grid-cols-3 gap-10">
        <Card className="border border-gold shadow-lg shadow-gold-500 animate-fade-in">
          <CardHeader className="flex flex-row justify-between font-montserrat text-body-bold items-center">
            <CardTitle>Total Revenue</CardTitle>
            <Euro className="max-sm:hidden text-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalRevenue} EUR</p>
          </CardContent>
        </Card>

        <Card className="border border-gold shadow-lg shadow-gold-500 animate-fade-in">
          <CardHeader className="flex flex-row justify-between items-center font-montserrat text-body-bold">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingBag className="max-sm:hidden text-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card className="border border-gold shadow-lg shadow-gold-500 animate-fade-in">
          <CardHeader className="flex flex-row justify-between items-center font-montserrat text-body-bold">
            <CardTitle>Total Customers</CardTitle>
            <UserRound className="max-sm:hidden text-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10 border border-gold text-gold-1 shadow-lg shadow-gold-500 animate-fade-in">
        <CardHeader className="font-montserrat text-body-bold">
          <CardTitle>Sales Chart (EUR)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}


