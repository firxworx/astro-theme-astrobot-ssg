import type { CollectionEntry } from 'astro:content'
import { TemplateLogoSvg } from './TemplateLogoSvg'

/**
 * Image template for generating social media images (OpenGraph + Twitter/X) for blog posts.
 *
 * @see https://og-playground.vercel.app/ online tool to help design og templates
 */
export function PostImageTemplate(post: CollectionEntry<'blog'>): JSX.Element {
  const { title, author } = post.data

  const borderColor = '#171717'
  const textColor = '#0a0a0a'

  const logoAspectRatio = 4.79963
  const logoHeightPx = 40

  const paddingPx = 30

  const logoSizePx = {
    width: logoHeightPx * logoAspectRatio,
    height: logoHeightPx,
  }

  return (
    <div
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(30,41,59,1) 0%, rgba(71,85,105,1) 35%, rgba(148,163,184,1) 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          border: `4px solid ${borderColor}`,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          margin: '2rem',
          width: '90%',
          height: '80%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              maxHeight: '80%',
              overflow: 'hidden',
              textAlign: 'center',
              color: textColor,
              padding: `${paddingPx}px ${paddingPx}px 0 ${paddingPx}px`,
            }}
          >
            <p style={{ fontSize: 72, fontWeight: 'bold' }}>{title}</p>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              fontSize: 28,
              padding: `0 ${paddingPx}px ${paddingPx}px ${paddingPx}px`,
            }}
          >
            <span style={{ overflow: 'hidden', fontWeight: 'bold', color: textColor }}>{author}</span>
            {/*
              // if you want to display the site title instead of the logo uncomment this block and delete the logo
              <span style={{ overflow: 'hidden', fontWeight: 'bold', color: textColor }}>{SITE.title}</span>
            */}
            <TemplateLogoSvg
              style={{
                color: textColor,
                height: `${logoSizePx.height}px`,
                width: `${logoSizePx.width}px`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
