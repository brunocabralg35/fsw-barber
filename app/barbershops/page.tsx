import { redirect } from "next/navigation";
import BarberShopItem from "../(home)/_components/barbershop-item";
import Header from "../_components/header";
import { db } from "../_lib/prisma";
import Search from "../_components/search";

interface BarbershopProps {
  searchParams: {
    search?: string;
  };
}

const Barbershops = async ({ searchParams }: BarbershopProps) => {
  if (!searchParams.search) {
    return redirect("/");
  }

  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  });

  return (
    <>
      <Header />

      <div className="px-5 mt-6">
        <Search defaultValues={{ search: searchParams.search }} />
      </div>

      {barbershops.length <= 0 ? (
        <h1 className="text-gray-400 font-bold text-xs uppercase px-5 py-6">
          Nenhum resultado encontrado para &quot;{searchParams.search}&quot;
        </h1>
      ) : (
        <div className="px-5 py-6">
          <h1 className="text-gray-400 font-bold text-xs uppercase">
            Resultados para &quot;{searchParams.search}&quot;
          </h1>

          <div className="grid grid-cols-2 mt-3 gap-4">
            {barbershops.map((barbershop) => (
              <div className="w-full" key={barbershop.id}>
                <BarberShopItem barbershop={barbershop} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Barbershops;
