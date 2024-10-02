"use client";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface MultiSelectProps {
  placeholder: string;
  collections: CollectionType[]; // Lista kolekcija koje se mogu izabrati
  value: string[]; // Lista izabranih ID-eva kolekcija
  setOpen: (open: boolean) => void; // Funkcija za postavljanje otvorenosti dropdown-a

  // Funkcije za odabiranje i uklanjanje kolekcija
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

// Komponenta za više selekcija
const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections,
  value,
  onChange,
  onRemove,
  setOpen, // Dodajte setOpen ovde
}) => {
  const [inputValue, setInputValue] = useState(""); // Drži trenutnu vrednost input polja
  const open = !!inputValue;

  // Lista izabranih kolekcija na osnovu ID-eva
  let selected: CollectionType[];

  if (value.length === 0) {
    selected = [];
  } else {
    selected = value.map((id) =>
      collections.find((collection) => collection._id === id)
    ) as CollectionType[];
  }

  // Lista kolekcija koje nisu izabrane
  const selectables = collections.filter((collection) => !selected.includes(collection));

  return (
    <Command className="overflow-visible z-20 bg-grey text-gold-1">
      <div className="flex gap-1 flex-wrap border rounded-md">
        {selected.map((collection) => (
          <Badge key={collection._id}>
            {collection.title}
            <button
              type="button"
              className="ml-1 hover:text-black"
              onClick={() => onRemove(collection._id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => {
            setOpen(false); 
          }}
          onFocus={() => setOpen(true)} 
        />
      </div>

      <div className={`relative mt-2 ${open ? 'absolute' : ''}`} style={{ zIndex: 40 }}>
        {open && (
          <CommandGroup className="absolute w-full z-50 top-0 overflow-auto border rounded-md shadow-md">
            {selectables.map((collection) => (
              <CommandItem
                key={collection._id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  onChange(collection._id);
                  setInputValue(""); // Resetovanje input vrednosti nakon odabira
                }}
                className="hover:bg-grey-2 cursor-pointer"
              >
                {collection.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;
