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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Scan this QR code with your mobile camera to add the event to your calendar.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center p-6">
                    <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
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
