import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMdMore } from "react-icons/io";
import { CheckCheckIcon, ExternalLinkIcon, FilePenIcon, TrashIcon } from "lucide-react";
import { RemoveDialog } from "@/components/ui/remove-dialog";
import { RenameDialog } from "@/components/ui/rename-dialog";
import { ReleaseDialog } from "@/components/ui/release-dialog";

interface DrowdownMenuProps {
  SongId: Id<"songs">;
  title: string;
  onNewTabClick: (id: Id<"songs">) => void;
  released: boolean;
}

export const DrowdownMenu = ({ SongId, title, onNewTabClick, released }: DrowdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full">
          <IoMdMore className="scale-150" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <RenameDialog SongId={SongId} initialTitle={title}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <FilePenIcon className="size-4 mr-2" />
            Rename
          </DropdownMenuItem>
        </RenameDialog>
        <RemoveDialog SongId={SongId}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <TrashIcon className="size-4 mr-2" />
            Remove
          </DropdownMenuItem>
        </RemoveDialog>
        <DropdownMenuItem onClick={() => onNewTabClick(SongId)}>
          <ExternalLinkIcon className="size-4 mr-2" />
          Open in a new tab
        </DropdownMenuItem>
        <ReleaseDialog SongId={SongId} released={released}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <CheckCheckIcon className="size-4 mr-2" />
            Modify public status
          </DropdownMenuItem>
        </ReleaseDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
