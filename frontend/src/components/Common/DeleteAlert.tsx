import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"
import { useForm } from "react-hook-form"

import { ItemsService, UsersService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"

interface DeleteProps {
  type: string
  id: number
  isOpen: boolean
  onClose: () => void
}

const Delete = ({ type, id, isOpen, onClose }: DeleteProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const cancelRef = React.useRef<HTMLButtonElement | null>(null)
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const deleteEntity = async (id: number) => {
    if (type === "Item") {
      await ItemsService.deleteItem({ id: id })
    } else if (type === "User") {
      await UsersService.deleteUser({ userId: id })
    } else {
      throw new Error(`Unexpected type: ${type}`)
    }
  }

  const mutation = useMutation({
    mutationFn: deleteEntity,
    onSuccess: () => {
      showToast(
        "Success",
        `The ${type.toLowerCase()} was deleted successfully.`,
        "success",
      )
      onClose()
    },
    onError: () => {
      showToast(
        "An error occurred.",
        `An error occurred while deleting the ${type.toLowerCase()}.`,
        "error",
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [type === "Item" ? "items" : "users"],
      })
    },
  })

  const onSubmit = async () => {
    mutation.mutate(id)
  }

  return (
        /**
     * The `<AlertDialog>` component is a custom dialog box that is used to confirm the deletion of a given `type` (like a User). 
     * 
     * If `isOpen` prop is true, the AlertDialog will be visible, and it will close when the `onClose` method is invoked.
     * The `leastDestructiveRef` prop is used to refer to the element that would least likely to destroy data (in this case, the cancel button).
     * The size of the AlertDialog is responsive, with "sm" as the base size and "md" for medium screens. The AlertDialog is also centered on the screen.
     * 
     * Inside the AlertDialog, there is an `AlertDialogOverlay`, which is the semi-transparent overlay behind the AlertDialog.
     * Inside `AlertDialogOverlay`, there is `AlertDialogContent` which contains the actual content of the AlertDialog.
     * The `AlertDialogContent` is a form that on submission, calls the `onSubmit` method.
     * 
     * The `AlertDialogHeader` displays the title of the AlertDialog, which is "Delete {type}".
     * 
     * The `AlertDialogBody` contains the main content of the AlertDialog. If the `type` is "User", it will display a warning that all items associated with this user will also be permanently deleted.
     * The dialog also warns the user that this action cannot be undone.
     * 
     * The `AlertDialogFooter` contains two buttons: a "Delete" button and a "Cancel" button.
     * The "Delete" button submits the form, and becomes disabled and shows a loading spinner while `isSubmitting` is true.
     * The "Cancel" button invokes the `onClose` method when clicked, and becomes disabled while `isSubmitting` is true.
     */
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent as="form" onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader>Delete {type}</AlertDialogHeader>
    
            <AlertDialogBody>
              {type === "User" && (
                <span>
                  All items associated with this user will also be{" "}
                  <strong>permantly deleted. </strong>
                </span>
              )}
              Are you sure? You will not be able to undo this action.
            </AlertDialogBody>
    
            <AlertDialogFooter gap={3}>
              <Button variant="danger" type="submit" isLoading={isSubmitting}>
                Delete
              </Button>
              <Button
                ref={cancelRef}
                onClick={onClose}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default Delete
