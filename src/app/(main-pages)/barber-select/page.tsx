import Image from "next/image";

const barberSelection = () => {
  const barbers = [
    {
      name: "Igor",
      especiality: "Cortes Clássicos",
      description: "Profissional experiente e qualificado",
      image: "/images/barber-igor.jpg",
    },
    {
      name: "Jhélita",
      especiality: "Cortes Modernos",
      description: "Profissional detalhista e eficiente",
      image: "/images/barber.jpg",
    },
    {
      name: "Cleitin",
      especiality: "Cortes afro e Barba",
      description: "Especialização em modelagem de barba",
      image: "/images/barber.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Título */}
        <h1 className="mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-black text-transparent md:text-5xl">
          Escolha seu barbeiro
        </h1>

        {/* Container de Barbeiros */}
        <div className="flex flex-row justify-center gap-8">
          {barbers.map((barber, index) => (
            <div
              key={index}
              className="w-1/3 overflow-hidden rounded-xl bg-zinc-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Imagem Vertical */}
              <div className="h-[500px] w-full">
                <Image
                  src={barber.image}
                  alt={barber.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Informações do Barbeiro */}
              <div className="p-6 text-center">
                <h2 className="mb-2 text-2xl font-bold text-purple-400">
                  {barber.name}
                </h2>
                <h3 className="mb-4 text-lg text-zinc-300">
                  {barber.especiality}
                </h3>
                <p className="mb-6 text-zinc-400">{barber.description}</p>

                <button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-pink-700">
                  Selecionar Barbeiro
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default barberSelection;
