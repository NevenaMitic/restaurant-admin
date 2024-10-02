"use client"
import { useState } from "react";
import {  X  } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface DeleteProps {
  item: string; 
  id: string; 
}
// Komponenta za brisanje
const Delete: React.FC<DeleteProps> = ({ item, id }) => {
  const [loading, setLoading] = useState(false);

 // Funkcija koja se poziva kada se potvrdi brisanje
  const onDelete = async () => {
    try {
      setLoading(true)
      const itemType = item === "product" ? "products" : "collections" // Odredjuje tip stavke za API poziv
      const res = await fetch(`/api/${itemType}/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setLoading(false)
        window.location.href = (`/${itemType}`) // Preusmerava korisnika na stranicu sa stavkama
        toast.success(`${item} deleted`)
      }
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong! Please try again.")
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-gold text-white w-8 h-8 p-0 rounded-full flex items-center justify-center">
          <X className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-grey font-montserrat text-white">
        {/*Header*/}
        <AlertDialogHeader>
          <AlertDialogTitle className="text-heading3-bold">Delete</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your {item}!
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/*Footer*/}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-gold text-white" onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}  

export default Delete;