"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import Loader from "../custom ui/Loader";
import MultiText from "../custom ui/MultiText";
import MultiSelect from "../custom ui/MultiSelect";


// Definicija šeme za validaciju forme pomoću Zod biblioteke
const formSchema = z.object({
  title: z.string().min(2).max(30),
  description: z.string().min(1).max(700).trim(),
  ingredients: z.string().min(1).max(185).trim(),
  media: z.array(z.string()),
  category: z.string(),
  collections: z.array(z.string()),
  tags: z.array(z.string()),
  pieces: z.coerce.number().min(1).default(1),
  price: z.coerce.number(),
  discount: z.coerce.number().min(0).max(100).default(0),
});

interface ProductFormProps {
  initialData?: ProductType | null;
}
//Komponenta za prikaz kreiranja novog proizvoda
const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);  // Stanje za kolekcije
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);// Stanje za sniženu cenu
  const [isOpen, setIsOpen] = useState(false);

  // Funkcija za preuzimanje kolekcija
  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    getCollections(); // Preuzmi kolekcije prilikom montiranja komponente
  }, []);

  // Inicijalizacija forme sa React Hook Form i Zod za validaciju
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        ...initialData,
        collections: initialData.collections.map(
          (collection) => collection._id
        ),
        
      }
      : {
        description: "",
        media: [],
        category: "",
        collections: [],
        tags: [],
        pieces: 1,
        price: 0.1,
        ingredients: "",
        discount: 0,
        
      },
  });
  useEffect(() => {
    const price = form.watch("price");
    const discount = form.watch("discount");

    if (price && discount) {
      const discounted = price - (price * discount) / 100;
      setDiscountedPrice(parseFloat(discounted.toFixed(2))); // Postavi izračunatu cenu sa dva decimalna mesta
    }
  }, [form.watch("price"), form.watch("discount")]); // Gledaj promene u ceni i popustu
  // Funkcija za blokiranje unosa pri pritiskanju Enter tastera
  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Funkcija za obradu podataka forme prilikom slanja
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Product ${initialData ? "updated" : "created"}`);
        window.location.href = "/products";
        router.push("/products");
      }
    } catch (err) {
      console.log("[products_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };


  // Prikaz forme za kreiranje ili uređivanje proizvoda
  return loading ? (
    <Loader />
  ) : (
    <div className="p-10 bg-grey">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold font-playfair text-gold-1">Edit Product</p>
          <Delete id={initialData._id} item="product" />
        </div>
      ) : (
        <p className="text-heading2-bold font-playfair text-gold-1">Create Product</p>
      )}

      <Separator className="bg-gold mt-4 mb-7" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 font-montserrat text-gold-1">
          {/* Naziv */}
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl className="bg-grey text-gold-1">
                <Input placeholder="Title" {...field} onKeyDown={handleKeyPress} />
              </FormControl>
              <FormMessage className="text-red-1" />
            </FormItem>
          )} />

          {/* Opis */}
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl className="bg-grey text-gold-1">
                <Textarea placeholder="Description" {...field} rows={5} onKeyDown={handleKeyPress} />
              </FormControl>
              <FormMessage className="text-red-1" />
            </FormItem>
          )} />

          {/* Slika */}
          <FormField control={form.control} name="media" render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={(url) => field.onChange([...field.value, url])}
                  onRemove={(url) => field.onChange([...field.value.filter((image) => image !== url)])}
                />
              </FormControl>
              <FormMessage className="text-red-1" />
            </FormItem>
          )} />

          {/* Sekcija za cene, popuste i dodatne informacije */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Polje za cenu */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (EUR)</FormLabel>
                  <FormControl className="bg-grey text-gold-1">
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />

            {/* Polje za popust */}
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount %</FormLabel>
                  <FormControl className="bg-grey text-gold-1">
                    <Input
                      type="number"
                      placeholder="50"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />

            {/* Prikaz snižene cene */}
            {discountedPrice && (
              <div className="flex items-center mt-4 text-gold-1">
                <p>
                  Discounted Price:
                  <span className="text-white text-xl ml-2">{discountedPrice}€</span>
                </p>
              </div>
            )}
          </div>

          {/* Sekcija za dodatne informacije */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Polje za tagove */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl className="bg-grey text-gold-1">
                    <MultiText
                      placeholder="Tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange(
                          field.value.filter((tag) => tag !== tagToRemove)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />

            {/* Polje za sastojke */}
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl className="bg-grey text-gold-1">
                    <Input
                      placeholder="Enter ingredients, e.g., '200g flour, 1 tsp sugar'"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />

            {/* Polje za kategoriju */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl className="bg-grey text-gold-1">
                    <Input
                      placeholder="Category"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Sekcija za kolekcije i komade */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Polje za komade */}
            <FormField
              control={form.control}
              name="pieces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pieces</FormLabel>
                  <FormControl className="bg-grey text-gold-1">
                    <Input
                      type="number"
                      placeholder="Pieces"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Polje za kolekcije */}
            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl className="relative">
                      <MultiSelect
                        placeholder="Collections"
                        collections={collections}
                        value={field.value}
                        onChange={(_id) => field.onChange([...field.value, _id])}
                        onRemove={(idToRemove) =>
                          field.onChange(
                            field.value.filter(
                              (collectionId) => collectionId !== idToRemove
                            )
                          )
                        }
                        setOpen={setIsOpen}
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}
          </div>
          {/* Dugmad */}
          <div className="flex gap-10">
            <Button type="submit" className="bg-gold text-white">Save</Button>
            <Button type="button" onClick={() => router.push("/products")} className="bg-gold text-white">
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default ProductForm;
