import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SortOrder({ value, onValueChange }:  { value: string, onValueChange: (value: string) => void }) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Order..." />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Order...</SelectLabel>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
