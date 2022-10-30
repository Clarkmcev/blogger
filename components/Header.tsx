import Link from 'next/link'
import React from 'react'
import logo from '../img/BloggerLogo.png'

function Header() {
  return (
    <div className="flex justify-between p-5 max-w-7xl x-auto mx-auto">
        <div className="flex items-center space-x-5">
            <div>
                <Link href="/">
                    <img src={logo.src} className="w-44 object-contain cursor-pointer" alt=""/>
                </Link>
            </div>

            <div className="hidden md:inline-flex items-center space-x-5">
                <h3 className="cursor-pointer">About</h3>
                <h3 className="cursor-pointer">Contact</h3>
                <h3 className="text-white bg-green-600 py-1 px-4 rounded-full cursor-pointer">Follow</h3>
            </div>
        </div>

            <div className="flex items-center space-x-5 text-green-600">
                <h3 className="cursor-pointer">Sign In</h3>
                <h3 className="border px-4 py-1 rounded-full border-green-600 cursor-pointer">Get Started</h3>
            </div>
    </div>
  )
}

export default Header