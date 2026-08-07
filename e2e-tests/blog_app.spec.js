const { test, describe, expect, beforeEach } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'Super user',
        username: 'root',
        password: 'salainen'
      }
    })
  })

  test('front page can be opened', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
  })

  test('Login page can be opened', async ({ page }) => {
    await page.goto('/')
    await page.getByText('LOGIN').click()

    await expect(
      page.getByRole('heading', { name: 'log in to application' })
    ).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('Login succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
    })

    test('Login fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('/')
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
    })

    test('A logged-in user can create a blog', async ({ page }) => {
      const blog = await createBlog(
        page,
        'The best travel experience',
        'Mimosa',
        'https://the-best-trip.com'
      )

      await expect(blog).toBeVisible()
    })

    test('A logged-in user can see like button', async ({ page }) => {
      const blog = await createBlog(
        page,
        'The worst travel experience',
        'Mimosa',
        'https://the-best-trip.com'
      )

      await blog.getByRole('link').click()

      const likeButton = page.locator('[data-testid="like-button"]')

      await expect(likeButton).toBeVisible()
    })

    test('the user who added the blog can delete the blog', async ({
      page
    }) => {
      page.once('dialog', async (dialog) => {
        await dialog.accept()
      })

      const blog = await createBlog(
        page,
        'The best travel experience',
        'Mimosa',
        'https://the-best-trip.com'
      )

      await blog.getByRole('link').click()
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(blog).not.toBeVisible()
    })

    describe('remove button', () => {
      test('the user who added the blog sees the remove button', async ({
        page
      }) => {
        const blog = await createBlog(
          page,
          'The best travel experience',
          'Mimosa',
          'https://the-best-trip.com'
        )

        await blog.getByRole('link').click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      })

      test('the user who did not add the blog cannot see the remove button', async ({
        page
      }) => {
        const blog = await createBlog(
          page,
          'The best travel experience',
          'Mimosa',
          'https://the-best-trip.com'
        )

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'root', 'salainen')

        await blog.getByRole('link').click()
        await expect(
          page.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })
    })
  })
})
