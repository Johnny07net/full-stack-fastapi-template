import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { FiBriefcase, FiHome, FiSettings, FiUsers } from "react-icons/fi"

import type { UserPublic } from "../../client"

const items = [
  { icon: FiHome, title: "Dashboard", path: "/" },
  { icon: FiBriefcase, title: "Items", path: "/items" },
  { icon: FiSettings, title: "User Settings", path: "/settings" },
]

interface SidebarItemsProps {
  onClose?: () => void
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient()
  const textColor = useColorModeValue("ui.main", "ui.light")
  const bgActive = useColorModeValue("#E2E8F0", "#4A5568")
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

  const finalItems = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "Admin", path: "/admin" }]
    : items

  const listItems = finalItems.map(({ icon, title, path }) => (
        /**
     * This is a Flex component that serves as a Link with full width.
     * It has padding of 2 and takes in a title as a key. 
     * When the Flex component is active, it changes the style of the background and the border radius.
     * The color of the text within the Flex component is customizable.
     * Also it includes an onClick event that triggers onClose function.
     * The Flex component has two children: an Icon that aligns itself in the center and a Text that has a left margin of 2.
     * 
     * @param {String} as - The component or element to be rendered. It is set as Link.
     * @param {String} to - Where the Link should navigate to.
     * @param {String} w - The width of the Flex component. It is set to 100%.
     * @param {Number} p - The padding of the Flex component. It is set to 2.
     * @param {String} key - The key for the Flex component. It is set as the title.
     * @param {Object} activeProps - The properties that the Flex component should have when it is active.
     * @param {String} color - The color of the text. It is customizable via the textColor prop.
     * @param {Function} onClick - The function that will be triggered when the Flex component is clicked. It triggers onClose function.
     * @param {JSX.Element} Icon - The Icon component that is to be rendered as a child of the Flex component.
     * @param {String} ml - The left margin of the Text component. It is set to 2.
     * @param {String} title - The text that the Text component should display.
     */
    <Flex
      as={Link}
      to={path}
      w="100%"
      p={2}
      key={title}
      activeProps={{
        style: {
          background: bgActive,
          borderRadius: "12px",
        },
      }}
      color={textColor}
      onClick={onClose}
    >
      <Icon as={icon} alignSelf="center" />
      <Text ml={2}>{title}</Text>
    </Flex>
  ))

  return (
        /**
     * This method renders a list of items inside a box.
     * The listItems variable is expected to be an array of JSX elements or a single JSX element.
     * Each item in the listItems array is displayed inside the box in the order they appear in the array.
     *
     * @returns A Box component with listItems children.
     */
    <>
      <Box>{listItems}</Box>
    </>
  )
}

export default SidebarItems
