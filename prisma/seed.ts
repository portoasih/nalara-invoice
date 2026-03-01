import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    await prisma.pricing.createMany({
        data: [
            { jenjang: "SD", type: "private", price: 30000 },
            { jenjang: "SD", type: "kelompok", price: 20000 },
            { jenjang: "SMP", type: "private", price: 40000 },
            { jenjang: "SMP", type: "kelompok", price: 30000 },
        ],
        skipDuplicates: true,
    })

    console.log("Pricing seeded 🌱")
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect())