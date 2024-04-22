import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { FiEdit, FiTrash } from "react-icons/fi"

import type { ItemPublic, UserPublic } from "../../client"
import EditUser from "../Admin/EditUser"
import EditItem from "../Items/EditItem"
import Delete from "./DeleteAlert"

interface ActionsMenuProps {
  type: string
  value: ItemPublic | UserPublic
  disabled?: boolean
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editUserModal = useDisclosure()
  const deleteModal = useDisclosure()

  return (
        /**
     * This is a method that returns a Menu component. 
     *
     * The Menu contains two options: 
     * - 'Edit {type}': opens a modal to edit either User or Item depending on the type provided.
     * - 'Delete {type}': opens a modal to confirm deletion of either a User or Item depending on the provided type.
     *
     * The 'Edit {type}' option opens either an EditUser or EditItem modal. 
     * It determines which one to open based on the type provided.
     * 
     * The 'Delete {type}' option opens a Delete modal. 
     * The type and id of the item or user to be deleted is passed as a prop to Delete component.
     * 
     * The Menu, Edit and Delete modals have the ability to open and close independently of each other.
     *
     * @param {boolean} disabled - Determines if the Menu is disabled or not.
     * @param {object} editUserModal - Contains the status (open or closed) and functions to control the Edit modal.
     * @param {object} deleteModal - Contains the status (open or closed) and functions to control the Delete modal.
     * @param {string} type - A string that determines if the operations are being performed on a "User" or "Item".
     * @param {object} value - The data of the User or Item that is being edited or deleted.
     */
    <>
      <Menu>
        <MenuButton
          isDisabled={disabled}
          as={Button}
          rightIcon={<BsThreeDotsVertical />}
          variant="unstyled"
        />
        <MenuList>
          <MenuItem
            onClick={editUserModal.onOpen}
            icon={<FiEdit fontSize="16px" />}
          >
            Edit {type}
          </MenuItem>
          <MenuItem
            onClick={deleteModal.onOpen}
            icon={<FiTrash fontSize="16px" />}
            color="ui.danger"
          >
            Delete {type}
          </MenuItem>
        </MenuList>
        {type === "User" ? (
          <EditUser
            user={value as UserPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        ) : (
          <EditItem
            item={value as ItemPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        )}
        <Delete
          type={type}
          id={value.id}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        />
      </Menu>
    </>
  )
}

export default ActionsMenu
