import {
  Badge,
  Container,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  useColorMode,
} from "@chakra-ui/react"

const Appearance = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
        /**
     * Renders a user interface component for toggling the color mode of the application.
     * The component consists of a header titled 'Appearance' and a radio group 
     * for choosing between 'Light mode' and 'Dark mode'. 
     * The 'Light mode' option is marked as 'Default'. 
     * The color mode value is linked to the 'colorMode' state variable, and any change triggers the 'toggleColorMode' function. 
     * This component is wrapped inside a full-width container.
     */
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          Appearance
        </Heading>
        <RadioGroup onChange={toggleColorMode} value={colorMode}>
          <Stack>
            {/* TODO: Add system default option */}
            <Radio value="light" colorScheme="teal">
              Light mode
              <Badge ml="1" colorScheme="teal">
                Default
              </Badge>
            </Radio>
            <Radio value="dark" colorScheme="teal">
              Dark mode
            </Radio>
          </Stack>
        </RadioGroup>
      </Container>
    </>
  )
}
export default Appearance
