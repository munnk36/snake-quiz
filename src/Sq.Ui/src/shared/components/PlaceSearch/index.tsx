
import { useState } from 'react';
import { Place, usePlacesSearch } from './hooks';
import styles from './styles.module.scss'

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

    const handlePlaceSelect = (place: Place) => {
        onPlaceSelect(place.id.toString());
        setSearchTerm(place.display_name);
    };

    return (
        <div className={styles.searchContainer}>
            <label className={styles.searchLabel}>
                <span className={styles.searchHint}>Filter by Region (Optional)</span>
            </label>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="e.g. Argentina or New York..."
                className={styles.searchInput}
                aria-label="Search places"
            />
            
            {isLoading && (
                <div className={styles.loadingState}>
                    Searching places...
                </div>
            )}

            {error && (
                <div className={styles.errorState}>
                    {error.message}
                </div>
            )}

            {!isLoading && places.length > 0 && (
                <ul className={styles.resultsList} role="listbox">
                    {places.map((place) => (
                        <li
                            key={place.id}
                            onClick={() => handlePlaceSelect(place)}
                            className={styles.resultItem}
                            role="option"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handlePlaceSelect(place);
                                }
                            }}
                        >
                            {place.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};