import { useCallback, useState } from 'react';
import { debounce } from '../../utils/debounce';
import { API_ENDPOINTS, API_HOST } from '../../../services/api/constants';

export interface Place {
    id: number;
    name: string;
    display_name: string;
    ancestor_place_ids: number[];
}

interface UsePlacesSearchResult {
    places: Place[];
    isLoading: boolean;
    error: Error | null;
    searchPlaces: (query: string) => void;
}

export function usePlacesSearch(): UsePlacesSearchResult {
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const searchPlaces = useCallback(
        (query: string) => {
            const debouncedSearch = debounce(async (searchQuery: string) => {
                if (!searchQuery.trim()) {
                    setPlaces([]);
                    return;
                }

                setIsLoading(true);
                setError(null);

                try {
                    const response = await fetch(
                        `${API_HOST}${API_ENDPOINTS.PLACES.AUTOCOMPLETE}?q=${encodeURIComponent(searchQuery)}`
                    );
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch places');
                    }

                    const data = await response.json();
                    setPlaces(data.results);
                } catch (err) {
                    setError(err instanceof Error ? err : new Error('Unknown error'));
                } finally {
                    setIsLoading(false);
                }
            }, 300);

            debouncedSearch(query);
        },
        [setPlaces, setIsLoading, setError]
    );

    return { places, isLoading, error, searchPlaces };
}