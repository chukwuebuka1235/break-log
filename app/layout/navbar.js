'use client'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const Navbar = () => {
    const router = useRouter()
    return (
      <nav className="bg-[#fef2f2] shadow-sm ">
        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <section className="flex items-center">
            <Image
              src="/logo.svg"
              alt="logo"
              width={70}
              height={40}
              onClick={() => router.push("/")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            {/* <h1 className="ml-3 text-xl font-semibold text-gray-800 hidden sm:block">
              Break Tracker
            </h1> */}
          </section>

          <section>
            <Link
              href="/admin"
              className="bg-[#ec3338] text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors font-medium">
              Admin Login
            </Link>
          </section>
        </div>
      </nav>
    );
}