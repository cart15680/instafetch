import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-14  rounded-lg border-2 border-[#00fff2]/30 bg-[#12121a]/50 px-4 py-3 text-base text-white placeholder:text-[#6b6b7f] focus:border-[#00fff2] focus:outline-none focus:ring-2 focus:ring-[#00fff2]/20 disabled:cursor-not-allowed disabled:opacity-50 glass transition-all duration-300",
                    "neon-glow-cyan hover:border-[#00fff2]/50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
