import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getAllRoles } from "@/modules/role/role"
import { type GetAllRolesDtoData } from "@/modules/role/dto/get-all-role"
import { Spinner } from "../ui/spinner"
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { GetUserById, UpdateUserById } from "@/modules/employee/employee"
import { toast } from "sonner"
import { validateEmail, validateName } from "@/lib/helper"
import { Edit } from "lucide-react"

export function UpdateEmployeeDialog({userId}: {userId: number}) {
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState<GetAllRolesDtoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleIdError] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setRoleId(null);
    setNameError("");
    setEmailError("");
    setRoleIdError("");
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        GetUserById(userId),
        getAllRoles({
          page: 1,
          limit: 100,
          sortBy: "name",
          sortOrder: "asc",
          search: "",
        })
      ])
        .then(([userRes, rolesRes]) => {
          setName(userRes.data?.name || "");
          setEmail(userRes.data?.email || "");
          setRoleId(userRes.data?.roleId || null);
          setRoles(rolesRes.data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch user and roles:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      resetForm();
      setRoles([]);
    }
  }, [isOpen, userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await UpdateUserById(userId, {
        name,
        email,
        roleId: Number(roleId),
      });
      setIsOpen(false);
      resetForm();
      toast.success("Karyawan berhasil diupdate!", {position: "top-right"});
      window.location.reload();
    } catch (error) {
      toast.error(error?.message || "Gagal mengupdate karyawan!", {position: "top-right"});
    }
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError("");
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleChangeRoleId = (value: string) => {
    setRoleId(Number(value));
    setRoleIdError("");
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
    if (!email) {
      setEmailError("Email harus diisi");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Email tidak valid");
      isValid = false;
    }
    if (!roleId) {
      setRoleIdError("Role harus diisi");
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
            <DialogTitle>Edit Karyawan</DialogTitle>
            <DialogDescription>
              Silahkan isi data karyawan yang ingin diedit.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1" className="text-left">Nama Lengkap</Label>
              <Input id="name-1" name="name" placeholder="Nama Lengkap" className="bg-white" value={name} onChange={handleChangeName} />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </Field>
            <Field>
              <Label htmlFor="email-1" className="text-left">Email</Label>
              <Input id="email-1" name="email" type="email" placeholder="you@gmail.com" className="bg-white" value={email} onChange={handleChangeEmail} />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </Field>
            <Field>
              <Label htmlFor="role-1" className="text-left">Role</Label>
              <Select value={roleId ? roleId.toString() : ""} onValueChange={handleChangeRoleId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    {isLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Spinner className="h-4 w-4" />
                      </div>
                    ) : roles.length > 0 ? (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm text-gray-500">
                        Tidak ada role
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {roleError && <p className="text-red-500 text-sm mt-1">{roleError}</p>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleUpdate}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
