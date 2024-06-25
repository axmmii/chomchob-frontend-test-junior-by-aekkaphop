"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from 'next/image';
import Bagwhite from '../../[public]/bagwhite.svg';
import ArrowLeft from '../../[public]/arrow-left.svg';
import { fetchPokemonDetails, fetchPokemonList } from '../../api/api';
import { PokemonCard } from "@/app/[components]/PokemonCard";
import { PokemonListItem } from "@/app/[components]/PokemonListItem";
import Header from '../../[components]/Header/Header'; 
import Footer from "@/app/[components]/Footer/Footer";

interface Pokemon {
  name: string;
  types: Array<{ type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  sprites: { other: { 'official-artwork': { front_default: string } } };
  image: string;
  size: number;
}

export default function PokemonDetail() {
  const router = useRouter();
  const { name } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (name) {
      const pokemonName = Array.isArray(name) ? name[0] : name;
      fetchPokemonDetails(pokemonName).then(data => setPokemon(data));
    }

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
  }, [name]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPokemonList(12);
      setPokemons(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setSearchResults([]);
    } else {
      const filteredPokemons = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredPokemons);
    }
  }, [searchQuery, pokemons]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cartItems.find((item: any) => item.name === pokemon?.name);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({ name: pokemon?.name, quantity });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    router.push('/pokemontotal');
  };

  if (!pokemon) return <div className="flex flex-col min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        clearSearch={clearSearch}
        cartCount={cartCount}
      />
      <div className="container p-4 mt-[200px] mb-[380px] flex-grow">
        <div className="flex items-center ml-[120px] mb-4 " >
          <Image src={ArrowLeft} alt={"arrowleft"} className="mr-[5px] cursor-pointer" onClick={() => router.back()}/>
          <span className="text-lg font-medium cursor-pointer" onClick={() => router.back()}>Back</span>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg ml-[120px] w-[1200px]">
          <div className="flex flex-col md:flex-row items-center">
            <Image
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              width={300}
              height={300}
              className="rounded-lg"
            />
            <div className="mt-4 md:mt-0 md:ml-[140px] flex flex-col items-start">
              <h1 className="text-3xl font-semibold text-[#484848]">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h1>
              <div className="flex mt-2">
                {pokemon.types.map((type) => (
                  <span key={type.type.name} className="bg-[#FFF4E3] text-[#FFAE33] px-2 py-1 rounded-[8px] mr-2 font-semibold">
                    {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center">
                <h2 className="text-[#373737] mr-[44px]">Stats:</h2>
                <p className="text-gray-600">
                  {pokemon.stats.map((stat) => stat.stat.name).join(', ')}
                </p>
              </div>
              <div className="mt-4 flex items-center">
                <h2 className="text-[#373737] mr-[23px]">Abilities:</h2>
                <p className="text-[#373737]">
                  {pokemon.abilities
                    .map((ability) => {
                      const name = ability.ability.name;
                      return name.charAt(0).toUpperCase() + name.slice(1);
                    })
                    .join(', ')}
                </p>
              </div>
              <div className="mt-10 flex items-center">
                <h2 className="text-[#373737] mr-[23px]">Quantity:</h2>
                <div className="flex items-center border border-t border-b border-[#373737] rounded-l-xl rounded-r-xl">
                  <button
                    className="border-[#373737] px-4 py-2 rounded-l-lg"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <span className="border-[#373737] bg-[#F5F5F5] px-6 py-2">{quantity}</span>
                  <button 
                    className="px-4 py-2"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className={`mt-10 bg-[#FF6F61] h-[54px] text-white px-12 py-4 rounded-lg flex items-center transition-transform duration-300 ease-in-out ${
                  isAnimating ? 'transform scale-105' : ''
                }`}
              >
                <Image src={Bagwhite} className="mr-2" alt={"bagwhite"} />
                Add To Pocket
              </button>
            </div>
          </div>
        </div>
        {searchResults.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            <div className={`mt-4 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
              {searchResults.map((pokemon) => (
                viewMode === 'grid' ? (
                  <PokemonCard key={pokemon.name} name={pokemon.name} />
                ) : (
                  <PokemonListItem key={pokemon.name} name={pokemon.name} size={0} />
                )
              ))}
            </div>
          </div>
        )}
      </div>
    <Footer/>
    </div>
  );
}