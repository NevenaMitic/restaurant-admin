import Collection from "@/lib/models/Collection"
import { connectToDB } from "@/lib/mongoDB"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

// Handler za POST zahtev za kreiranje nove kolekcije
export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth() // Autentifikacija korisnika

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    await connectToDB()
    // Dohvatanje podataka iz zahteva iz baze
    const { title, description, image } = await req.json()

     // Provera da li već postoji kolekcija sa istim nazivom
    const existingCollection = await Collection.findOne({ title })

    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400 })
    }

    if (!title || !image) {  // Provera da li su svi obavezni podaci prisutni
      return new NextResponse("Title and image are required", { status: 400 })
    }

    // Kreiranje nove kolekcije
    const newCollection = await Collection.create({
      title,
      description,
      image,
    })

    await newCollection.save() // i cuvanje u bazi 
    return NextResponse.json(newCollection, { status: 200 })
    
  } catch (err) {
    console.log("[collections_POST]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
// Handler za GET zahtev za preuzimanje svih kolekcija
export const GET = async (req: NextRequest) => {
  try {
    await connectToDB()

    // Pronalazak svih kolekcija i sortiranje po datumu kreiranja (opadajuće)
    const collections = await Collection.find().sort({ createdAt: "desc" })

    return NextResponse.json(collections, { status: 200 })
  } catch (err) {
    console.log("[collections_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic"; // Prisiljavanje dinamičkog renderovanja