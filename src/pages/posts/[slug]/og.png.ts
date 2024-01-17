import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import { generateOgImageForPost } from '@helpers/content/images'

export const getStaticPaths = (async (): Promise<{ params: { slug: string }; props: CollectionEntry<'blog'> }[]> => {
  const posts = (await getCollection('blog')).filter(({ data }) => {
    return !data.draft && !data.image // filter out drafts and posts that already have an image
  })

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }))
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForPost(props as CollectionEntry<'blog'>), {
    headers: { 'Content-Type': 'image/png' },
  })
