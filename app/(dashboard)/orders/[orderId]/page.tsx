"use client";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadIcon } from "lucide-react";
import Loader from "@/components/custom ui/Loader";

//Prikaz detaljnih informacija o odredjenoj porudzbini
const OrderDetails = ({ params }: { params: { orderId: string } }) => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!params.orderId) return;

      try {
        const res = await fetch(`/api/orders/${params.orderId}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setOrderDetails(data.orderDetails);
        setCustomer(data.customer);
      } catch (error) {
        console.error("Error loading order details:", error);
      }
    };

    fetchOrderDetails();
  }, [params.orderId]);

  if (!orderDetails || !customer) return <Loader />;

  const downloadPDF = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current, { useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`order_${orderDetails._id}.pdf`);
    }
  };

  const { street, city, postalCode, country } = orderDetails.shippingAddress;

  return (
    <div className="relative p-4 mt-5 sm:p-6">
      {/* Download Button */}
      <div className="absolute top-4 right-4 mr-10">
        <button
          onClick={downloadPDF}
          className="bg-gold text-white px-4 py-2 sm:px-6 sm:py-3 flex items-center space-x-2"
        >
          <DownloadIcon className="h-5 w-5" />
          <span>Download Invoice</span>
        </button>
      </div>

      {/* Printable Invoice */}
      <div
        ref={printRef}
        className="pt-14 px-4 sm:px-8 py-8 bg-white text-black max-w-full lg:max-w-4xl mx-auto border border-gray-300 shadow-lg sm:mx-0 lg:mx-auto"
      >
        {/* Header deo*/}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          {/* Invoice naslov */}
          <div>
            <p className="text-body-bold font-bold text-gray-900">INVOICE</p>
            <p className="text-sm text-gray-800 uppercase">#:{orderDetails._id}</p>
            <p className="text-sm text-gray-800">
              Date: {new Date(orderDetails.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Informacije o restoranu */}
          <div className="text-right mt-4 sm:mt-0">
            <h1 className="text-body-bold font-bold text-black">TSUBAKI Sushi Restaurant</h1>
            <p className="text-sm mt-1 text-gray-800">123 Sushi Street, Belgrade, Serbia</p>
            <p className="text-sm text-gray-800">+381 11 123456</p>
            <p className="text-sm text-gray-800">contact@tsubakisushi.com</p>
          </div>
        </div>

        {/* Informacije o kupcu i porucenim proizvodima */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-10">
          <div>
            <h3 className="text-body-bold font-bold text-black">Billed To:</h3>
            <p className="text-gray-900">{customer.name}</p>
            <p className="text-gray-900">
              {street}, {city}, {postalCode}, {country}
            </p>
          </div>
          <div className="text-body-bold text-right font-bold text-black">
            <p className="text-lg sm:text-xl font-semibold mb-2">Total Amount:</p>
            <p className="text-xl sm:text-2xl font-bold">{orderDetails.totalAmount} EUR</p>
          </div>
        </div>

        {/* Podaci o porucenim proizvodima */}
        <h3 className="text-body-bold font-bold text-black mb-4">Order Items:</h3>
        <div className="border border-gray-300 text-black mb-6">
          <ul className="divide-y divide-gray-200">
            {orderDetails.products.map((item: OrderItemType, index: number) => (
              <li key={index} className="py-4 px-4 sm:px-6 flex justify-between items-center text-right">
                <div className="text-black flex-1 text-left">{item.product.title}</div>
                
                <div className="text-black text-center flex-1">
                  {item.quantity} x {item.pieces}
                </div>

                {/* Proverava da li postoji popust */}
                {item.product.discount ? (
                  <div className="text-black flex-1 text-right">
                    <p className="line-through">{item.product.price} EUR</p>
                    <p className="text-sm">{item.product.discount}%</p>
                    <p className="font-bold">{item.product.discountedPrice} EUR</p>
                  </div>
                ) : (
                  <div className="text-black font-bold flex-1 text-right">
                    <p>{item.product.price} EUR</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-center text-grey">
          <p className="text-base font-light">
            This invoice is for internal use only. Please retain it as proof of transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
export const dynamic = "force-dynamic";