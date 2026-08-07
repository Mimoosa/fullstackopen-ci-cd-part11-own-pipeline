import { expect } from '@playwright/test'

const loginWith = async (page, username, password) => {
  await page.goto('/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'NEW BLOG' }).click()

  const locator = page.getByRole('heading', { name: 'create new' })
  await expect(locator).toBeVisible()
  await page.getByPlaceholder('write title').waitFor()
  const titleInput = page.getByPlaceholder('write title')
  await expect(titleInput).toBeVisible()
  await page.getByPlaceholder('write title').fill(title)
  await page.getByPlaceholder('write author').fill(author)
  await page.getByPlaceholder('write url').fill(url)

  await page.getByRole('button', { name: 'create' }).click()
}

const getBlogRow = (page, title) =>
  page
    .getByText(title)
    .locator('xpath=ancestor::div[contains(@style,"border")]')

export { loginWith, createBlog, getBlogRow }
