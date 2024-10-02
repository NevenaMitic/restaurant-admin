"use client"
import { DataTable } from "@/components/custom ui/DataTable"
import Loader from "@/components/custom ui/Loader"
import { columns } from "@/components/orders/OrderColumns"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

//Prikaz svih porudžbina
const Orders = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([]) // Stanje za čuvanje porudžbina

  // Funkcija za preuzimanje porudžbina sa servera
  const getOrders = async () => {
    try {
      const res = await fetch(`/api/orders`) 
      const data = await res.json()  // Parsira odgovor kao JSON
      setOrders(data)
      setLoading(false)
    } catch (err) {
      console.log("[orders_GET", err)
    }
  }
  // useEffect hook za pozivanje funkcije getOrders pri prvom renderovanju
  useEffect(() => {
    getOrders()
  }, [])

  return loading ? <Loader /> : (
    <div className="p-10 bg-grey h-screen text-gold-1">
      <p className="text-heading2-bold font-playfair">Orders</p>
      <Separator className="bg-gold my-5"/>
      <DataTable columns={columns} data={orders} searchKey="_id"/>
    </div>
  )
}

export const dynamic = "force-dynamic";
export default Orders