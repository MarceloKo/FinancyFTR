import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plainPassword, salt)
}

async function main() {
  console.log('🌱 Iniciando seed...')

  const existingUser = await prisma.user.findUnique({
    where: {
      email: 'user@financy.com',
    },
  })

  if (existingUser) {
    console.log('✅ Usuário de exemplo já existe!')
  } else {
    const hashedPassword = await hashPassword('user123')

    const user = await prisma.user.create({
      data: {
        name: 'Usuário Exemplo',
        email: 'user@financy.com',
        password: hashedPassword,
      },
    })

    console.log('✅ Usuário de exemplo criado com sucesso!')
    console.log('📧 Email: user@financy.com')
    console.log('🔑 Senha: user123')
    console.log('👤 ID:', user.id)

    const category1 = await prisma.category.create({
      data: {
        name: 'Alimentação',
        color: '#EA580C',
        userId: user.id,
      },
    })

    const category2 = await prisma.category.create({
      data: {
        name: 'Transporte',
        color: '#2563EB',
        userId: user.id,
      },
    })

    const category3 = await prisma.category.create({
      data: {
        name: 'Salário',
        color: '#16A34A',
        userId: user.id,
      },
    })

    console.log('✅ Categorias criadas com sucesso!')

    await prisma.transaction.create({
      data: {
        title: 'Salário Mensal',
        amount: 5000,
        type: 'income',
        date: new Date(),
        categoryId: category3.id,
        userId: user.id,
      },
    })

    await prisma.transaction.create({
      data: {
        title: 'Mercado',
        amount: 350,
        type: 'expense',
        date: new Date(),
        categoryId: category1.id,
        userId: user.id,
      },
    })

    await prisma.transaction.create({
      data: {
        title: 'Uber',
        amount: 45,
        type: 'expense',
        date: new Date(),
        categoryId: category2.id,
        userId: user.id,
      },
    })

    console.log('✅ Transações de exemplo criadas com sucesso!')
  }

  console.log('✨ Seed concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
