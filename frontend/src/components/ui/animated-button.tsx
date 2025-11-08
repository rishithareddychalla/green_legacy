import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button as BaseButton, ButtonProps } from "./button";

const AnimatedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <BaseButton
          ref={ref}
          className={cn(
            "relative overflow-hidden transition-colors",
            "after:absolute after:inset-0 after:z-[-1] after:opacity-0 after:transition-opacity",
            "after:bg-gradient-to-r after:from-primary/50 after:to-primary-light/50",
            "hover:after:opacity-100",
            className
          )}
          {...props}
        >
          {children}
        </BaseButton>
      </motion.div>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };