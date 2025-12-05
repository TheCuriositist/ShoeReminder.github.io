import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    value: string;
    title?: string;
}

export function QRCodeModal({ isOpen, onClose, value, title = "Scan to Add to Calendar" }: QRCodeModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md border-4 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-center">{title}</DialogTitle>
                    <DialogDescription className="text-center">
                        Scan this QR code with your mobile camera to add the event to your calendar.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center p-6">
                    <div className="bg-white p-4 rounded-xl border-4">
                        <QRCodeSVG
                            value={value}
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
