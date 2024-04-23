import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"
import { routeTree } from "./routeTree.gen"

import { StrictMode } from "react"
import { OpenAPI } from "./client"
import theme from "./theme"

OpenAPI.BASE = import.meta.env.VITE_API_URL
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") || ""
}

const queryClient = new QueryClient()

const router = createRouter({ routeTree })
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    /**
   * This is a method that wraps the main/root React component within various Provider components.
   * 
   * - <StrictMode> is a wrapper component which checks for potential problems in the application during development.
   * - <ChakraProvider> is a theme provider from Chakra UI where the theme object allows us to define our application's color palette, type scale, font, and more.
   * - <QueryClientProvider> is a React context provider from React Query. It provides a React Query client instance to the rest of the React component tree.
   * - <RouterProvider> is a React context provider for hookrouter. It provides routing capabilities to the rest of the React component tree.
   * 
   * The wrapped component or components will have access to all of these contexts.
   */
  <StrictMode>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ChakraProvider>
  </StrictMode>,
)
