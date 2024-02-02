import Header from "../_components/header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";

export default function Home() {
  return (
    <main>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">Olá, Miguel!</h2>
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
    </main>
  );
}
