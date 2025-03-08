"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, User, LogIn } from "lucide-react"
import { useAuth } from "@/providers/AuthProvider"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "proposals", href: "/investor-proposals" },
  ]

  const isActive = (path: string) => pathname === path

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
  
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-[97%] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mx-10">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="hidden font-bold sm:inline-block">Ashitaka</span>
          </Link>
        </div>

        <nav className="hidden md:flex md:gap-x-6 lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-x-4">
            {isAuthenticated ? (
                <div className="relative">
                <div
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <img
                        src="next.svg"
                        alt="User Profile"
                        className="w-8 h-8 rounded-full border object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700">
                    {user?.username || "User"}
                    </span>
                </div>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <ul className="py-1">
                        {/* <li onClick={() => setIsDropdownOpen(false)}>
                            <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                My Profile
                            </Link>
                        </li> */}
                        <li onClick={() => setIsDropdownOpen(false)}>
                            <Link href="/create-form" className="block px-4 py-2 hover:bg-gray-100">
                                Create/Edit forms
                            </Link>
                        </li>
                        <li onClick={() => setIsDropdownOpen(false)}>
                            <Link href="/create-proposal" className="block px-4 py-2 hover:bg-gray-100">
                                Create a proposal
                            </Link>
                        </li>
                        <li onClick={() => setIsDropdownOpen(false)}>
                            <Link href="/investor-dashboard" className="block px-4 py-2 hover:bg-gray-100">
                                Investor dashboard
                            </Link>
                        </li>
                        <li onClick={() => setIsDropdownOpen(false)}>
                            <Link href="/user-dashboard" className="block px-4 py-2 hover:bg-gray-100">
                                User dashboard
                            </Link>
                        </li>
                        <li onClick={() => setIsDropdownOpen(false)}>
                          <button
                              onClick={logout}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                              Log Out
                          </button>
                        </li>
                    </ul>
                    </div>
                )}
                </div>
            ) : (
                <>
                <Link href="/auth">
                    <Button variant="outline" size="sm" className="gap-1">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                    </Button>
                </Link>
                <Link href="/auth?tab=signup">
                    <Button size="sm" className="gap-1">
                    <User className="h-4 w-4" />
                    <span>Sign Up</span>
                    </Button>
                </Link>
                </>
            )}
            </div>

        <div className="flex md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                    <span className="font-bold">Ashitaka</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                <nav className="flex flex-col gap-4 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-base font-medium transition-colors hover:text-primary ${
                        isActive(item.href) ? "text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto border-t pt-6 flex flex-col gap-3">
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Button>
                  </Link>
                  <Link href="/auth?tab=signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header