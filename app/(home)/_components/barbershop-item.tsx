import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Barbershop } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";

interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarberShopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Card className="min-w-[167px] max-w-[167px] rounded-2xl">
      <CardContent className="p-0">
        <div className="px-1 pt-1 relative">
          <div className="absolute top-2 left-2 z-50">
            <Badge variant="secondary" className="flex items-center justify-center gap-1 opacity-90">
              <StarIcon size={12} className="fill-primary text-primary" />
              <span>5,0</span>
            </Badge>
          </div>

          <Image
            className="h-[159px] w-full rounded-2xl object-cover"
            src={barbershop.imageUrl}
            alt="BarberShop Avatar"
            height={0}
            width={0}
            sizes="100vw"
          />
        </div>

        <div className="px-3 pb-3">
          <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap">
            {barbershop.name}
          </h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">
            {barbershop.address}
          </p>
          <Button className="w-full mt-3" variant="secondary">
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarberShopItem;
