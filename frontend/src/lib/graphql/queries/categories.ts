import { gql } from '@apollo/client'

export const LIST_CATEGORIES = gql`
  query ListCategories {
    listCategories {
      id
      name
      color
      createdAt
      updatedAt
    }
  }
`

export const GET_CATEGORY = gql`
  query GetCategory($id: String!) {
    getCategory(id: $id) {
      id
      name
      color
      createdAt
      updatedAt
    }
  }
`
