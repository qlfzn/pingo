import { AuthProvider } from "../context/AuthContext"
import App from "../App"

export default function Page() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
