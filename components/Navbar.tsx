"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavbarPoints from '@/components/ui/NavbarPoints'
import { Work_Sans } from 'next/font/google'
import { UserNav } from './user-nav'

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Play', path: '/languages' },
    // { name: 'Levels', path: '/levels' },
    { name: 'About', path: '/about' },
    { name: 'Store', path: '/shopPage' },
  ]

  return (
    <nav
    className={`p-4 flex justify-between items-center bg-[#FFFBE8] font-semibold ${workSans.className} relative z-50`}
  >
    <div className="flex gap-4">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.path}
          className={`px-4 py-2 font-bold hover:scale-110 transition-transform ${
            pathname === item.path
              ? 'bg-[#FF9000] text-white rounded-full'
              : 'text-[#594F43]'
          }`}
        >
          {item.name}
        </Link>
      ))}
      <NavbarPoints />
    </div>
    <div className="flex items-center">
      <UserNav />
    </div>
  </nav>  
  )
}

