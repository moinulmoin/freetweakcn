"use client";

import { authClient } from "@/lib/auth-client";

export function UserInfo() {
  const { data: session } = authClient.useSession();

  return (
    <div className="flex flex-col space-y-0.5">
      <p className="text-sm leading-tight font-medium">
        {session?.user.name}
      </p>
      <p className="text-muted-foreground text-xs leading-tight">{session?.user.email}</p>
    </div>
  );
}
