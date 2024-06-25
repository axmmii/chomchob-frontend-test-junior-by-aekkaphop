"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image'; 
import Header from '../[components]/Header/Header';
import Trashalt from '../[public]/trashalt.svg';
import { fetchPokemonDetails } from '../api/api';
import Footer from '../[components]/Footer/Footer';

interface Pokemon {
  name: string;
  types: string[];
  image: string;
  quantity: number;
}

const PokemonTotalPage = () => {
  const [cart, setCart] = useState<Pokemon[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    const fetchPokemonData = async () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const updatedCart = await Promise.all(
        cartItems.map(async (item: any) => {
          const data = await fetchPokemonDetails(item.name);
          return {
            name: data.name,
            types: data.types.map((typeInfo: any) => typeInfo.type.name),
            image: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
            quantity: item.quantity,
          };
        })
      );
      setCart(updatedCart);
      setTotalQuantity(updatedCart.reduce((total, item) => total + item.quantity, 0));
    };

    fetchPokemonData();
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRemove = (name: string) => {
    const updatedCart = cart.filter((item) => item.name !== name);
    setCart(updatedCart);
    setTotalQuantity(updatedCart.reduce((total, item) => total + item.quantity, 0));
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        clearSearch={clearSearch}
        cartCount={totalQuantity}
      />
      <main className="p-6 flex mt-[200px]  mb-[380px] md:flex-row">
        <div className="w-full md:w-[1054px] bg-white rounded-[8px] shadow ml-[100px] md:mb-0">
          <h2 className="text-xl font-bold p-6 ">Pocket list ({cart.length})</h2>
          {cart.length === 0 ? (
            <div className="p-6 text-center text-gray-500 mt-10">No Pokémon available</div>
          ) : (
            <table className="w-full text-left ">
              <thead>
                <tr>
                  <th className="p-6 font-bold">Product name</th>
                  <th className="pb-2 font-bold">Quantity</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((pokemon) => (
                  <tr key={pokemon.name} className="border-t" style={{ borderColor: '#F2F2F2' }}>
                    <td className="p-6 py-2 flex items-center">
                      <Image src={pokemon.image} alt={pokemon.name} width={500} height={500} className="w-[82.48px] h-[77.78px] mr-4 mb-4 mt-4" />
                      <div>
                        <div className="font-bold mb-2">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
                        <div className="flex space-x-2 mb-4">
                          {pokemon.types.map((type) => (
                            <span key={type} className="bg-[#FFF4E3] text-[#FFAE33] px-2 py-1 text-xs rounded-[8px] font-bold">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className='ml-[25px] font-medium'>{pokemon.quantity}</div>
                    </td>
                    <td className="py-2">
                      <button onClick={() => handleRemove(pokemon.name)}>
                        <Image src={Trashalt} alt={'trashalt'} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <div className="bg-white rounded-[8px] shadow w-[300px] h-auto mr-[40px] md:ml-12 flex-shrink-0">
            <div className="bg-[#FFF9E3] rounded-t-lg p-2">
              <h2 className="text-lg font-bold ml-2">Order Summary</h2>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>Subtotal</div>
                <div className="font-bold">{cart.length} Product</div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div>Quantity</div>
                <div className="font-bold">{totalQuantity} Quantity</div>
              </div>
              <button className="bg-[#FF6F61] text-[#F9F9F9] mt-20 mb-2 p-2 rounded-[8px] w-full h-[55px]">Proceed To Checkout</button>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default PokemonTotalPage;
