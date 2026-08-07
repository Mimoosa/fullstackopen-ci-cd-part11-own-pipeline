import { Card, CardContent, Typography, Button, Box, Link } from '@mui/material'

const Blog = ({
  blog,
  handleLikesButtonClick,
  handleRemoveButtonClick,
  username
}) => {
  if (!blog) {
    return null
  }

  return (
    <div data-testid="blog">
      <Card sx={{ maxWidth: 600, mt: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {blog.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            by {blog.author}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
              color="primary"
            >
              {blog.url}
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Added by {blog.user.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
            <Typography variant="h6">{blog.likes} likes</Typography>
            {username && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  handleLikesButtonClick({ ...blog, likes: blog.likes + 1 })
                }
              >
                like
              </Button>
            )}
            {username && blog.user && blog.user.username === username && (
              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  handleRemoveButtonClick(blog.id, blog.title, blog.author)
                }
              >
                remove
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  )
}

export default Blog
