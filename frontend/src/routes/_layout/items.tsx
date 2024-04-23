import {
  Container,
  Flex,
  Heading,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { ItemsService } from "../../client"
import ActionsMenu from "../../components/Common/ActionsMenu"
import Navbar from "../../components/Common/Navbar"

export const Route = createFileRoute("/_layout/items")({
  component: Items,
})

/**
 * ItemsTableBody is a functional component that fetches items data from ItemsService and renders it as a table body.
 * Each row of the table corresponds to an item and has columns for the item's ID, title, description, and actions.
 *
 * It uses the useSuspenseQuery hook to fetch data, passing an object that contains a queryKey and a queryFn.
 * The queryKey is an array containing a single string, "items".
 * The queryFn is a function that calls the readItems method from the ItemsService, passing an empty object.
 *
 * The returned JSX renders a Tbody component which houses the table rows.
 * Each item's data is mapped into a Tr component, where the key prop is the item's id.
 * Each Tr component contains four Td components, each containing one piece of data from the item object.
 * The first Td contains the item's id, the second contains the item's title, and the third contains the item's description.
 * If an item doesn't have a description, it will display "N/A" and the text color will be "ui.dim". If it does, the text color is "inherit".
 * The fourth Td contains an ActionsMenu component, where the type prop is "Item" and the value prop is the item object.
 */
function ItemsTableBody() {
  const { data: items } = useSuspenseQuery({
    queryKey: ["items"],
    queryFn: () => ItemsService.readItems({}),
  })

  return (
    <Tbody>
      {items.data.map((item) => (
        <Tr key={item.id}>
          <Td>{item.id}</Td>
          <Td>{item.title}</Td>
          <Td color={!item.description ? "ui.dim" : "inherit"}>
            {item.description || "N/A"}
          </Td>
          <Td>
            <ActionsMenu type={"Item"} value={item} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  )
}
/**
 * A function component that renders a table of items. The table layout includes headers for "ID", "Title", "Description", 
 * and "Actions". It uses the `ErrorBoundary` component to handle any errors that occur when rendering the table body. When 
 * in a loading state, it shows a skeleton UI with 5 rows and 4 columns. The actual table body is fetched and rendered lazily 
 * using the `Suspense` component which falls back to the skeleton UI until the `ItemsTableBody` component is ready to be rendered.
 *
 * @return {JSX.Element} A table wrapped in a container, with a header and body. The body either displays the actual data or
 * fallback UI elements depending on whether an error occurred or if the data is still loading.
 */
function ItemsTable() {
  return (
    <TableContainer>
      <Table size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <Tbody>
              <Tr>
                <Td colSpan={4}>Something went wrong: {error.message}</Td>
              </Tr>
            </Tbody>
          )}
        >
          <Suspense
            fallback={
              <Tbody>
                {new Array(5).fill(null).map((_, index) => (
                  <Tr key={index}>
                    {new Array(4).fill(null).map((_, index) => (
                      <Td key={index}>
                        <Flex>
                          <Skeleton height="20px" width="20px" />
                        </Flex>
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            }
          >
            <ItemsTableBody />
          </Suspense>
        </ErrorBoundary>
      </Table>
    </TableContainer>
  )
}

/**
 * Items is a functional component that renders the Items Management page.
 * The page includes a page heading, a Navbar, and a table of items. 
 * 
 * The heading is responsive - centered on small screens (base) and left-aligned on medium and larger screens (md and up). 
 * Padding top (pt) is set to 12 for the heading.
 * 
 * The Navbar specifically handles item-related navigation options, indicated by the type prop set to "Item".
 * 
 * The ItemsTable component displays the actual table of items.
 * 
 * The entire page is wrapped in a Container component with its maxW (maximum width) property set to "full", 
 * allowing the page to take up the full width of the viewport.
 */
function Items() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Items Management
      </Heading>

      <Navbar type={"Item"} />
      <ItemsTable />
    </Container>
  )
}
