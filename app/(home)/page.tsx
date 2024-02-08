import Header from "../_components/header";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import Search from "../_components/search";
import BookingItem from "../_components/booking-item";
import BarberShopItem from "./_components/barbershop-item";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershops, recommendedBarbershops, confirmedBookings] =
    await Promise.all([
      db.barbershop.findMany({}),
      db.barbershop.findMany({
        orderBy: {
          id: "asc",
        },
      }),
      session?.user
        ? db.booking.findMany({
            where: {
              userId: (session?.user as any).id,
              date: {
                gte: new Date(),
              },
            },
            include: {
              service: true,
              barbershop: true,
            },
          })
        : Promise.resolve([]),
    ]);

  return (
    <main>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          Olá,{" "}
          {session?.user?.name
            ? session?.user?.name.split(" ")[0]!
            : "vamos agendar um corte hoje?"}
        </h2>
        <p className="text-sm">
          <span className="capitalize mr-1">
            {format(new Date(), "EEEE", {
              locale: ptBR,
            })}
            ,
          </span>
          {format(new Date(), "d 'de' MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </p>
      </div>
      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="mt-6">
        {confirmedBookings.length > 0 && (
          <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
            Agendamentos
          </h2>
        )}

        <div className="px-5 mt-6 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
          Recomendados
        </h2>

        <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden ">
          {recommendedBarbershops.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
              <BarberShopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
          Populares
        </h2>

        <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden mb-[4.5rem]">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
              <BarberShopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
