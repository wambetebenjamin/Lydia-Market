'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OrderRecord } from '@/lib/data'

export interface BasketItem {
  productSlug: string
  productName: string
  sku: string
  supplierSlug: string
  supplierName: string
  county: string
  unitPriceKes: number
  unitLabel: string
  moq: number
  quantity: number
  image: string
}

interface MarketplaceState {
  basket: BasketItem[]
  savedSuppliers: string[]
  placedOrders: OrderRecord[]
  addItem: (item: BasketItem) => void
  updateQuantity: (productSlug: string, quantity: number) => void
  removeItem: (productSlug: string) => void
  clearBasket: () => void
  toggleSavedSupplier: (supplierSlug: string) => void
  addPlacedOrders: (orders: OrderRecord[]) => void
}

const DEFAULT_BASKET: BasketItem[] = [
  {
    productSlug: 'fortified-sifted-maize-meal-bale',
    productName: 'Fortified Sifted Maize Meal (12 x 2kg Bale)',
    sku: 'LM-FB-101',
    supplierSlug: 'rift-valley-millers',
    supplierName: 'Rift Valley Millers & Commodities Ltd',
    county: 'Nakuru',
    unitPriceKes: 1680,
    unitLabel: 'per bale',
    moq: 5,
    quantity: 10,
    image: '/images/prod-food-1.jpg',
  },
  {
    productSlug: 'baked-beans-tomato-paste-carton',
    productName: 'Assorted Canned Baked Beans & Tomato Paste (24 Tins Carton)',
    sku: 'LM-FB-102',
    supplierSlug: 'rift-valley-millers',
    supplierName: 'Rift Valley Millers & Commodities Ltd',
    county: 'Nakuru',
    unitPriceKes: 2880,
    unitLabel: 'per carton',
    moq: 4,
    quantity: 4,
    image: '/images/prod-food-2.jpg',
  },
  {
    productSlug: 'shea-cocoa-body-lotion-carton',
    productName: 'Nourishing Shea & Cocoa Body Lotion (24 x 400ml Carton)',
    sku: 'LM-PC-201',
    supplierSlug: 'industrial-area-fmcg',
    supplierName: 'Nairobi Industrial FMCG Distributors',
    county: 'Nairobi',
    unitPriceKes: 4560,
    unitLabel: 'per carton',
    moq: 2,
    quantity: 4,
    image: '/images/prod-care-1.jpg',
  },
]

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set) => ({
      basket: DEFAULT_BASKET,
      savedSuppliers: [
        'rift-valley-millers',
        'industrial-area-fmcg',
        'coastline-trade-depot',
        'thika-highland-mills',
      ],
      placedOrders: [],
      addItem: (incoming) =>
        set((state) => {
          const existing = state.basket.find((i) => i.productSlug === incoming.productSlug)
          if (existing) {
            return {
              basket: state.basket.map((i) =>
                i.productSlug === incoming.productSlug
                  ? { ...i, quantity: i.quantity + incoming.quantity }
                  : i
              ),
            }
          }
          return { basket: [...state.basket, incoming] }
        }),
      updateQuantity: (productSlug, quantity) =>
        set((state) => ({
          basket: state.basket.map((i) =>
            i.productSlug === productSlug ? { ...i, quantity: Math.max(i.moq, quantity) } : i
          ),
        })),
      removeItem: (productSlug) =>
        set((state) => ({
          basket: state.basket.filter((i) => i.productSlug !== productSlug),
        })),
      clearBasket: () => set({ basket: [] }),
      toggleSavedSupplier: (supplierSlug) =>
        set((state) => ({
          savedSuppliers: state.savedSuppliers.includes(supplierSlug)
            ? state.savedSuppliers.filter((s) => s !== supplierSlug)
            : [...state.savedSuppliers, supplierSlug],
        })),
      addPlacedOrders: (orders) =>
        set((state) => ({
          placedOrders: [...orders, ...state.placedOrders],
        })),
    }),
    {
      name: 'lydia-market-basket-v1',
    }
  )
)
