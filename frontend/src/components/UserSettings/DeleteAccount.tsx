import {
  Button,
  Container,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react"

import DeleteConfirmation from "./DeleteConfirmation"

const DeleteAccount = () => {
  const confirmationModal = useDisclosure()

  return (
        /**
     * This method returns a React component rendered as a Container with full width.
     * It contains a Heading component with a small size and padding-top, padding-bottom of 4 displaying 'Delete Account'.
     * Text displayed below the heading provides information about the action, stating that it will permanently delete all user data and associated account details.
     * There is also a Button component with a margin-top of 4. This button has a 'danger' variant style and triggers the opening of a confirmation modal when clicked.
     * The DeleteConfirmation component shows a modal that is initially closed, and can be opened or closed using the 'onOpen' and 'onClose' methods respectively from the 'confirmationModal' object.
     */
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          Delete Account
        </Heading>
        <Text>
          Permanently delete your data and everything associated with your account.
        </Text>
        <Button variant="danger" mt={4} onClick={confirmationModal.onOpen}>
          Delete
        </Button>
        <DeleteConfirmation
          isOpen={confirmationModal.isOpen}
          onClose={confirmationModal.onClose}
        />
      </Container>
    </>
  )
}
export default DeleteAccount
