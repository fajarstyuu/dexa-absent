import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { validateName } from "@/lib/helper"
import { getRoleById, updateRoleById } from "@/modules/role/role"
import { Edit } from "lucide-react"
import { Spinner } from "../ui/spinner"

export function UpdateRoleDialog({ roleId }: { roleId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const resetForm = () => {
    setName("");
    setNameError("");
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getRoleById(roleId)
        .then((res) => {
          setName(res.data?.name || "");
        })
        .catch((err) => {
          console.error("Failed to fetch role:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      resetForm();
    }
  }, [isOpen, roleId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await updateRoleById(roleId, { name });
      setIsOpen(false);
      resetForm();
      window.location.reload();
      toast.success("Role berhasil diupdate!", {position: "top-right"});
    } catch (error: any) {
      toast.error(error?.message || "Gagal mengupdate role!", {position: "top-right"});
    }
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError("");
  };

  const validateForm = () => {
    let isValid = true;
    if (!name) {
      setNameError("Nama role harus diisi");
      isValid = false;
    } else if (!validateName(name)) {
      setNameError("Nama role tidak valid");
      isValid = false;
    }
    return isValid;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="warning" size="icon">
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Silahkan isi data role yang ingin diedit.
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <FieldGroup>
              <Field>
                <Label htmlFor="name-role" className="text-left">Nama Role</Label>
                <Input id="name-role" name="name-role" placeholder="Nama Role" className="bg-white" value={name} onChange={handleChangeName} />
                {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
              </Field>
            </FieldGroup>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleUpdate} disabled={isLoading}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
