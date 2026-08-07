import { expect } from '@playwright/test'

const loginWith = async (page, username, password) => {
  await page.goto('/')
  await page.getByText('LOGIN').click()

  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)

  await page.getByRole('button', { name: 'login' }).click()
}

async function createBlog(page, title, author, url) {
  await page.getByRole('link', { name: 'NEW BLOG' }).click()

  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)

  await page.getByRole('button', { name: 'CREATE' }).click()

  const blog = page.getByRole('listitem').filter({
    hasText: `${title} by ${author}`
  })

  await expect(blog).toBeVisible()

  return blog
}

const getBlogRow = (page, title, author) => {
  return page.getByRole('link', { name: `${title} by ${author}` })
}

export { loginWith, createBlog, getBlogRow }
