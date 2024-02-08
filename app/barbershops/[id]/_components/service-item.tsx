"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale/pt-BR";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import getDayBookings from "../_actions/get-day-bookings";

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem = ({
  service,
  isAuthenticated,
  barbershop,
}: ServiceItemProps) => {
  const router = useRouter();

  const { data } = useSession();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>(undefined);
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!date) return;

    const refreshAvailableHours = async () => {
      const _dayBookings = await getDayBookings(barbershop.id, date);
      setDayBookings(_dayBookings);
    };

    refreshAvailableHours();
  }, [date, barbershop.id]);

  const handleBookingClick = () => {
    if (!isAuthenticated) return signIn("google");
  };

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const handleHourClick = (time: string) => setHour(time);

  const timeList = useMemo(() => {
    if (!date) return [];

    return generateDayTimeList(date).filter((time) => {
      // se houver alguam reserva com a hora e minutos igual a time, não incluir
      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      if (!booking) return true;

      return false;
    });
  }, [date, dayBookings]);

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true);
    try {
      if (!hour || !date || !data?.user) {
        return;
      }

      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);
      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await saveBooking({
        barbershopId: barbershop.id,
        serviceId: service.id,
        userId: (data.user as any).id,
        date: newDate,
      });
      setSheetIsOpen(false);
      setHour(undefined);
      setDate(undefined);
      toast("Reserva realizada com sucesso", {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (e) {
      console.error(e);
    }
    setSubmitIsLoading(false);
  };

  return (
    <div>
      <Card>
        <CardContent className="p-3">
          <div className="flex gap-4 items-center">
            <div className="relative min-h-[110px] max-h-[110px] min-w-[110px] max-w-[110px]">
              <Image
                src={service.imageUrl}
                alt={service.name}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col w-full">
              <h2 className="font-bold">{service.name}</h2>
              <p className="text-sm text-gray-400">{service.description}</p>

              <div className="flex items-center justify-between mt-3">
                <p className="font-bold text-sm text-primary">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(service.price))}
                </p>

                <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="secondary" onClick={handleBookingClick}>
                      Reservar
                    </Button>
                  </SheetTrigger>

                  <SheetContent className="p-0">
                    <SheetHeader className="text-left py-6 px-5 border-b border-secondary">
                      <SheetTitle>Fazer reserva</SheetTitle>
                    </SheetHeader>

                    <div className="py-6">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateClick}
                        locale={ptBR}
                        fromDate={addDays(new Date(), 1)}
                        styles={{
                          head_cell: {
                            width: "100%",
                            textTransform: "capitalize",
                          },
                          cell: {
                            width: "100%",
                          },
                          button: {
                            width: "100%",
                          },
                          nav_button_previous: {
                            width: "32px",
                            height: "32px",
                          },
                          nav_button_next: {
                            width: "32px",
                            height: "32px",
                          },
                          caption: {
                            textTransform: "capitalize",
                          },
                        }}
                      />
                    </div>

                    {/* Mostrar lista de horários apenas se alguma data estiver selecionada */}
                    {date && (
                      <div className="py-6 px-5 border-t border-solid border-secondary flex overflow-x-auto gap-3 [&::-webkit-scrollbar]:hidden">
                        {timeList.map((time) => (
                          <Button
                            variant={hour === time ? "default" : "outline"}
                            className="rounded-full"
                            key={time}
                            onClick={() => handleHourClick(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="py-6 px-5 border-t border-solid border-secondary">
                      <Card>
                        <CardContent className="p-3 gap-2 flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="font-bold">{service.name}</h2>
                            <h3 className="font-bold text-sm">
                              {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(Number(service.price))}
                            </h3>
                          </div>

                          {date && (
                            <div className="flex justify-between items-center">
                              <h3 className="text-gray-400 text-sm">Data</h3>
                              <h4 className="text-sm">
                                {format(date, "dd 'de' MMMM", {
                                  locale: ptBR,
                                })}
                              </h4>
                            </div>
                          )}

                          {hour && (
                            <div className="flex justify-between items-center">
                              <h3 className="text-gray-400 text-sm">Horário</h3>
                              <h4 className="text-sm">{hour}</h4>
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <h3 className="text-gray-400 text-sm">Barbearia</h3>
                            <h4 className="text-sm">{barbershop.name}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <SheetFooter className="px-5">
                      <Button
                        disabled={!hour || !date || submitIsLoading}
                        onClick={handleBookingSubmit}
                      >
                        {submitIsLoading && (
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirmar reserva
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceItem;
