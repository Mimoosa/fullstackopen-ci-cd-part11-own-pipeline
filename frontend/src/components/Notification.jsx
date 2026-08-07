import { Alert } from '@mui/material'

const Notification = ({ message, isSuccess }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert severity={isSuccess ? 'success' : 'error'} sx={{ mb: 2 }}>
      {message}
    </Alert>
  )
}

export default Notification
