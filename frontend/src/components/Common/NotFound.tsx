import { Button, Container, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

const NotFound = () => {
  return (
        /**
     * This method renders a 404 error page with a layout including a main heading, error message and a 'Go back' button.
     * The layout is centered in a container that stretches to fill the viewport's height.
     * 
     * The main heading '404' is styled with a bold, large font and a color taken from the `ui.main` theme.
     * Two subheadings 'Oops!' and 'Page not found.' are displayed beneath the main heading.
     * 
     * The 'Go back' button is styled with an outline variant and a color taken from the `ui.main` theme. 
     * When clicked, the button redirects user to the homepage ("/").
     */
    <>
      <Container
        h="100vh"
        alignItems="stretch"
        justifyContent="center"
        textAlign="center"
        maxW="sm"
        centerContent
      >
        <Text
          fontSize="8xl"
          color="ui.main"
          fontWeight="bold"
          lineHeight="1"
          mb={4}
        >
          404
        </Text>
        <Text fontSize="md">Oops!</Text>
        <Text fontSize="md">Page not found.</Text>
        <Button
          as={Link}
          to="/"
          color="ui.main"
          borderColor="ui.main"
          variant="outline"
          mt={4}
        >
          Go back
        </Button>
      </Container>
    </>
  )
}

export default NotFound
