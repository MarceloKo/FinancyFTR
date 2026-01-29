import { gql } from '@apollo/client'

export const LIST_TRANSACTIONS = gql`
  query ListTransactions($filters: TransactionFilterInput) {
    listTransactions(filters: $filters) {
      transactions {
        id
        title
        amount
        type
        date
        categoryId
        category {
          id
          name
          color
        }
        createdAt
        updatedAt
      }
      total
      page
      limit
      totalPages
    }
  }
`

export const GET_TRANSACTION = gql`
  query GetTransaction($id: String!) {
    getTransaction(id: $id) {
      id
      title
      amount
      type
      date
      categoryId
      category {
        id
        name
        color
      }
      createdAt
      updatedAt
    }
  }
`
