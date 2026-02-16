"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { BookLock, Loader2, LogOut, Moon, Settings, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

export function UserProfileDropdown() {
  const { data: session, isPending } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const posthog = usePostHog();
  const router = useRouter();


  const handleLogOut = async () => {
    posthog.reset();
    await authClient.signOut();
    router.refresh();
  };

  return (
    <AnimatePresence mode="wait">
      {isPending ? (
        <motion.div
          key="spinner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex size-8 items-center justify-center"
        >
          <Loader2 className="text-muted-foreground size-7 animate-spin" />
        </motion.div>
      ) : !session?.user ? (
        <motion.div
          key="auth-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex gap-3.5"
        >
          <Button
            variant="link"
            onClick={() => openAuthDialog("signin")}
            className="text-foreground hover:text-primary hidden h-8 px-0 hover:no-underline md:inline-flex"
          >
            Sign In
          </Button>
          <Button onClick={() => openAuthDialog("signup")} className="h-8">
            Sign Up
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="user-dropdown"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="0 relative isolate size-8 rounded-full">
                <Avatar className="size-8">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                  <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>

              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm leading-tight font-medium">
                    {session.user.name}{" "}
                  </p>
                  <p className="text-muted-foreground text-xs leading-tight">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border opacity-80" />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  <span>Theme</span>
                </div>
                <SwitchPrimitives.Root
                  checked={theme === "dark"}
                  onClick={(e) => {
                    const { clientX: x, clientY: y } = e;
                    toggleTheme({ x, y });
                  }}
                  className={cn(
                    "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                    theme === "dark" ? "bg-primary" : "bg-input"
                  )}
                >
                  <SwitchPrimitives.Thumb
                    className={cn(
                      "bg-background pointer-events-none flex size-4 items-center justify-center rounded-full shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
                    )}
                  >
                    {theme === "dark" ? <Moon className="size-2.5" /> : <Sun className="size-2.5" />}
                  </SwitchPrimitives.Thumb>
                </SwitchPrimitives.Root>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border opacity-80" />
              <DropdownMenuItem asChild>
                <Link href="/privacy-policy">
                  <BookLock />
                  Privacy Policy
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
