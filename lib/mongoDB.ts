import mongoose from "mongoose";

let isConnected: boolean = false; // Status veze

// Funkcija za povezivanje sa MongoDB bazom podataka
export const connectToDB = async (): Promise<void> => {
    mongoose.set("strictQuery", true)

    if (isConnected) { // Proverava da li je već uspostavljena veza
        console.log("MongoDB is already connected");
        return;
    }
    try {
        // Povezuje se sa MongoDB koristeći URL iz environment varijable
        await mongoose.connect(process.env.MONGODB_URL || "", {
            dbName: "Restaurant_Admin"
        })
        isConnected = true;
        console.log("MongoDB is connected")
    } catch (error) {
        console.log(error)
    }
}