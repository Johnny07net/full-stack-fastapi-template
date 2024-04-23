import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import type { UserPublic } from "../../client"
import Appearance from "../../components/UserSettings/Appearance"
import ChangePassword from "../../components/UserSettings/ChangePassword"
import DeleteAccount from "../../components/UserSettings/DeleteAccount"
import UserInformation from "../../components/UserSettings/UserInformation"

const tabsConfig = [
  { title: "My profile", component: UserInformation },
  { title: "Password", component: ChangePassword },
  { title: "Appearance", component: Appearance },
  { title: "Danger zone", component: DeleteAccount },
]

export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
})

/**
 * `UserSettings` is a functional component that renders the User Settings section in an application.
 * This section displays different tabs depending on the user's role. 
 *
 * It uses the `useQueryClient` hook from React Query to get the current user data, specifically
 * checking if the user is a superuser.
 *
 * If the current user is a superuser, it slices the `tabsConfig` array to include only the first 3 tabs.
 * If not, it uses the entire `tabsConfig` array as it is.
 *
 * Each tab from the final tabs array is then rendered as an individual Tab component with the 
 * appropriate title and content specified by the `tab.component`.
 *
 * Note: The `tabsConfig` array is assumed to be defined elsewhere in the code, and should be an array of
 * objects, with each object having a `title` and a `component` property.
 *
 * @returns A Container component from Chakra UI that contains a Heading and a Tabs component.
 * The Tabs component is composed of a TabList (which contains the tab titles) and TabPanels 
 * (which contains the tab content).
 */
function UserSettings() {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const finalTabs = currentUser?.is_superuser
    ? tabsConfig.slice(0, 3)
    : tabsConfig

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
        User Settings
      </Heading>
      <Tabs variant="enclosed">
        <TabList>
          {finalTabs.map((tab, index) => (
            <Tab key={index}>{tab.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {finalTabs.map((tab, index) => (
            <TabPanel key={index}>
              <tab.component />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  )
}
