import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { FaUserAstronaut } from "react-icons/fa"
import { FiLogOut, FiUser } from "react-icons/fi"

import useAuth from "../../hooks/useAuth"

const UserMenu = () => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    logout()
  }

  return (
        /**
     * This is a method for rendering a menu in a fixed position at the top right of the screen.
     * This menu is hidden on small screens (base) and visible on medium and larger screens (md: "block").
     * 
     * The menu is composed of a button and a list. 
     * The button, represented by an astronaut icon, opens the menu when clicked.
     * The list contains two items: 'My Profile' and 'Log Out'. 
     * 
     * 'My Profile' is represented by a user icon and, when clicked, redirects the user to the settings page.
     * 'Log Out' is represented by a logout icon and, when clicked, logs out the user from the app.
     * The 'log out' option is emphasized with a bold font and a different color.
     *
     * This entire component is enclosed in a Box element for better placement and styling.
     */
    <>
      {/* Desktop */}
      <Box
        display={{ base: "none", md: "block" }}
        position="fixed"
        top={4}
        right={4}
      >
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<FaUserAstronaut color="white" fontSize="18px" />}
            bg="ui.main"
            isRound
          />
          <MenuList>
            <MenuItem icon={<FiUser fontSize="18px" />} as={Link} to="settings">
              My profile
            </MenuItem>
            <MenuItem
              icon={<FiLogOut fontSize="18px" />}
              onClick={handleLogout}
              color="ui.danger"
              fontWeight="bold"
            >
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </>
  )
}

export default UserMenu
