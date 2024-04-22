import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react"
import { FaPlus } from "react-icons/fa"

import AddUser from "../Admin/AddUser"
import AddItem from "../Items/AddItem"

interface NavbarProps {
  type: string
}

const Navbar = ({ type }: NavbarProps) => {
  const addUserModal = useDisclosure()
  const addItemModal = useDisclosure()

  return (
        /**
     * This method is a component meant to be rendered in a React application.
     * The component renders a flex container with a button and two modals.
     * 
     * The button, when clicked, will open one of two modals depending on the type provided to the component.
     * If the type is "User", the `addUserModal` will be opened, and if the type is not "User", the `addItemModal` will be opened.
     * 
     * The two modals `addUserModal` and `addItemModal` are passed as props to `AddUser` and `AddItem` components respectively.
     * `isOpen` and `onClose` are callbacks used to control the opening and closing of the modal.
     * 
     * An icon of a plus is displayed on the button along with the text "Add {type}"
     *
     * Currently, there is a placeholder for a search input field which is not yet implemented.
    */
    <>
      <Flex py={8} gap={4}>
        {/* TODO: Complete search functionality */}
        {/* <InputGroup w={{ base: '100%', md: 'auto' }}>
                    <InputLeftElement pointerEvents='none'>
                        <Icon as={FaSearch} color='ui.dim' />
                    </InputLeftElement>
                    <Input type='text' placeholder='Search' fontSize={{ base: 'sm', md: 'inherit' }} borderRadius='8px' />
                </InputGroup> */}
        <Button
          variant="primary"
          gap={1}
          fontSize={{ base: "sm", md: "inherit" }}
          onClick={type === "User" ? addUserModal.onOpen : addItemModal.onOpen}
        >
          <Icon as={FaPlus} /> Add {type}
        </Button>
        <AddUser isOpen={addUserModal.isOpen} onClose={addUserModal.onClose} />
        <AddItem isOpen={addItemModal.isOpen} onClose={addItemModal.onClose} />
      </Flex>
    </>
  )
}

export default Navbar
