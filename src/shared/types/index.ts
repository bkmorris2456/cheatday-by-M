import { Timestamp } from 'firebase/firestore'

export interface Address {
  name: string
  line1: string
  line2: string | null
  city: string
  state: string
  zip: string
}

export interface User {
  email: string
  displayName: string
  phone: string | null
  role: 'customer' | 'admin'
  isActive: boolean
  isBanned: boolean
  defaultAddress: Address
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLoginAt: Timestamp | null
}

export type DessertCategory = 'cookies' | 'brownies' | 'cakes' | 'seasonal' | 'other'

export interface Dessert {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  imageUrls: string[]
  category: DessertCategory
  inventoryCount: number
  maxPerOrder: number | null
  isActive: boolean
  isFeatured: boolean
  isLimited: boolean
  isSoldOut: boolean
  allergens: string[]
  dietaryTags: string[]
  availableFrom: Timestamp | null
  availableUntil: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CartItem {
  dessertId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export interface Cart {
  userId: string
  items: CartItem[]
  subtotal: number
  updatedAt: Timestamp
  expiresAt: Timestamp | null
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed'

export interface OrderItem {
  dessertId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  userId: string | null
  customer: {
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  status: OrderStatus
  fulfillmentType: 'pickup' | 'delivery'
  pickupTime: Timestamp | null
  deliveryAddress: Address | null
  paymentStatus: PaymentStatus
  paymentProvider: 'stripe' | 'cash' | 'other'
  paymentIntentId: string | null
  notes: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type AnnouncementType = 'info' | 'drop' | 'sold_out' | 'holiday'

export interface Announcement {
  id: string
  title: string
  message: string
  type: AnnouncementType
  isActive: boolean
  startsAt: Timestamp | null
  endsAt: Timestamp | null
  createdAt: Timestamp
}

export interface Review {
  id: string
  userId: string
  dessertId: string
  orderId: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: Timestamp
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  displayOrder: number
  isActive: boolean
}
