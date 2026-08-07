import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'

const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <ul>
      {sortedBlogs.map((blog) => (
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </li>
      ))}
    </ul>
  )
}
export default BlogList
