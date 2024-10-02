"use client";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { navLinks } from "@/lib/constants";

//Navigacija na levoj strani ekrana za velike ekrane
const LeftSideBar = () => {
    const pathName = usePathname();
    const { user } = useUser(); 

    const userName = user ? user.firstName || 'User' : 'User';

    return (
        <div
            className="h-screen left-0 top-0 sticky p-11 flex flex-col gap-16 max-lg:hidden"
            style={{ backgroundImage: 'url("/background1.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>

            <Image src="/logo.png" alt="logo" width={210} height={0} priority />
    
            <div className="flex flex-col gap-12 font-montserrat">
                {navLinks.map((link) => (
                    <Link
                        href={link.url}
                        key={link.label}
                        className={`flex gap-4 text-body-bold ${pathName === link.url ? "text-white" : "text-gold-1"}`}
                    >
                        {link.icon} <p>{link.label}</p>
                    </Link>
                ))}
            </div>
    
            <div className="flex gap-4 text-body-bold items-center font-montserrat text-gold-1">
                <UserButton afterSignOutUrl="/login" />
                <p>{userName}</p>
            </div>
        </div>
    );
}
    export default LeftSideBar;
    