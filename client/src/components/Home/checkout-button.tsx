import { absentCheckout } from "@/modules/absents/absents";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function CheckoutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const handleCheckout = () => {
        setIsLoading(true);
        absentCheckout().then((data) => {
            setIsLoading(false);
            toast.success(data.message, { position: "top-right" });
            window.location.reload();
        }).catch((error) => {
            setIsLoading(false);
            toast.error(error.message, { position: "top-right" });
        });
    }
    return (
        <Button size="lg" variant="outline" className="text-lg" onClick={handleCheckout} disabled={isLoading}>
            {isLoading ? <Spinner className="h-4 w-4" /> : "Absen Keluar"}
        </Button>
    )
}