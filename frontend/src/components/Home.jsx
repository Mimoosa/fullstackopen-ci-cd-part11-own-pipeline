import BlogList from './BlogList'
import Notification from './Notification'

const Home = ({
  errorMessage,
  successMessage,
  blogs,
  handleLikesButtonClick,
  handleRemoveButtonClick,
  username
}) => {
  return (
    <div>
      <h1>blogs</h1>
      <Notification message={errorMessage} isSuccess={false} />
      <Notification message={successMessage} isSuccess={true} />

      <BlogList
        blogs={blogs}
        handleLikesButtonClick={handleLikesButtonClick}
        handleRemoveButtonClick={handleRemoveButtonClick}
        username={username}
      />
    </div>
  )
}

export default Home
