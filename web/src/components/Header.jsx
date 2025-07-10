export function Header() {
  const title = "PinGo"
  const tagline = "Pin it, and Go later"

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <h1 style={{color: "#2B3A67"}} className="text-2xl font-bold">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold underline">{tagline}</h2>
            </div>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
              Sign Up
            </button>
        </div>
    </header>
  )
}

export default Header;
