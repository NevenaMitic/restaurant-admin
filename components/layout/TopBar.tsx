"use client"
import { navLinks } from "@/lib/constants"
import { UserButton } from "@clerk/nextjs"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

//Navigacija za srednje i male ekrane
const TopBar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const pathName = usePathname();

    return (
        <div className="sticky top-0 z-20 w-full flex justify-between items-center bg-grey lg:hidden">
         <Image src="/logo.png" alt="logo" width={150} height={100} priority/>

            <div className="flex gap-8 max-md:hidden">
                {navLinks.map((link) => (
                    <Link
                    href={link.url}
                    key={link.label} 
                    className={`flex gap-4 text-body-bold font-playfair  ${pathName === link.url ?  "text-white" : "text-gold-1"}`}>
                     <p>{link.label}</p> 
                    </Link>
                ))}
            </div>

            <div className="relative flex gap-4 items-center mx-5">
                <Menu 
                className="cursor-pointer md:hidden text-gold-1" 
                onClick={() => setDropdownMenu(!dropdownMenu)}/>

                    {dropdownMenu && (
                        <div className="absolute top-10 right-6 flex flex-col gap-8 p-5 bg-grey shadow-xl rounded-lg">
                        {navLinks.map((link) => (
                            <Link
                            href={link.url}
                            key={link.label} 
                            className={`flex gap-4 text-body-bold font-playfair  ${pathName === link.url ?  "text-white" : "text-gold-1"}`}>
                                {link.icon} <p>{link.label}</p> 
                            </Link>
                        ))}
                        </div>
                    )}
              <UserButton afterSignOutUrl="/login" />
            </div>
        </div>
    );
};
export default TopBar;