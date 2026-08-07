const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likesList = blogs.map((blog) => blog.likes)
  return blogs.length === 0 ? 0 : likesList.reduce((acc, n) => acc + n, 0)
}

const favoriteBlog = (blogs) => {
  const topLikes = Math.max(...blogs.map((blog) => blog.likes))
  return blogs.length === 0
    ? null
    : blogs.find((blog) => blog.likes === topLikes)
}

const mostBlogs = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const numOfBlogsByAuthor = _.map(groupedByAuthor, (blogList, author) => ({
    author,
    blogs: blogList.length
  }))

  return blogs.length === 0 ? null : _.maxBy(numOfBlogsByAuthor, 'blogs')
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const numOfBlogsByAuthor = _.map(groupedByAuthor, (blogList, author) => ({
    author,
    likes: _.sumBy(blogList, 'likes')
  }))

  return blogs.length === 0 ? null : _.maxBy(numOfBlogsByAuthor, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
