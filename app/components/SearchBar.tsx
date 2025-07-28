// app/components/SearchBar.tsx
'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full px-6 mt-6 flex flex-col sm:flex-row items-center gap-3"
    >
      <label htmlFor="search" className="sr-only">Buscar experiencias</label>
      <input
        id="search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar experiencias..."
        className="w-full sm:flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="Buscar experiencias"
      />
    </form>
  )
}
