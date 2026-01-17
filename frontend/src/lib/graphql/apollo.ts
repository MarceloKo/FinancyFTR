import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { useAuthStore } from '@/stores/auth'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/graphql'

const httpLink = new HttpLink({
  uri: backendUrl || 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError((errorResponse) => {
  const { graphQLErrors, networkError } = errorResponse as any

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }: any) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )

      if (message.includes('não autenticado')) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    })
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

export const client = new ApolloClient({
  link: from([errorLink as ApolloLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})
