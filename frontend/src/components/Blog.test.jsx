import { render, screen } from '@testing-library/react'
//import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let mockLike
  let blog
  let mockRemove
  beforeEach(() => {
    blog = {
      title: 'The worst trip',
      author: 'Mimosa',
      url: 'https://trips.com/the-worst-trip',
      likes: 10,
      user: {
        username: 'tester',
        name: 'Superuser',
        id: '00000000000ffffffffffffff'
      },
      id: 'ddddddd9999999999999'
    }
    mockLike = vi.fn()
    mockRemove = vi.fn()
  })

  test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', async () => {
    render(
      <Blog
        blog={blog}
        handleLikesButtonClick={mockLike}
        handleRemoveButtonClick={mockRemove}
        username={null}
      />
    )
    const title = screen.getByText('The worst trip')
    expect(title).toBeDefined()

    const author = screen.getByText('Mimosa')
    expect(author).toBeDefined()

    const url = screen.getByText('https://trips.com/the-worst-trip')
    expect(url).toBeVisible()

    const likes = screen.getByText('likes 10')
    expect(likes).toBeVisible()

    const likesButton = screen.queryByText('like')
    expect(likesButton).toBeNull()

    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeNull()
  })

  test('Authenticated users who are not the blog’s creator are shown only the like button', async () => {
    render(
      <Blog
        blog={blog}
        handleLikesButtonClick={mockLike}
        handleRemoveButtonClick={mockRemove}
        username="another user"
      />
    )
    const likesButton = screen.getByText('like')
    expect(likesButton).toBeVisible()

    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeNull()
  })

  test('The blog creator is also shown the delete button', async () => {
    render(
      <Blog
        blog={blog}
        handleLikesButtonClick={mockLike}
        handleRemoveButtonClick={mockRemove}
        username="tester"
      />
    )
    const likesButton = screen.getByText('like')
    expect(likesButton).toBeVisible()

    const removeButton = screen.getByText('remove')
    expect(removeButton).toBeVisible()
  })
})
