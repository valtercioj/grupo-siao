import { useState, useEffect } from "react";
import axios from "axios";
import { Tabs } from "antd";  // Importando o componente Tabs do Ant Design
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Cross } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Iliturgia {
  liturgia: string;
  cor: string;
  primeiraLeitura: {
    referencia: string;
    titulo: string;
    texto: string;
  };
  segundaLeitura: {
    referencia: string;
    titulo: string;
    texto: string;
  };
  salmo: {
    referencia: string;
    titulo: string;
    texto: string;
  };
  evangelho: {
    referencia: string;
    titulo: string;
    texto: string;
  };
}

export default function LandingPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [liturgyData, setLiturgyData] = useState<Iliturgia | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Estado para carregar os dados
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false); // Estado para controlar a visibilidade do calendário

  const fetchLiturgyData = async (date: Date) => {
    try {
      setLoading(true); // Inicia o carregamento
      const dia = date.getDate().toString().padStart(2, "0");
      const mes = (date.getMonth() + 1).toString().padStart(2, "0");
      const response = await axios.get<Iliturgia>(
        `https://liturgia.up.railway.app/?dia=${dia}&mes=${mes}`
      );
      setLiturgyData(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados da liturgia:", error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  useEffect(() => {
    fetchLiturgyData(date);
  }, [date]); // Agora dependemos da data para atualizar

  const updateLiturgyData = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      fetchLiturgyData(newDate);
      setCalendarOpen(false); // Fecha o calendário após a seleção
    }
  };

  const formatText = (text: string) => {
    const parts = text.replace(/(\d+)(?=\s+[A-Za-zÀ-ÿ])/g, '<span class="font-bold">$1</span>');
    return parts.replace(/(\d+)(?=[A-Za-zÀ-ÿ])/g, '$1 ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <header className="bg-amber-800 text-amber-50 py-6 px-4 text-center">
        <Cross className="mx-auto mb-4 h-6 w-6" />
        <h1 className="text-4xl font-serif font-bold">Grupo Sião</h1>
        <p className="mt-2 text-xl font-light">Comunidade Católica Shalom</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        <span className="text-xs text-[#86795a] font-LatoRegular font-semibold mb-2">
          COR LITÚRGICA: {liturgyData?.cor.toUpperCase()}
        </span>

        <h2 className="text-xl font-semibold mb-2">{liturgyData?.liturgia}</h2>

        <Card className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
          <CardHeader className="bg-amber-700 text-amber-50 py-4">
            <div className="flex flex-col md:flex-row md:justify-evenly md:gap-y-0 gap-y-4 items-center">
              <CardTitle className="text-2xl font-serif">Liturgia Diária</CardTitle>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={updateLiturgyData}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent className="w-full">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-t-4 border-amber-700 border-solid rounded-full"></div>
              </div>
            ) : (
              <Tabs defaultActiveKey="firstReading" className="w-full">
                <Tabs.TabPane tab="1ª Leitura" key="firstReading">
                  <h2 className="text-xl font-semibold mb-2">
                    {liturgyData?.primeiraLeitura.titulo}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {liturgyData?.primeiraLeitura.referencia}
                  </p>
                  <p className="text-gray-700 whitespace-pre-line">
                    {formatText(liturgyData?.primeiraLeitura.texto || "")}
                  </p>
                </Tabs.TabPane>

                {liturgyData?.segundaLeitura.texto && (
                  <Tabs.TabPane tab="2ª Leitura" key="secondReading">
                    <h2 className="text-xl font-semibold mb-2">
                      {liturgyData.segundaLeitura.titulo}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {liturgyData.segundaLeitura.referencia}
                    </p>
                    <p className="text-gray-700 whitespace-pre-line">
                       {formatText(liturgyData.segundaLeitura.texto || "")}
                    </p>
                  </Tabs.TabPane>
                )}

                <Tabs.TabPane tab="Salmo" key="psalm">
                  <h2 className="text-xl font-semibold mb-2">
                    {liturgyData?.salmo.titulo}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {liturgyData?.salmo.referencia}
                  </p>
                  <p className="text-gray-700 whitespace-pre-line">
                    {liturgyData?.salmo.texto}
                  </p>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Evangelho" key="gospel">
                  <h2 className="text-xl font-semibold mb-2">
                    {liturgyData?.evangelho.titulo}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {liturgyData?.evangelho.referencia}
                  </p>
                  <p className="text-gray-700 whitespace-pre-line">
                  {formatText(liturgyData?.evangelho.texto || "")}
                  </p>
                </Tabs.TabPane>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="bg-amber-800 text-amber-50 py-4 px-4 text-center mt-8">
        <p>
          &copy; {date.getFullYear()} Grupo Sião - Comunidade Católica Shalom
        </p>
      </footer>
    </div>
  );
}
