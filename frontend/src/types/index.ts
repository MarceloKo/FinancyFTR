export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  color?: string
  userId: string
  createdAt: string
  updatedAt: string
  transactions?: Transaction[]
}

export interface Transaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string
  categoryId?: string
  category?: Category
  userId: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface TransactionSummary {
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface PaginatedTransactions {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TransactionFilterInput {
  search?: string
  type?: 'income' | 'expense'
  categoryId?: string
  month?: number
  year?: number
  page?: number
  limit?: number
}