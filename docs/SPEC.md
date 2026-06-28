# Executive Summary

cheatday will be a website dedicated to showcasing and offering the option to purchases local baked goods handcrafted by my mom. Users should be able to look through dessert options, add varying amounts into their cart, and be able to place orders on goods. Users should also be able to be added on a priority queue or waitlist, if they wanted to order a specific item, but they weren't able to get them due to running out of stock. Admin users (my mom in this case) should be able to do directly manipulate the website by changing what items are available, item descriptions, and manipulating the waitlist. There should also be an admin dashboard tracking business metrics

# Goals

What does this problem solve?

1. Provide users with a way to purchases baked goods
2. Allow my mom a way to organize her inventory and be able to cleanly advertise and distribute her products
3. Track business and financial metrics
# Target Users

1. Foodies
2. Dessert-Lovers 
3. The average person in the metro detroit area
# Core Features

1. User Registration, Authentication, and Login
2. General Food Website UX / UI
3. High security checkout process
4. Admin Dashboard tracking business metrics
# User Stories

1. User
	1. As a user, I should be able to view the new exclusive cinnamon rolls that released on the website, and be able to order 5 of them
	2. I should also be able to work through the checkout process and confirm my order
2. Admin
	1. As an admin, I should be able to edit and adjust details on food items, or add or remove items from the displayed menu
	2. I should also be able to view the dashboard to track performance metrics
# Functional Requirements

1. Users must create an account or login before accessing the store
2. Users should be added onto a waitlist if the item they are going for was sold out
3. There can be multiple items displayed on the menu
4. Items should be displayed via card components showing price, quantity remaining, and an image of the product
# Non-Functional Requirements

1. Pages load under 2 seconds
2. Security
	1. Passwords hashed
	2. HTTPS only
	3. Input validation
	4. CSRF protection
3. Accessibility
	1. Keyboard navigation
	2. Screen reader support
	3. Sufficient color contrast
# Tech Stack

- Frontend
	- React
	- Vite
	- TypeScript
	- MaterialUI
- Backend
	- Firebase
	- Firestore
	- Authentication
- Deployment
	- Firebase Hosting
# Database Design

```
users/{userId}
{
  email: string,
  displayName: string,
  phone: string | null,

  role: "customer" | "admin",
  isActive: boolean,
  isBanned: boolean,

  defaultAddress: {
    name: string,
    line1: string,
    line2: string | null,
    city: string,
    state: string,
    zip: string
  },

  createdAt: timestamp,
  updatedAt: timestamp,
  lastLoginAt: timestamp | null
}

desserts/{dessertId}
{
  name: string,
  slug: string,
  description: string,
  shortDescription: string,

  price: number, // in cents preferred, e.g. 450 = $4.50
  imageUrls: string[],

  category: "cookies" | "brownies" | "cakes" | "seasonal" | "other",

  inventoryCount: number,
  maxPerOrder: number | null,

  isActive: boolean,
  isFeatured: boolean,
  isLimited: boolean,
  isSoldOut: boolean,

  allergens: string[], // ["nuts", "dairy", "gluten"]
  dietaryTags: string[], // ["vegan", "gluten-free"]

  availableFrom: timestamp | null,
  availableUntil: timestamp | null,

  createdAt: timestamp,
  updatedAt: timestamp
}

carts/{userId}
{
  userId: string,
  items: [
    {
      dessertId: string,
      name: string,
      price: number,
      quantity: number,
      imageUrl: string
    }
  ],

  subtotal: number,
  updatedAt: timestamp,
  expiresAt: timestamp | null
}

orders/{orderId}
{
  userId: string | null,

  customer: {
    name: string,
    email: string,
    phone: string
  },

  items: [
    {
      dessertId: string,
      name: string,
      price: number,
      quantity: number
    }
  ],

  subtotal: number,
  tax: number,
  deliveryFee: number,
  total: number,

  status: "pending" | "paid" | "preparing" | "ready" | "completed" | "cancelled" | "refunded",

  fulfillmentType: "pickup" | "delivery",
  pickupTime: timestamp | null,
  deliveryAddress: object | null,

  paymentStatus: "unpaid" | "paid" | "refunded" | "failed",
  paymentProvider: "stripe" | "cash" | "other",
  paymentIntentId: string | null,

  notes: string | null,

  createdAt: timestamp,
  updatedAt: timestamp
}

loginAttempts/{attemptId}
{
  email: string,
  userId: string | null,

  success: boolean,
  failureReason: string | null,

  ipAddress: string | null,
  userAgent: string | null,

  createdAt: timestamp
}

categories/{categoryId}
{
  name: string,
  slug: string,
  description: string | null,
  displayOrder: number,
  isActive: boolean
}

announcements/{announcementId}
{
  title: string,
  message: string,
  type: "info" | "drop" | "sold_out" | "holiday",
  isActive: boolean,
  startsAt: timestamp | null,
  endsAt: timestamp | null,
  createdAt: timestamp
}

reviews/{reviewId}
{
  userId: string,
  dessertId: string,
  orderId: string,

  rating: number,
  comment: string,
  isApproved: boolean,

  createdAt: timestamp
}
```
# UI/UX

- Screens
	- Home Screen
		- Main area to browse and look over dessert options
		- Shows card components showcasing dessert image, price, add to cart button
		- Copyright infor and social media contacts at the bottom
	- Admin Dashboard
		- Traditional dashboard appearance, ability to track stats such as orders placed, revenue generated, top categories of desserts sold, etc.
	- Payment Process
		- Cart Screen
			- Summary of what desserts are selected
			- Ability to add or pre generate existing card information onto the payment method
		- Order Confirmation Screen
	- Item Details
		- Additional Images of desserts, more thorough description of the item, quantity remaining
# Navigation Flow

1. Login / Signup
2. Homepage / viewing dessert options
	1. Can add items directly from here if they wish
3. Item Details Screen
	1. Can also add items here if they wish
4. Cart Screen
5. Payment Process Screen
	1. Order summary
	2. add payment info
6. Order confirmation screen
	1. Send email or text for confirmation?
# Permissions

- Guest
	- View landing page
	- can place orders, will need to add additional info regarding contact details for order
- User
	- Access to landing page, viewing and adding items, and placing orders
- Admin
	- Manage users
	- View analytics
	- Can place orders if they want to
# Error Handling

- If login fails
	- Show incorrect email or password
- If payment fails
	- Say error taking card information please try again
- If offline
	- Queue any cart choices or profile changes
	- Sync later
# Future Features

- Special Raffles to try new desserts
- Reviews per dessert
	- Overall reviews too
# Success Criteria

- User can create an account
- User can successfully add items to cart
- Cart successfully shows total price and quantity of items
- User can walk through the payment process with no issues
- User can confirm order and receive text/email confirmation
- backend can properly track login attempts, login fails, successes, etc.
# Architecture Decisions

- We're using firestore instead of MySQL because I believe it is more lightweight and easier to manage, but this can be up for discussion when establishing this decision
# Coding Standards

- Clear and concise naming across files, folders, variables, etc.
- Folder structure and design pattern should be feature-based
# Project Constraints

- Do not make any database adjustments without first consulting me
- Keep code as lightweight and concise as possible