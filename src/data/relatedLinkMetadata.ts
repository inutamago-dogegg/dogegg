export type RelatedLinkMetadata = {
  title: string;
  siteName?: string;
  date?: string;
  imageUrl?: string;
};

/**
 * Portfolio内の関連記事・関連リンクは、リンク先の本文を要約するのではなく、
 * タイトル・出典・サムネイルを見せてリンク先そのものを選べるようにする。
 * 外部ページのOGPをクライアント側で取得するとCORSや取得失敗に左右されるため、
 * 公開時点で確認できたメタデータをここで管理する。
 */
export const RELATED_LINK_METADATA: Record<string, RelatedLinkMetadata> = {
  'https://trap.jp/post/2611/': {
    title: 'ミサイルシフト 〖2026春ハッカソン 13班〗',
    siteName: 'traP',
    date: '2026.07.17',
  },
  'https://trap.jp/post/2798/': {
    title: "25冬ハッカソン 8班『Deeper and Deeper』",
    siteName: 'traP',
    date: '2026.01.15',
  },
  'https://trap.jp/post/2799/': {
    title: "冬ハッカソン25 8班 『Deeper and Deeper』プログラムの話",
    siteName: 'traP',
    date: '2026.02.01',
    imageUrl: 'https://trap.jp/content/images/2026/01/2026-01-15_17h06_40.png',
  },
  'https://trap.jp/post/2483/': {
    title: '冬ハッカソン2024 22班 「Queen Bee」',
    siteName: 'traP',
    date: '2025.02.04',
    imageUrl: 'https://trap.jp/content/images/2025/02/aaa.png',
  },
  'https://trap.jp/post/1911/': {
    title: '2023 春ハッカソン 10班 『「」か』',
    siteName: 'traP',
    date: '2024.05.08',
  },
  'https://trap.jp/post/1971/': {
    title: 'バリバリベンジ',
    siteName: 'traP',
  },
  'https://trap.jp/post/2106/': {
    title: '2023年冬ハッカソン参加記 チーム2 20％電電 "Orbit"',
    siteName: 'traP',
    date: '2024.01.16',
    imageUrl: 'https://trap.jp/content/images/2024/01/----------2024-01-13-225648.png',
  },
  'https://trap.jp/post/1607/': {
    title: '2022春ハッカソン8班「見つからないで！ゆうちゃん！」',
    siteName: 'traP',
    date: '2022.06.27',
  },
  'https://trap.jp/post/2037/': {
    title: 'LogicalRoom α版を先行公開！',
    siteName: 'traP',
    date: '2023.11.14',
  },
  'https://trap.jp/post/2026/': {
    title: "School Breakin' Tag -新感覚おにごっこ-",
    siteName: 'traP',
    date: '2023.11.21',
    imageUrl: 'https://trap.jp/content/images/2023/11/thumbnailpng.png',
  },
  'https://trap.jp/post/1746/': {
    title: "2022冬ハッカソン05班Hishi餅 『Root Shooter』",
    siteName: 'traP',
    date: '2022.12.30',
  },
  'https://www.capcom-games.com/cgc/2025/ja-jp/': {
    title: 'CAPCOM GAMES COMPETITION',
    siteName: 'CAPCOM',
  },
};
