"use client"
import './globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PokemonCard } from './[components]/PokemonCard';
import { PokemonListItem } from './[components]/PokemonListItem';
import { fetchPokemonList } from './api/api';
import Image from 'next/image';
import Element from './[public]/element-3.svg';
import Vertical from './[public]/row-vertical.svg';
import Errorsearch from './[public]/search-zoom-in.svg';
import Header from './[components]/Header/Header';
import Footer from './[components]/Footer/Footer';

interface Pokemon {
  name: string;
  url: string;
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const data = await fetchPokemonList(12);
        setPokemons(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
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

  const displayPokemons = searchResults.length > 0 ? searchResults : pokemons;

  return (
    <div className="max-sm:flex flex flex-col min-h-screen  items-center " >
      <Header
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        clearSearch={clearSearch}
        cartCount={cartCount}
      />
      <div className="bg-white flex-grow">
        <div className="container mx-auto p-4 mt-[170px] mb-[116px] flex-grow">
          <div className="flex justify-between items-center mt-4 ">
            <div className="text-[18px] text-[#373737] font-semibold  mr-[1030px]">
              {searchQuery === '' ? `Products (${pokemons.length})` : `Search Result (${searchResults.length} Product${searchResults.length !== 1 ? 's' : ''})`}
            </div>
            <div className="flex space-x-0 mr-[30px] absolute right-[160px] ">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-[8px] rounded-l-[6px] ${viewMode === 'grid' ? 'bg-[#FFCB05]' : 'bg-[#F9F9F9]'} flex items-center justify-center w-10 h-10`}
                title="Grid view"
              >
                <Image src={Element} alt="Grid View" className="w-[16px] h-[16px]" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-[8px] rounded-r-[6px] ${viewMode === 'list' ? 'bg-[#FFCB05]' : 'bg-[#F9F9F9]'} flex items-center justify-center w-10 h-10`}
                title="List view"
              >
                <Image src={Vertical} alt="List View" className="w-[16px] h-[16px]" />
              </button>
            </div>
          </div>
          <div className="bg-white mb-[380px]">
            {searchQuery !== '' && searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-[100px] mb-[200px]">
                <div className="text-4xl mt-[25px]"><Image src={Errorsearch} alt="errorsearch" /></div>
                <div className="text-xl font-normal mt-4 font-inter text-[#909090]">Oops! Nothing was found for “ {searchQuery} ”</div>
                <div className="text-xl font-normal font-inter text-[#909090]">Please try to search for something else.</div>
              </div>
            ) : (
              <div className={`mt-4 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
                {displayPokemons.map((pokemon) => (
                  viewMode === 'grid' ? (
                    <PokemonCard key={pokemon.name} name={pokemon.name} />
                  ) : (
                    <PokemonListItem key={pokemon.name} name={pokemon.name} size={0} />
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}