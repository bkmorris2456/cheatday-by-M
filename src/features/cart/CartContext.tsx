import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartItem, Dessert } from '../../shared/types'

interface CartContextValue {
  items: CartItem[]
  addItem: (dessert: Dessert, quantity: number) => void
  removeItem: (dessertId: string) => void
  updateQuantity: (dessertId: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(dessert: Dessert, quantity: number) {
    setItems((prev) => {
      const existing = prev.find((i) => i.dessertId === dessert.id)
      if (existing) {
        return prev.map((i) =>
          i.dessertId === dessert.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [
        ...prev,
        {
          dessertId: dessert.id,
          name: dessert.name,
          price: dessert.price,
          quantity,
          imageUrl: dessert.imageUrls[0] ?? '',
        },
      ]
    })
  }

  function removeItem(dessertId: string) {
    setItems((prev) => prev.filter((i) => i.dessertId !== dessertId))
  }

  function updateQuantity(dessertId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(dessertId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.dessertId === dessertId ? { ...i, quantity } : i))
    )
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
