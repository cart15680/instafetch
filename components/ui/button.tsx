import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-[#00fff2] to-[#b537ff] text-black hover:opacity-90 neon-glow-cyan hover-glow-cyan button-shine",
                outline:
                    "border-2 border-[#00fff2] bg-transparent text-[#00fff2] hover:bg-[#00fff2]/10 neon-glow-cyan",
                ghost: "hover:bg-white/10 hover:text-[#00fff2]",
                glow:
                    "bg-gradient-to-r from-[#b537ff] to-[#ff006e] text-white neon-glow-purple hover-glow-purple button-shine",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-9 rounded-md px-4",
                lg: "h-14 rounded-lg px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
