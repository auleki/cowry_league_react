import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function dbQueries () {
    const allUsers = await prisma.player.findMany()
    console.log({allUsers: allUsers[0]})
}

export default prisma