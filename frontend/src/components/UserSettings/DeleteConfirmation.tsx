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

import { type ApiError, type UserPublic, UsersService } from "../../client"
import useAuth from "../../hooks/useAuth"
import useCustomToast from "../../hooks/useCustomToast"

interface DeleteProps {
  isOpen: boolean
  onClose: () => void
}

const DeleteConfirmation = ({ isOpen, onClose }: DeleteProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const cancelRef = React.useRef<HTMLButtonElement | null>(null)
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const { logout } = useAuth()

  const mutation = useMutation({
    mutationFn: (id: number) => UsersService.deleteUser({ userId: id }),
    onSuccess: () => {
      showToast(
        "Success",
        "Your account has been successfully deleted.",
        "success",
      )
      logout()
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = (err.body as any)?.detail
      showToast("Something went wrong.", `${errDetail}`, "error")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    },
  })

  const onSubmit = async () => {
    mutation.mutate(currentUser!.id)
  }

  return (
        /**
     * This is a component that generates an alert dialog for a critical action; in this case, permanently deleting all account data.
     * 
     * The dialog box appears centered on the screen when `isOpen` is true. It consists of a header that says 'Confirmation Required', and a body explaining the irreversible nature of the action.
     * 
     * It also includes a 'Confirm' button and a 'Cancel' button. If the 'Confirm' button is clicked, the `onSubmit` function is triggered. If the 'Cancel' button is clicked, the `onClose` function is triggered.
     * 
     * The dialog box is responsive with size 'sm' on base and 'md' on medium screens. When a submit action is in progress, the 'Confirm' button shows a loading state and the 'Cancel' button is disabled.
     * 
     * @param {boolean} isOpen - Controls whether the dialog is open or not.
     * @param {function} onClose - A function to be executed when the dialog is closed.
     * @param {React.RefObject} cancelRef - Ref for the cancel button.
     * @param {function} handleSubmit - A higher order function that takes `onSubmit` as a parameter. Comes from the react-hook-form library.
     * @param {function} onSubmit - A function to be executed when the confirm button is clicked.
     * @param {boolean} isSubmitting - A boolean indicating whether a submit action is in progress.
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
            <AlertDialogHeader>Confirmation Required</AlertDialogHeader>
    
            <AlertDialogBody>
              All your account data will be{" "}
              <strong>permanently deleted.</strong> If you are sure, please
              click <strong>"Confirm"</strong> to proceed. This action cannot be
              undone.
            </AlertDialogBody>
    
            <AlertDialogFooter gap={3}>
              <Button variant="danger" type="submit" isLoading={isSubmitting}>
                Confirm
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

export default DeleteConfirmation
