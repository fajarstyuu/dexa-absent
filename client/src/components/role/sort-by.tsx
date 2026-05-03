import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SortBy({ value, onValueChange }: { value?: string, onValueChange?: (v: string) => void }) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full max-w-48 bg-white">
                <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Kategori</SelectLabel>
                    <SelectItem value="createdAt">Waktu Dibuat</SelectItem>
                    <SelectItem value="name">Nama</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
