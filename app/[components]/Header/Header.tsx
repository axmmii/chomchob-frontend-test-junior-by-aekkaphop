import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Pokemonlogo from '../../[public]/Pokemonlogo.svg';
import Search from '../../[public]/search.svg';
import Location from '../../[public]/Location.svg';
import Discount from '../../[public]/Discount.svg';
import LogoCar from '../../[public]/Group.svg';
import Username from '../../[public]/user.svg';
import Logobagpocket from '../../[public]/bag0.svg';
import closecircle from '../../[public]/close-circle.svg';

interface HeaderProps {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, handleSearchChange, clearSearch, cartCount }) => {
  const router = useRouter();

  return (
    <header className="fixed w-full top-0 left-0 shadow-md z-10">
      <div className="bg-[#FFCB05] text-black p-2 flex justify-between items-center w-full h-[56px]">
        <h1 className="text-[18px] text-[#373737] ml-[100px] sm:ml-[120px] md:flex md:ml-[115px] whitespace-nowrap">Welcome to Pokemon shop!</h1>
        <div className="flex items-center space-x-6 text-[18px] mr-[100px]   md:flex md:mr-[166px]">
          <span className="flex items-center text-[#373737] whitespace-nowrap">
            <Image src={Location} alt="location" className="w-6 mr-[6px]" />
            Contact 123456
          </span>
          <span className="border-l border-[#373737] h-[24px] mx-3 "></span>
          <span className="flex items-center text-[#373737] whitespace-nowrap">
            <Image src={LogoCar} alt="group" className="w-6 mr-[6px]" />
            Track your order
          </span>
          <span className="border-l border-[#373737]  h-[24px] "></span>
          <span className="flex items-center text-[#373737] whitespace-nowrap">
            <Image src={Discount} alt="discount" className="w-6 mr-[6px]  " />
            All Offers
          </span>
        </div>
      </div>
      <div className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src={Pokemonlogo} onClick={() => router.push('/')} alt="Pokemon" className="h-[57px] ml-[180px] cursor-pointer sm:ml-[60px]  md:mr-[50px] md:ml-[50px]" />
        </div>
        <div className="flex-grow mx-8">
          <div className="relative ml-[50px]">
            <input
              type="text"
              id="search"
              name="search"
              autoComplete="off"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search name Pokémon ..."
              className="custom-input h-[58px] p-2 rounded-[15px] pl-10 font-normal bg-gray-100 text-gray-700 border-[1.5px] border-[#F8F8F8] focus:bg-[#FFFFFF] focus:border-[2px] focus:border-[#FFCB05] focus:outline-none md:w-[220px] xl:w-full lg:w-[280px]"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Image src={Search} alt="search" width={20} height={20} />
            </div>
            {searchQuery && (
              <Image
                src={closecircle}
                alt="Clear"
                width={20}
                height={20}
                className="absolute top-1/2 w-[20px] transform -translate-y-1/2 right-4 cursor-pointer"
                onClick={clearSearch}
              />
            )}
          </div>
        </div>
        <div className="flex items-center space-x-5 mr-[160px] text-[#666666]">
          <div className="flex items-center space-x-1 mx-3">
            <Image src={Username} alt="username" className="mr-[5px]" />
            <span className="text-[18px] font-normal">Username</span>
          </div>
          <span className="border-l border-[#D9D9D9] h-[24px] mx-3 ml-[60px]"></span>
          <div className="flex items-center space-x-1 text-[#666666] font-normal relative cursor-pointer" onClick={() => router.push('/pokemontotal')}>
            <Image src={Logobagpocket} alt="bagpocket" className="mr-[5px] cursor-pointer" />
            <span className="text-[18px] font-normal cursor-pointer">Pocket</span>
            {cartCount >= 0 && (
              <span className="absolute top-[1px] right-[61px] bg-[#373737] text-[#F9F9F9] rounded-full w-4 h-4 flex items-center justify-center text-xs md:right-[38px] lg:right-[38px] xl:right-[60px] zc:right-[48px]">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
