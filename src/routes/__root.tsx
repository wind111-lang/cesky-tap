import type { ReactNode } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'ČESKY TAP — タップで学ぶチェコ語' },
      { name: 'description', content: 'キーボード入力なし。聴いて、見て、選ぶだけのやさしいチェコ語レッスン。' },
      { property: 'og:title', content: 'ČESKY TAP — タップで学ぶチェコ語' },
      { property: 'og:description', content: 'キーボード入力なし。聴いて、見て、選ぶだけのやさしいチェコ語レッスン。' },
      { property: 'og:image', content: 'https://cesky-tap.pr-times-cor-2701.chatgpt.site/og.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'ČESKY TAP — タップで学ぶチェコ語' },
      { name: 'twitter:description', content: 'キーボード入力なし。聴いて、見て、選ぶだけのやさしいチェコ語レッスン。' },
      { name: 'twitter:image', content: 'https://cesky-tap.pr-times-cor-2701.chatgpt.site/og.png' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return <RootDocument><Outlet /></RootDocument>
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  )
}
