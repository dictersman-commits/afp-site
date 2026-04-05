export type Locale = 'ru' | 'en'

export type Country =
  | 'RU' | 'UAE' | 'MN' | 'IR'
  | 'SA' | 'CN' | 'UZ' | 'KZ'
  | 'KG' | 'TJ' | 'OTHER'

export type Role = 'GUEST' | 'MEMBER' | 'ADMIN'

export interface Member {
  id: string
  firstName: string
  lastName: string
  photo?: string
  bio?: string
  specialization: string[]
  country: Country
  city?: string
  website?: string
  hasDiscount: boolean
}

export interface Event {
  id: string
  slug: string
  titleRu: string
  titleEn?: string
  descriptionRu: string
  descriptionEn?: string
  date: string
  location?: string
  isOnline: boolean
  externalUrl?: string
  maxSeats?: number
}

export interface Article {
  id: string
  slug: string
  titleRu: string
  titleEn?: string
  contentRu: string
  contentEn?: string
  country: Country
  tags: string[]
  authorName?: string
  createdAt: string
}

export interface News {
  id: string
  slug: string
  titleRu: string
  titleEn?: string
  contentRu: string
  contentEn?: string
  coverImage?: string
  createdAt: string
}
