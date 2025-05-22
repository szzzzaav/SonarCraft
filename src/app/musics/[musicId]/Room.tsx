"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { getUsers, getSongs } from "./action";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { Instrument } from "@/types/instruments";

type User = { id: string; name: string; avatar: string; email: string };

export function Room({
  children,
  timeline,
  instruments,
}: {
  children: ReactNode;
  timeline: number;
  instruments: Instrument[];
}) {
  const params = useParams();

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch {
        toast.error("Failed to fetch users");
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={async () => {
        const endpoint = "/api/liveblocks-auth";
        const room = params.musicId as string;
        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ room }),
        });

        return await response.json();
      }}
      resolveUsers={({ userIds }) => {
        return userIds.map((userId) => {
          const user = users.find((user) => user.id === userId);
          return user ? user : undefined;
        });
      }}
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;
        if (text) {
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }

        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const songs = await getSongs(roomIds as Id<"songs">[]);
        return songs.map((song) => ({
          id: song.id,
          name: song.name,
        }));
      }}
    >
      <RoomProvider
        id={params.musicId as string}
        initialStorage={{ timeline, instruments }}
        initialPresence={
          {
            selectedId: 0,
            editingTrack: {
              instrumentId: null,
              instrumentName: "",
            },
          } as any
        }
      >
        <ClientSideSuspense fallback={"Room Loading..."}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
