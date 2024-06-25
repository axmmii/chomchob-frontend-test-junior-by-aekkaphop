import Image from "next/image";

interface PokemonImageProps {
  image: string;
  name: string;
  size: number; 
}

export function PokemonImage({ image, name, size }: PokemonImageProps) { 
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={image}
        alt={"Picture of " + name}
        layout="fill"
        objectFit="contain"
        className="transition-opacity opacity-0 duration-[2s] rounded-t-xl"
        onLoadingComplete={(image) => image.classList.remove("opacity-0")}
      />
    </div>
  );
}
