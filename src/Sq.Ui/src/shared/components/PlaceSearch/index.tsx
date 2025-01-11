import { useState } from 'react';
import { usePlacesSearch } from './hooks';

interface Props {
    onPlaceSelect: (placeId: string) => void;
}

export default function PlaceSearch({ onPlaceSelect }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const { places, isLoading, error, searchPlaces } = usePlacesSearch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        searchPlaces(value);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search for a region..."
                className="w-full p-2 border rounded"
            />
            {isLoading && <div className="mt-2">Loading...</div>}
            {error && <div className="mt-2 text-red-500">{error.message}</div>}
            {places.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
                    {places.map((place) => (
                        <li
                            key={place.id}
                            onClick={() => {
                                onPlaceSelect(place.id.toString());
                                setSearchTerm(place.display_name);
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {place.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
