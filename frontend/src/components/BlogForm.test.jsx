import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write title')
  const authorInput = screen.getByPlaceholderText('write author')
  const urlInput = screen.getByPlaceholderText('write url')

  const createButton = screen.getByText('create')

  await user.type(titleInput, 'The best trip')
  await user.type(authorInput, 'Mimosa')
  await user.type(urlInput, 'https://travels.com/the-best-trip')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('The best trip')
  expect(createBlog.mock.calls[0][0].author).toBe('Mimosa')
  expect(createBlog.mock.calls[0][0].url).toBe(
    'https://travels.com/the-best-trip'
  )
})
