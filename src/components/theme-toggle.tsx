"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from 'lucide-react'

import {
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenuSubContent>
      <DropdownMenuItem onClick={() => setTheme("light")}>
        Terang
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        Gelap
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        Sistem
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  )
}
