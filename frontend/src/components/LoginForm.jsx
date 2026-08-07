import Notification from './Notification'
import { TextField, Button, Box } from '@mui/material'

const LoginForm = ({
  errorMessage,
  successMessage,
  handleLogin,
  username,
  setUsername,
  password,
  setPassword
}) => (
  <div>
    <h2>Log in to application</h2>
    <Notification message={errorMessage} isSuccess={false} />
    <Notification message={successMessage} isSuccess={true} />
    <form
      onSubmit={handleLogin}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <TextField
        label="username"
        variant="standard"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: '400px' }}
      />

      <TextField
        label="password"
        type="password"
        variant="standard"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '400px' }}
      />
      <div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </div>
    </form>
  </div>
)

export default LoginForm
