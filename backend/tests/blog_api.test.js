const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

let token
let blogToDelete

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})

  const credential = {
    username: 'root',
    password: 'sekret'
  }

  const passwordHash = await bcrypt.hash(credential.password, 10)
  const user = new User({ username: credential.username, passwordHash })

  await user.save()

  const loginResponse = await api.post('/api/login').send(credential)

  token = loginResponse.body.token

  const blogContent = {
    title: 'Summer trip',
    author: 'Monami',
    url: 'https://trips.com/summer-trip',
    likes: 10,
    userId: user.id
  }

  const created = await api
    .post('/api/blogs')
    .send(blogContent)
    .set('Authorization', `Bearer ${token}`)

  blogToDelete = created.body
})

test('correct amout of blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
})

test('Blog model include id named property as an identifier', async () => {
  const response = await api.get('/api/blogs')
  assert(Object.keys(response.body[0]).includes('id'))
})

describe('new blog can be added', () => {
  test('the total number of blogs increases by one', async () => {
    const newBlog = {
      title: 'Winter trip',
      author: 'Maria Kokko',
      url: 'https://trips.com/winter-trip',
      likes: 20
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 2)
  })

  test('the added blog has correct title', async () => {
    const newBlog = {
      title: 'Winter trip',
      author: 'Maria Kokko',
      url: 'https://trips.com/winter-trip',
      likes: 20
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map((b) => b.title)
    assert(titles.includes('Winter trip'))
  })

  test('adding a blog fails with the proper status code 401 Unauthorized if a token is not provided', async () => {
    const newBlog = {
      title: 'Winter trip',
      author: 'Maria Kokko',
      url: 'https://trips.com/winter-trip',
      likes: 20
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
  })
})

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const newBlog = {
    title: 'Winter trip',
    author: 'Maria Kokko',
    url: 'https://trips.com/winter-trip'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
  assert.strictEqual(response.body.likes, 0)
})

describe('invalid request', () => {
  test('if the title is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
    const newBlog = {
      author: 'Maria Kokko',
      url: 'https://trips.com/winter-trip',
      likes: 20
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

  test('if the url is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
    const newBlog = {
      title: 'Winter trip',
      author: 'Maria Kokko',
      likes: 20
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogAtStart = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map((b) => b.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('likes number can be updated', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToUpdate = blogAtStart[0]

    const updatedBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 10
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd[0].likes, updatedBlog.likes)
  })
})

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if a length of the password is less the three characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'roo',
      name: 'Superuser',
      password: 'sa'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(
      result.body.error.includes(
        'A password must be at least 3 characters long.'
      )
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if a length of the username is less the three characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(
      result.body.error.includes(
        'User validation failed: username: Path `username` (`ro`, length 2) is shorter than the minimum allowed length (3).'
      )
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
