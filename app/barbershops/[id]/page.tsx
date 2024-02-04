import { Button } from "@/app/_components/ui/button";
import { db } from "@/app/_lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import BarbershopInfo from "./_components/barbershop-info";

interface BarberShopDetailsPageProps {
  params: {
    id?: string;
  };
}

const BarberShopDetailsPage = async ({
  params,
}: BarberShopDetailsPageProps) => {
  if (!params.id) {
    // TODO Redirecionar para home page
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!barbershop) {
    // TODO Redirecionar para home page
    return null;
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop}/>
    </div>
  );
};

export default BarberShopDetailsPage;
