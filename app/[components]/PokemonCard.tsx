import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchPokemonDetails } from '../api/api';
import { PokemonImage } from './PokemonImage';
import { typeColorClass } from '../utils';

interface PokemonCardProps {
  name: string;
}

export function PokemonCard({ name }: PokemonCardProps) {
  const [image, setImage] = useState('');
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPokemonDetails(name);
      setImage(data.sprites.other['official-artwork'].front_default);
      setTypes(data.types.map((typeInfo: any) => typeInfo.type.name));
    };

    fetchData();
  }, [name]);

  return (
    <div className="border p-0 rounded-xl shadow-lg transition hover:shadow-xl bg-white w-[260px] h-[430px] mx-auto mt-[20px] mr-[42.2px]">
      <div className="flex flex-col items-center relative">
        {image && (
          <div className="bg-[#FFFFFF] w-[230px]  h-[260px] rounded-t-lg flex justify-center items-center">
            <PokemonImage image={image} name={name} size={220} />
          </div>
        )}
        <div className="bg-[#FAFAFA] w-full font-bold rounded-b-lg p-6 flex flex-col justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-[#373737] text-left w-full">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </h2>
            <div className="flex space-x-2 mt-2 justify-start w-full">
              {types.map((type) => (
                <span
                  key={type}
                  className={`px-2 py-1 rounded text-[#FFAE33] font-bold ${typeColorClass(type)}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
            </div>
          </div>
          <Link href={`/pokemon/${name}`} className="group">
            <button className="mt-4 bg-[#373737] text-white w-full py-2 font-bold rounded-[8px] transition hover:bg-[#FFCB05] hover:text-[#373737] hover:border-[4px] hover:border-[#F8F1D8]">
              Detail
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
