import { useState } from "react"
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
import { createRole } from "@/modules/role/role"

export function AddRoleDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");

  const [nameError, setNameError] = useState("");

  const resetForm = () => {
    setName("");
    setNameError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await createRole(name);
      setIsOpen(false);
      resetForm();
      toast.success("Role berhasil ditambahkan!", {position: "top-right"});
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || "Gagal menambah role!", {position: "top-right"});
    }
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError("");
  };

  const validateForm = () => {
    let isValid = true;
    if (!name) {
      setNameError("Nama harus diisi");
      isValid = false;
    } else if (!validateName(name)) {
      setNameError("Nama tidak valid");
      isValid = false;
    }
    return isValid;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Tambah Role</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Tambah Role Baru</DialogTitle>
            <DialogDescription>
              Silahkan isi data role yang ingin ditambahkan.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-role" className="text-left">Nama Role</Label>
              <Input id="name-role" name="name-role" placeholder="Nama Role" className="bg-white" value={name} onChange={handleChangeName} />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
