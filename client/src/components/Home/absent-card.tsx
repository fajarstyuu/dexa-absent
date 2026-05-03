import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { useEffect, useState } from "react";
import { CaptureImage } from "./capture-image";
import { isAlreadyabsent } from "@/modules/absents/absents";
import { Spinner } from "../ui/spinner";
import { CheckoutButton } from "./checkout-button";

export function AbsentCard() {
  const [timeRealtime, setTimeRealtime] = useState(
    new Date().toLocaleTimeString(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRealtime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [isAlreadyAbsent, setIsAlreadyAbsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    isAlreadyabsent().then((data) => {
      setIsAlreadyAbsent(data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Item variant="muted" className="py-8 px-4 md:px-6 lg:px-8">
      <ItemContent>
        <ItemTitle className="text-xl md:text-3xl lg:text-5xl">
          {timeRealtime}
        </ItemTitle>
        <ItemDescription>
          Muted background for secondary content.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        {isLoading ? <Spinner /> : isAlreadyAbsent ? <CheckoutButton /> : <CaptureImage />}
      </ItemActions>
    </Item>
  );
}
