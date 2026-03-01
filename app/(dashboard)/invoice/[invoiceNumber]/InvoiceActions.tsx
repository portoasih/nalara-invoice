'use client'

import { toJpeg } from 'html-to-image'
import { useState } from 'react'

export default function InvoiceActions({
    invoiceNumber,
    studentName,
    sessionCount,
    totalAmount
}: {
    invoiceNumber: string
    studentName: string
    sessionCount: number
    totalAmount: number
}) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExportJpg = async () => {
        try {
            setIsExporting(true)
            const element = document.getElementById('invoice-printable')
            if (!element) return

            // small delay to ensure rendering is complete
            await new Promise((resolve) => setTimeout(resolve, 100))

            const dataUrl = await toJpeg(element, {
                quality: 0.95,
                backgroundColor: 'white',
                // Bypass cross-origin CSS rule checking (e.g. from Google Fonts or Tailwind Play CDN if any)
                style: {
                    transform: 'scale(1)', // Ensure no zoom scaling issues
                    transformOrigin: 'top left',
                },
                filter: (node: HTMLElement) => {
                    // Filter out external stylesheets or problematic nodes if needed
                    // Sometimes Next.js dev server injects a problematic style tag
                    if (node.tagName === 'STYLE') {
                        const styleNode = node as HTMLStyleElement;
                        if (styleNode.sheet) {
                            try {
                                // This will intentionally fail if it's cross-origin, allowing us to catch and skip it
                                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                styleNode.sheet.cssRules;
                            } catch (e) {
                                return false; // Skip this node
                            }
                        }
                    }
                    return true;
                }
            })
            const link = document.createElement('a')
            link.download = `Invoice-${invoiceNumber}.jpg`
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error('Failed to export invoice', err)
            alert('Gagal mengekspor invoice sebagai JPG. Error: ' + (err instanceof Error ? err.message : String(err)))
        } finally {
            setIsExporting(false)
        }
    }

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number)
    }

    const whatsappMessage =
        `Assalamualaikum ibu/bunda 🙏

Berikut saya kirimkan invoice tagihan bimbel:

Nama siswa: ${studentName}
Jumlah pertemuan: ${sessionCount} kali
Total pembayaran: ${formatRupiah(totalAmount)}

Detail invoice dapat dilihat pada link berikut:
${typeof window !== 'undefined' ? window.location.origin : ''}/invoice/${invoiceNumber}

Pembayaran dapat dilakukan via:

• BSI  
7268156806  
a.n Mutiara Sekar Kinasih  

• GoPay  
08112657217  
a.n Mutiara Sekar Kinasih  

Terima kasih banyak atas perhatian dan kerjasamanya 🙏`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

    return (
        <div className="flex gap-4">
            <button
                onClick={handleExportJpg}
                disabled={isExporting}
                className="bg-[#00A36C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
                {isExporting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                )}
                {isExporting ? 'Proses...' : 'Unduh JPG'}
            </button>
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all"
            >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.061-4.512 10.063-10.058.001-2.69-1.046-5.216-2.947-7.117-1.9-1.901-4.427-2.947-7.113-2.948-5.548 0-10.06 4.513-10.062 10.059 0 2.125.546 4.2 1.54 5.942l-.993 3.626 3.712-.973zm9.674-6.997c-.31-.156-1.838-.906-2.123-1.01-.285-.104-.493-.156-.701.156-.207.312-.804 1.01-.984 1.217-.181.208-.362.233-.672.078-.31-.156-1.312-.484-2.498-1.543-.922-.823-1.545-1.838-1.726-2.15-.181-.313-.019-.482.136-.636.14-.139.31-.362.466-.544.156-.181.207-.311.31-.518.104-.207.052-.389-.026-.544-.077-.156-.701-1.687-.961-2.311-.252-.607-.51-.524-.701-.533-.18-.008-.389-.01-.596-.01-.207 0-.544.078-.83.389-.285.311-1.088 1.063-1.088 2.592 0 1.529 1.114 3.007 1.269 3.214.156.207 2.192 3.347 5.313 4.695.741.32 1.319.511 1.77.653.746.237 1.424.204 1.96.124.597-.089 1.838-.751 2.097-1.478.259-.727.259-1.349.181-1.478-.077-.129-.284-.207-.595-.363z"></path></svg>
                WhatsApp
            </a>
        </div>
    )
}
