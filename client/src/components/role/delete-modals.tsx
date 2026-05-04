import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteRole } from "@/modules/role/role";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteModalRole({ roleId }: { roleId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleDelete = async () => {
    try {
      const res = await deleteRole(roleId);
      toast.success(res.message, { position: "top-right" });
      setIsOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message, { position: "top-right" });
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah anda yakin ingin menghapus Role ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Role ini akan dihapus dari
            sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
