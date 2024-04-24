import { Flex, Spinner } from "@chakra-ui/react"
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import Sidebar from "../components/Common/Sidebar"
import UserMenu from "../components/Common/UserMenu"
import useAuth, { isLoggedIn } from "../hooks/useAuth"

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      })
    }
  },
})

/**
 * `Layout` is a functional component that creates a webpage layout including a sidebar, main content area and user menu. 
 * The main content area displays either a loading spinner or the content from the current route, based on the authentication status.
 * 
 * The component uses the `useAuth` hook to check if the authentication-related tasks are still in progress (isLoading). 
 * 
 * If the authentication is still in progress (`isLoading` is true), it displays a spinner in the center of the main content area. 
 * If the authentication-related tasks are finished (`isLoading` is false), it renders the content of the current route (Outlet).
 *
 * The layout is flexible with a maximum width set to "large". The height is set to "auto" and the position is "relative".
 */
function Layout() {
  const { isLoading } = useAuth()

  return (
    <Flex maxW="large" h="auto" position="relative">
      <Sidebar />
      {isLoading ? (
        <Flex justify="center" align="center" height="100vh" width="full">
          <Spinner size="xl" color="ui.main" />
        </Flex>
      ) : (
        <Outlet />
      )}
      <UserMenu />
    </Flex>
  )
}
