import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SortOrder({ value, onValueChange }: { value?: string, onValueChange?: (v: string) => void }) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full max-w-48 bg-white">
                <SelectValue placeholder="Order..." />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Urutan</SelectLabel>
                    <SelectItem value="asc">Ascending (A-Z)</SelectItem>
                    <SelectItem value="desc">Descending (Z-A)</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
