import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchPokemonDetails } from '../api/api';
import { PokemonImage } from './PokemonImage';
import { typeColorClass } from '../utils';

interface PokemonListItemProps {
  name: string;
  size: number;
}

export function PokemonListItem({ name }: PokemonListItemProps) {
  const [image, setImage] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [abilities, setAbilities] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPokemonDetails(name);
      setImage(data.sprites.other['official-artwork'].front_default);
      setTypes(data.types.map((typeInfo: any) => typeInfo.type.name));
      setAbilities(data.abilities.map((abilityInfo: any) => abilityInfo.ability.name));
    };

    fetchData();
  }, [name]);

  return (
    <Link href={`/pokemon/${name}`} className="group flex items-center space-x-4 mt-[40px] mr-[57px] ">
      <div className="border p-4 rounded-xl transition hover:shadow-xl bg-white h-[140px] w-[1200px] zn:w-[1210px] mx-auto flex items-center space-x-4 ">
        {image && <PokemonImage image={image} name={name} size={120} />}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-left">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </h2>
          <div className="flex space-x-2 mt-2 justify-start">
            {types.map((type) => (
              <span key={type} className={`px-2 py-1 rounded-[8px] font-bold ${typeColorClass(type)}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
          </div>
          <div className="flex mt-4 text-[#666666]">
            Abilities: {abilities.map(ability => ability.charAt(0).toUpperCase() + ability.slice(1)).join(', ')}
          </div>
        </div>
      </div>
    </Link>
  );
}
