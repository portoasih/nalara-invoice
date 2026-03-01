"use client"

import "../../app/globals.css"
import { usePathname } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import HeaderSearch from "@/components/layout/HeaderSearch"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navLinks = [
        { name: "Dashboard", href: "/", icon: "dashboard", activePath: "/" },
        { name: "Siswa", href: "/siswa", icon: "school", activePath: "/siswa" },
        { name: "Invoice", href: "/invoice", icon: "receipt_long", activePath: "/invoice" }
    ]

    return (
        <div className="flex h-screen bg-[#ecffdc] text-slate-900 font-display font-['Lexend',_sans-serif]">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 bg-white/80 backdrop-blur-md border-r border-[#00a36c]/10 flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-[#00a36c]/10">
                    <div className="size-8 flex items-center justify-center bg-[#00a36c] rounded-lg text-white">
                        <span className="material-symbols-outlined text-xl">description</span>
                    </div>
                    <h2 className="text-[#00a36c] text-xl font-bold tracking-tight">Nalara Invoice</h2>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navLinks.map((link) => {
                        const isActive = link.activePath === "/"
                            ? pathname === "/"
                            : pathname.startsWith(link.activePath)

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                                    ? "bg-[#00a36c]/10 text-[#00a36c] font-bold"
                                    : "text-[#00a36c]/70 hover:bg-[#00a36c]/5 hover:text-[#00a36c]"
                                    }`}
                            >
                                <span className="material-symbols-outlined">{link.icon}</span>
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                {!(pathname.startsWith("/invoice/") && pathname !== "/invoice" && pathname !== "/invoice/buat") && (
                    <header className="h-20 bg-[#ecffdc]/80 backdrop-blur-md border-b border-[#00a36c]/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 w-full">
                        <div className="md:hidden flex items-center gap-2">
                            <div className="size-8 flex items-center justify-center bg-[#00a36c] rounded-lg text-white">
                                <span className="material-symbols-outlined text-xl">description</span>
                            </div>
                            <h2 className="text-[#00a36c] text-lg font-bold tracking-tight">Nalara Invoice</h2>
                        </div>
                        <div className="flex-1 flex justify-end md:justify-start">
                            <Suspense fallback={<div className="h-11 w-64 animate-pulse bg-white/50 rounded-xl"></div>}>
                                <HeaderSearch />
                            </Suspense>
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#00a36c]/10 flex justify-around items-center h-16 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {navLinks.map((link) => {
                    const isActive = link.activePath === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.activePath)

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive
                                ? "text-[#00a36c]"
                                : "text-slate-400 hover:text-[#00a36c]/70"
                                }`}
                        >
                            <span className="material-symbols-outlined text-[24px]">{link.icon}</span>
                            <span className="text-[10px] font-bold">{link.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
