import Customer from "../models/Customer";
import Order from "../models/Order";
import { connectToDB } from "../mongoDB";

// Funkcija za dobijanje ukupnih prodaja
export const getTotalSales = async () => {
  await connectToDB();
  const orders = await Order.find(); // Preuzimanje svih narudžbina
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0).toFixed(2); // Ukupni prihod iz svih narudžbina
  return { totalOrders, totalRevenue };
};

// Funkcija za dobijanje ukupnog broja kupaca
export const getTotalCustomers = async () => {
  await connectToDB();
  const customers = await Customer.find();
  const totalCustomers = customers.length;
  return totalCustomers;
};

// Funkcija za dobijanje prodaje po mesecima
export const getSalesPerMonth = async () => {
  await connectToDB();
  const orders = await Order.find();

  // Grupisanje prodaje po mesecima
  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth(); // Dobijanje indeksa meseca iz datuma narudžbine
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount; // Dodavanje iznosa narudžbine za odgovarajući mesec

    return acc;
  }, {});

  // Kreiranje podataka za grafikon
  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i));
    return { name: month, sales: salesPerMonth[i] || 0 }; // Vraća naziv meseca i prodaju za taj mesec
  });

  return graphData;
};