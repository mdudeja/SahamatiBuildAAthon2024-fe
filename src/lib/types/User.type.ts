export type User = {
  id: string
  username: string
  password?: string
  createdAt?: string
  updatedAt?: string
  userType: "fiu" | "client"
}
