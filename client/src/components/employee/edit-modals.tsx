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
import { Edit } from "lucide-react"

export function EditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState<GetAllRolesDtoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getAllRoles({
        page: 1,
        limit: 100,
        sortBy: "name",
        sortOrder: "asc",
        search: ""
      })
        .then((res) => {
          setRoles(res.data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch roles:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setRoles([]);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="warning" size="icon">
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Karyawan</DialogTitle>
            <DialogDescription>
              Silahkan isi data karyawan yang ingin diubah.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1" className="text-left">Nama Lengkap</Label>
              <Input id="name-1" name="name" placeholder="Nama Lengkap" className="bg-white" />
            </Field>
            <Field>
              <Label htmlFor="email-1" className="text-left">Email</Label>
              <Input id="email-1" name="email" type="email" placeholder="you@gmail.com" className="bg-white" />
            </Field>
            <Field>
              <Label htmlFor="password-1" className="text-left">Password</Label>
              <Input id="password-1" name="password" type="password" placeholder="••••••••" />
            </Field>
            <Field>
              <Label htmlFor="role-1" className="text-left">Role</Label>
              <Select>
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
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
