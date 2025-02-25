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
import { Input } from "./input";
import { Button } from "./button";
import { toast } from "sonner";

interface RenameDialogProps {
  SongId: Id<"songs">;
  children: React.ReactNode;
  initialTitle: string;
}

export const RenameDialog = ({ SongId, children, initialTitle }: RenameDialogProps) => {
  const update = useMutation(api.songs.updateTitlebyId);
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [open, setOpen] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    update({ id: SongId, title: title.trim() || "Untitled" })
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
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>Enter a new name for this project</DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              className="text-[#000]"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Project name"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
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
