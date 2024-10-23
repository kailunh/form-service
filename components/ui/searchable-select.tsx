"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface SearchableSelectProps {
  options: { value: string; label: string }[]
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  emptyMessage: string
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder,
  emptyMessage
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [scrollTop, setScrollTop] = React.useState(0)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const filteredOptions = React.useMemo(() => 
    options.filter(option =>
      option.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ),
    [options, debouncedSearchTerm]
  )

  const itemHeight = 35 // Approximate height of each item in pixels
  const windowHeight = 200 // Height of the scrollable area
  const overscan = 5 // Number of items to render above and below the visible area

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    filteredOptions.length - 1,
    Math.floor((scrollTop + windowHeight) / itemHeight) + overscan
  )

  const visibleOptions = filteredOptions.slice(startIndex, endIndex + 1)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="mb-2 sticky top-0 bg-background z-10 p-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div 
          className="max-h-[200px] overflow-y-auto"
          onScroll={handleScroll}
        >
          {filteredOptions.length === 0 ? (
            <div className="py-2 px-2 text-sm">{emptyMessage}</div>
          ) : (
            <div style={{ height: `${filteredOptions.length * itemHeight}px`, position: 'relative' }}>
              {visibleOptions.map((option, index) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  style={{
                    position: 'absolute',
                    top: `${(startIndex + index) * itemHeight}px`,
                    left: 0,
                    right: 0,
                    height: `${itemHeight}px`,
                  }}
                >
                  {option.label}
                </SelectItem>
              ))}
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  )
}

// Add this custom hook at the end of the file
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
