// app/_components/navbar-client.tsx
"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NavbarClient = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/transactions", label: "Transações" },
    { href: "/subscription", label: "Assinatura" },
  ];

  return (
    <nav className="flex items-center justify-between border-b border-solid bg-background px-3 py-3 sm:px-6 sm:py-4">
      {/* Lado esquerdo: Logo + Links de navegação (Desktop) */}
      <div className="flex items-center gap-10">
        <Image
          src="/logo.svg"
          width={120}
          height={28}
          alt="Finance Ai"
          className="h-7 w-auto sm:h-8"
        />

        {/* Links de navegação no lado esquerdo - Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "font-bold text-primary"
                  : "text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Lado direito: UserButton + Menu mobile */}
      <div className="flex items-center gap-3">
        {/* UserButton */}
        <div className="hidden md:block">
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="md:hidden">
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Hambúrguer menu - só aparece no mobile */}
        <button
          onClick={toggleMobileMenu}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted md:hidden"
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu}
          />

          <div className="fixed right-0 top-0 z-50 h-screen w-64 translate-x-0 transform bg-background shadow-xl transition-transform duration-300 ease-in-out md:hidden">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <Image
                src="/logo.svg"
                width={100}
                height={24}
                alt="Finance Ai"
                className="h-6 w-auto"
              />
              <button
                onClick={closeMobileMenu}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col space-y-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavbarClient;
