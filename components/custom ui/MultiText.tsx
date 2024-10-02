"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

// Interfejs za propse koji se prosleđuju komponenti MultiText
interface MultiTextProps {
  placeholder: string;
  value: string[]; // Lista trenutnih vrednosti
  //Funkcije za dodavanje ili uklanjanje nove stavke
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}
// Komponenta za unos više tekstualnih stavki
const MultiText: React.FC<MultiTextProps> = ({
  placeholder,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState(""); // Drži trenutnu vrednost input polja

  // Funkcija za dodavanje nove stavke u listu
  const addValue = (item: string) => {
    onChange(item);
    setInputValue(""); // Očisti input polje nakon dodavanja
  };

  return (
    <>
    {/* Input polje za unos novih stavki */}
      <Input className="bg-grey text-gold-1"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { // Kada korisnik pritisne Enter
            e.preventDefault(); // Spreči default ponašanje (slanje forme)
            addValue(inputValue); // Dodaj novu stavku
          }
        }}
      />
     {/* Prikaz svih trenutno izabranih stavki */}
      <div className="flex gap-1 flex-wrap mt-4">
        {value.map((item, index) => (
          <Badge key={index} className="bg-gold text-white">
            {item}
             {/* Dugme za uklanjanje stavke */}
            <button
              className="ml-1 rounded-full outline-none hover:bg-black"
              onClick={() => onRemove(item)}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
};

export default MultiText;