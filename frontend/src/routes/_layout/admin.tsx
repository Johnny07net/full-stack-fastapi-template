import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { Suspense } from "react"
import { type UserPublic, UsersService } from "../../client"
import ActionsMenu from "../../components/Common/ActionsMenu"
import Navbar from "../../components/Common/Navbar"

export const Route = createFileRoute("/_layout/admin")({
  component: Admin,
})

const MembersTableBody = () => {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

  const { data: users } = useSuspenseQuery({
    queryKey: ["users"],
    queryFn: () => UsersService.readUsers({}),
  })

  return (
        /**
     * This component renders a table body (`<Tbody>`) that lists all the users in the `users.data` array.
     * Each entry is a table row (`<Tr>`) with the following columns:
     * 
     * 1. Full Name: In case the `full_name` property is not available, it displays `N/A`. Also, it includes a badge indicating the current user.
     * 2. Email: Displays the user's email.
     * 3. Role: Displays if the user is a 'Superuser' or a 'User'.
     * 4. Status: Displays the user's activity status. A green circle indicates the user is active, a red one indicates the user is inactive.
     * 5. Action: This column contains an action menu where user-related actions can be performed. However, actions are disabled for the current logged-in user.
     *
     * It is a TypeScript React Function Component that uses the Chakra-UI library for UI elements.
     */
    <Tbody>
      {users.data.map((user) => (
        <Tr key={user.id}>
          <Td color={!user.full_name ? "ui.dim" : "inherit"}>
            {user.full_name || "N/A"}
            {currentUser?.id === user.id && (
              <Badge ml="1" colorScheme="teal">
                You
              </Badge>
            )}
          </Td>
          <Td>{user.email}</Td>
          <Td>{user.is_superuser ? "Superuser" : "User"}</Td>
          <Td>
            <Flex gap={2}>
              <Box
                w="2"
                h="2"
                borderRadius="50%"
                bg={user.is_active ? "ui.success" : "ui.danger"}
                alignSelf="center"
              />
              {user.is_active ? "Active" : "Inactive"}
            </Flex>
          </Td>
          <Td>
            <ActionsMenu
              type="User"
              value={user}
              disabled={currentUser?.id === user.id ? true : false}
            />
          </Td>
        </Tr>
      ))}
    </Tbody>
  )
}

const MembersBodySkeleton = () => {
  return (
        /**
     * This component renders a table body (<Tbody>) with one table row (<Tr>).
     * Inside the table row, it creates an array of five elements, fills it with null,
     * then maps each element to a table data (<Td>) component.
     * 
     * For each <Td> component, a key attribute is assigned with the current array index.
     * Inside the <Td> component, it renders a <SkeletonText> component.
     * 
     * The <SkeletonText> component has the following properties:
     * - `noOfLines` is set to 1, meaning it will display one line of skeleton (a placeholder typically shown during content loading)
     * - `paddingBlock` is set to "16px", meaning it will have a block-padding of 16 pixels.
     * 
     * This component could be used to display a loading state for a table with five columns.
     */
    <Tbody>
          <Tr>
            {new Array(5).fill(null).map((_, index) => (
              <Td key={index}>
                <SkeletonText noOfLines={1} paddingBlock="16px" />
              </Td>
            ))}
          </Tr>
    </Tbody>
  )
}

/**
 * `Admin` component renders the User Management page for admin users.
 *
 * The page is wrapped in a container that expands to the full width of the page.
 * The page heading is "User Management", centered on small screens and aligned left on medium and larger screens.
 * A navigation bar, specific for User type is included.
 * The main content of the page is a table within a table container. The table's font size is medium with small size on 
 * small screens and medium size on medium and larger screens. The table has five columns: Full name, Email, Role, Status, 
 * and Actions, each occupying a certain percentage of the table width.
 * The table body content is loaded asynchronously, with a loading skeleton shown as the fallback while the data is being fetched.
 * 
 * @function Admin
 * @component
 * @returns JSX.Element - the rendered Admin component
 */
function Admin() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        User Management
      </Heading>
      <Navbar type={"User"} />
      <TableContainer>
        <Table fontSize="md" size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th width="20%">Full name</Th>
              <Th width="50%">Email</Th>
              <Th width="10%">Role</Th>
              <Th width="10%">Status</Th>
              <Th width="10%">Actions</Th>
            </Tr>
          </Thead>
          <Suspense fallback={<MembersBodySkeleton />}>
            <MembersTableBody />
          </Suspense>
        </Table>
      </TableContainer>
    </Container>
  )
}
