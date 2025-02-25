"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "./button";
import { Switch } from "./switch";
import { toast } from "sonner";

interface RenameDialogProps {
  SongId: Id<"songs">;
  children: React.ReactNode;
  released: boolean;
}

export const ReleaseDialog = ({ SongId, children, released }: RenameDialogProps) => {
  const update = useMutation(api.songs.updatePublicbyId);
  const [isUpdating, setIsUpdating] = useState(false);
  const [release, setRelease] = useState(released);
  const [open, setOpen] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    update({ id: SongId, released: release })
      .then(() => {
        setOpen(false);
      })
      .catch((e) => toast.error("something went wrong"))
      .finally(() => {
        setIsUpdating(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Release Your Project</DialogTitle>
            <DialogDescription>
              Select yes to make the copyright public or no to become private.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 flex justify-between items-center">
            <Switch
              checked={release}
              onCheckedChange={() => {
                setRelease(!release);
              }}
            />
            {release && <div className="text-[#000] font-semibold text-xl enter">YES</div>}
            {!release && <div className="text-[#000] font-semibold text-xl enter">NO</div>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isUpdating}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="text-[#000]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating} onClick={(e) => e.stopPropagation}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
