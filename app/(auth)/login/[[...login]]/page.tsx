import { ClerkLoaded, SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
    return (
        <div className="relative h-screen w-screen">
            <div className="absolute inset-0">
                <Image
                    src="/background.jpg"
                    alt="Background image"
                    fill
                    style={{
                        objectFit: "cover",
                    }}
                    quality={100}
                    priority
                />
            </div>

            <div className="absolute inset-0 bg-black opacity-40 "></div>

            <div className="relative flex h-full">
                {/* Leva strana ekrana */}
                <div className="flex-1 flex justify-center items-center">
                    <ClerkLoaded>
                        <SignIn path="/login" />
                    </ClerkLoaded>
                </div>

                {/* Desna strana ekrana */}
                <div className="flex-1 md:flex hidden flex-col justify-center items-center bg-gray-200 bg-opacity-5 backdrop-blur-sm">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        style={{ width: "380px", height: "auto" }}
                        
                    />
                    <div className=" text-center">
                        <p className="text-heading1-bold font-playfair text-gold-1">
                            TSUBAKI - Admin Portal
                        </p>
                        <p className="mt-11 text-heading4 font-playfair text-white">
                        Sign in to effectively manage the store, gain insights from analytics, and oversee all tasks.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
