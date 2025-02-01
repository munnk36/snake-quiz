
export interface ObservationPhoto {
    url: string;
    attribution: string;
}

export interface Observation {
    id: number;
    species_guess: string;
    photos: ObservationPhoto[];
    place_guess: string;
    user: {
        login: string;
        name: string;
    };
    taxon: Taxon;
    license_code: string;
}

export interface ObservationResponse {
    total_results: number;
    results: Observation[];
}

export interface Taxon {
    id: number;
    name: string;
    preferred_common_name?: string;
    ancestor_ids: number[];
    extinct: boolean;
    iconic_taxon_name: string;
    is_active: boolean;
    min_species_taxon_id: number;
    rank: string;
    rank_level: number;
    children: Taxon[];
}

export interface SimilarSpeciesResult {
    taxon: Taxon;
    count: number;
}

export interface SimilarSpeciesResponse {
    total_results: number;
    page: number;
    per_page: number;
    results: SimilarSpeciesResult[];
}

export interface SpeciesCount {
    count: number;
    taxon: Taxon;
}
