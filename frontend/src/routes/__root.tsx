import { Outlet, createRootRoute } from "@tanstack/react-router"
import React, { Suspense } from "react"

import NotFound from "../components/Common/NotFound"

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

export const Route = createRootRoute({
  component: () => (
        /**
     * This method is responsible for rendering the TanStackRouterDevtools component. 
     * The Outlet component is also rendered which serves as the placeholder for any child routes.
     * The TanStackRouterDevtools component is wrapped inside the Suspense component to allow for 
     * lazy loading and better performance. This means that the TanStackRouterDevtools component 
     * will only be rendered when it's needed, reducing the initial load time.
     *
     * The empty tags (<></>) at the start and end of the method are shorthand for React's Fragment
     * component, which lets you aggregate a list of children without adding extra nodes to 
     * the DOM.
     */
    <>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
  notFoundComponent: () => <NotFound />,
})
