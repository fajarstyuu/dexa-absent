import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { absent } from "@/modules/absents/absents";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function CaptureImage() {
  const cameraPict = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let camera: MediaStream | null = null;

    async function startCamera() {
      try {
        camera = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cameraPict.current) {
          cameraPict.current.srcObject = camera;
        }
      } catch (error) {
        console.log("Error accessing camera:", error);
      }
    }

    if (isOpen) {
      startCamera();
    }

    return () => {
      if (camera) {
        camera.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleCapture = () => {
    if (cameraPict.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        canvasRef.current.width = cameraPict.current.videoWidth;
        canvasRef.current.height = cameraPict.current.videoHeight;
        ctx.drawImage(cameraPict.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageData);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCapturedImage(null);
    }
  };

  const handleSave = async () => {
    if (capturedImage) {
      try {
        setIsLoading(true);
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        const extension = blob.type.split("/")[1] || "jpeg";
        const file = new File([blob], `absent.${extension}`, {
          type: blob.type,
        });

        const data = await absent(file);

        toast.success(data.message || "Absen berhasil");
        setIsOpen(false);
        setCapturedImage(null);
        window.location.reload();
      } catch (error: any) {
        toast.error(error.message || "Gagal absen");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <form>
        <DialogTrigger asChild>
          <Button size="lg" variant="outline" className="text-lg">
            Absen
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Capture Absensi</DialogTitle>
            <DialogDescription>
              Ambil foto untuk verifikasi kehadiran Anda
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {!capturedImage ? (
              <>
                <video
                  ref={cameraPict}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg bg-black"
                />
                <canvas ref={canvasRef} className="hidden" />
              </>
            ) : (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full rounded-lg"
              />
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            {!capturedImage ? (
              <Button onClick={handleCapture} className="gap-2">
                <Camera className="h-4 w-4" />
                Capture
              </Button>
            ) : (
              <>
                <Button type="button" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                  Save
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
