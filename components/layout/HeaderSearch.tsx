"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useState, useEffect } from "react"

export default function HeaderSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    // Maintain a local state for immediate input feedback
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")

    // Sync input when URL changes externally (e.g. back button)
    useEffect(() => {
        setSearchTerm(searchParams.get("q") || "")
    }, [searchParams])

    const handleSearch = (term: string) => {
        setSearchTerm(term)

        startTransition(() => {
            const params = new URLSearchParams(searchParams)
            if (term) {
                params.set("q", term)
            } else {
                params.delete("q")
            }

            // Only update router if we're on a searchable page
            if (pathname === "/siswa" || pathname === "/" || pathname === "/invoice") {
                router.replace(`${pathname}?${params.toString()}`)
            }
        })
    }

    // Hide search on edit/tambah/detail pages where it's not applicable
    const isEditingUser = pathname === "/siswa/tambah" || pathname.startsWith("/siswa/edit/")
    const isViewingOrEditingInvoice = pathname === "/invoice/buat" || (pathname.startsWith("/invoice/") && pathname !== "/invoice")

    if (isEditingUser || isViewingOrEditingInvoice) {
        return null
    }

    return (
        <label className="hidden sm:flex flex-col min-w-40 h-11 max-w-sm w-full relative">
            <div className={`flex w-full flex-1 items-stretch rounded-xl h-full bg-[#98fb98]/30 border border-[#00a36c]/20 focus-within:ring-2 focus-within:ring-[#00a36c]/50 focus-within:border-[#00a36c] transition-all ${isPending ? "opacity-70" : ""}`}>
                <div className="text-[#00a36c] flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 text-[#00a36c] placeholder:text-[#00a36c]/50 px-3 text-sm font-normal outline-none"
                    placeholder={pathname === "/siswa" ? "Cari nama siswa..." : "Cari invoice atau siswa..."}
                />
                {isPending && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="size-4 animate-spin rounded-full border-2 border-[#00a36c] border-t-transparent" />
                    </div>
                )}
            </div>
        </label>
    )
}
